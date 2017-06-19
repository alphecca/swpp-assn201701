import React from 'react'
import { connect } from 'react-redux'
import { toChangeIntro } from '../../actions/index.js';
class ChangeIntroPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            removeImg: false,
            changeImg: false
        }
    }
    render(){
        let img = null;
        const onChangeSubmit = () =>{
            if(this.myname.value==="" || this.mybelong.value==="" || this.myintro.value ==="")
                alert("Enter all properties");
            else this.props.onClick(this.props.profile_user,this.myname.value, this.mybelong.value, this.myintro.value, this.state.removeImg, this.state.changeImg, img);
        }
        return(
            <div className="Change">
                <span>{this.props.profile_user}동무는 누구인가?</span>
                <br />
                이름<input type="myname" placeholder={this.props.myname}  ref={node=>{this.myname = node;} } id="myname" className="field" />
                <br />
                소속<input type="mybelong"ref={node=>{this.mybelong = node;} } id="mybelong" className="field" />
                <br />
                소개<input type="myintro" placeholder={this.props.myintro} ref={node=>{this.myintro = node;} } id="myintro" className="field" />
                <br />
                {this.state.removeImg ?
                    null : <button id='remove_myimage' onClick={() => this.setState({removeImg:true})} className='field'>기본 사진으로 하겠소!</button>}
                {this.state.removeImg ?
                    null : <button id='change_myintro' onClick={() => {this.setState({removeImg:true}); this.setState({changeImg:true});}} className='field'>사진을 바꾸겠소!</button>}
                {this.state.changeImg ?
                    <input type='file' accept='.jpg, .jpeg, .png, .gif' id='upload_myimage' onChange={(e)=>{img=e.target.files[0]; console.log(img);}} /> : null}
                <br />
                <button type="submit" id="change_intro" onClick={onChangeSubmit}>바꾼다!</button>
            </div>
        ); 
    }
}

let mapStateToProps = (state) => {
    return{
        profile_user:Object.assign(state.authorization).split(":")[0],
    }
}

let mapDispatchToProps = (dispatch) => {
    return{
        onClick:(profuser,name,belong,intro, removeImg, changeImg, img) =>{
            console.log("ask for intro change");
            dispatch(toChangeIntro(profuser,name, belong, intro, removeImg, changeImg, img));
        }
    }
}

export default ChangeIntroPage= connect(mapStateToProps,mapDispatchToProps)(ChangeIntroPage)


import React from 'react'
import { connect } from 'react-redux'
import { toChangeIntro } from '../../actions/index.js';
class ChangeIntroPage extends React.Component{
    render(){
        const onChangeSubmit = () =>{
            if(this.myname.value==="" || this.mybelong.value==="" || this.myintro.value ==="")
                alert("Enter all properties");
            else this.props.onClick(this.props.profile_user,this.myname.value, this.mybelong.value, this.myintro.value);
        }
        return(
            <div className="TimeLine">
                <span>{this.props.profile_user}동무는 누구인가?</span>
                <br />
                이름<input type="myname" ref={node=>{this.myname = node;} } id="myname" className="field" />
                <br />
                소속<input type="mybelong"ref={node=>{this.mybelong = node;} } id="belong" className="field" />
                <br />
                소개<input type="myintro" ref={node=>{this.myintro = node;} } id="myintro" className="field" />
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
        onClick:(profuser,name,belong,intro) =>{
            console.log("ask for intro change");
            dispatch(toChangeIntro(profuser,name, belong, intro));
        }
    }
}

export default ChangeIntroPage= connect(mapStateToProps,mapDispatchToProps)(ChangeIntroPage)


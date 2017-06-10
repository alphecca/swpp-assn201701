import React from 'react'
import {connect} from 'react-redux'
import {putArticle} from '../../actions'

class EditArticle extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          removeImg: false
      }
  }
  render(){
    let text = "Enter the text";
    let files = null;
    return(
      <div id="edit_article_field" className="EditArticle">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={text} onChange={ (e)=>{text=e.target.value} }/>
        <br />
        {this.props.thisArticle !== null && this.state.removeImg === false && this.props.thisArticle.image0 !== null? 
            <button onClick={() => {if(this.state.removeImg === false) this.setState({removeImg:true}); console.log(this.state.removeImg);}}>remove img?</button> : null
        }
        { this.state.removeImg === true || (this.props.thisArticle !== null && this.props.thisArticle.image0 === null)?
            <input type="file" accept=".png, .gif, .jpg, .jpeg" id="upload_img0" onChange={ (e) => {files = e.target.files; console.log(files);}} /> : null
        }
        <br />
        <button id={this.props.buttonId} onClick={()=>this.props.onEditClick(text, this.state.removeImg, files)}>고치기</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
     textId: "edit_text_field",
     buttonId: "edit_button_field",
     thisArticle: state.parent_article
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onEditClick: (text, removeImg, files) => dispatch(putArticle(text, removeImg, files)),
   }
}

EditArticle = connect(mapStateToProps, mapDispatchToProps)(EditArticle)

export default EditArticle

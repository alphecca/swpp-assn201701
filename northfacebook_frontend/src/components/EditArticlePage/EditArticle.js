import React from 'react'
import {connect} from 'react-redux'
import {putArticle} from '../../actions'
import '../AddArticlePage/styles.css'
class EditArticle extends React.Component{
  render(){
    let text = "Enter the text" 
    return(
      <div id="edit_article_field" className="EditArticle">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={text} onChange={ (e)=>{text=e.target.value} }/>
        <br />
        <button id={this.props.buttonId} onClick={()=>this.props.onEditClick(text)}>EDIT</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
     textId: "edit_text_field",
     buttonId: "edit_button_field"
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onEditClick: (text) => dispatch(putArticle(text)),
   }
}

EditArticle = connect(mapStateToProps, mapDispatchToProps)(EditArticle)

export default EditArticle

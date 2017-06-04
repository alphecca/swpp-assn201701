import React from 'react'
//import { Image } from 'react-naive'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'

class AddArticle extends React.Component{
  render(){
    let text = "Enter the text"
    const onPostClick = () => {
        this.props.onClick(this.props.id, text)
    }
    const handleChange = (e) => {
        text = e.target.value
    }
    return(
      <div id="add_article_field" className="AddArticle">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={text} onChange={handleChange}/>
        <br />
        <input id="upload_file" type="file" onChange={(e) => console.log(e.target.files)}/>
        <button id={this.props.buttonId} onClick={onPostClick}>POST</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
    console.log(window.location.pathname)
  return {
     id: state.parent_article,
     textId: "post_text_field",
     buttonId: "post_button_field"
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onClick: (id, text) => dispatch(addArticle(id, text)),
   }
}

AddArticle = connect(mapStateToProps, mapDispatchToProps)(AddArticle)

export default AddArticle

import React from 'react'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'
import './styles.css'

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
        <button id={this.props.buttonId} onClick={onPostClick}>POST</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
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

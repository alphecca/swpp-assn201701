import React from 'react'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'

class AddArticle extends React.Component{
  render(){
//    let textid = this.props.textId+1//new artice's id(lastid+1)
    let text = "asdf"
    const onPostClick = () => {
        this.props.onClick(text)
    }
    return(
      <div>
        <textarea id={this.props.textId} cols="40" rows="5" placeholder={text}/>
        <button id={this.props.buttonId} onClick={onPostClick}>POST</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
     textId: "post_text_field",
     buttonId: "post_button_field"
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onClick: (text) => dispatch(addArticle(text)),
   }
}

AddArticle = connect(mapStateToProps, mapDispatchToProps)(AddArticle)

export default AddArticle

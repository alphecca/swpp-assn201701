import React from 'react'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'

class AddArticle extends React.Component{
  render(){
    var textid = this.props.textId+1//new artice's id(lastid+1)
    return(
      <div>
        <textarea id={'post'+textid+'text_field'} cols="40" rows="5" >hello world!</textarea>
        <button id={'post'+textid+'field'} onclick={this.props.onClick(document.getElementById('post'+textid+'text_field'))}>POST</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
     textId: "1",
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onClick: (text) => dispatch(addArticle(text)),
   }
}

AddArticle = connect(mapStateToProps, mapDispatchToProps)(AddArticle)

export default AddArticle

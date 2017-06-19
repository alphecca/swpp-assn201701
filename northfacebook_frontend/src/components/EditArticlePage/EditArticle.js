import React from 'react'
import {connect} from 'react-redux'
import {putArticle} from '../../actions'
import PropTypes from 'prop-types'

class EditArticle extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          removeImg: false,
          removeUrl: false,
          text: null
      }
  }
  render(){
    let files = null;
    let url = null;
    const editClick = () => {
        // eslint-disable-next-line
        const tmp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/(watch\?v=|embed\/)|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/g;
        if(url === null || url === '')
            console.log('no url');
        else {
            const urls = tmp.exec(url);
            if(urls === null) {
                alert('올바른 주소를 쓰시오!');
                return;
            }
            else
                url = 'https://www.youtube.com/embed/'+urls[2];
        }
        if(this.state.text === null || this.state.text === '') {
            this.props.onEditClick(this.props.thisArticle.id, this.props.thisArticle.text, this.state.removeImg, files, this.state.removeUrl, url);
        }
        else
            this.props.onEditClick(this.props.thisArticle.id, this.state.text, this.state.removeImg, files, this.state.removeUrl, url);
    }
    return(
      <div id="edit_article_field">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={this.props.thisArticle.text} onChange={ (e)=>
            this.setState({text: e.target.value})} />
        <br />
        { this.props.thisArticle !== null && this.state.removeImg === false && this.props.thisArticle.image0 !== null? 
            <button onClick={() => {if(this.state.removeImg === false) this.setState({removeImg:true}); console.log(this.state.removeImg);}}>{"기존 사진을 삭제하겠소?"}</button> : null
        }
        { this.state.removeImg === true || (this.props.thisArticle !== null && this.props.thisArticle.image0 === null)?
            <input type="file" accept=".png, .gif, .jpg, .jpeg" id="upload_img0" onChange={ (e) => {files = e.target.files; console.log(files);}} /> : null
        }
        <br />
        { this.props.thisArticle !== null ?
            this.state.removeUrl === false && this.props.thisArticle.youtube_video !== 'None' ?
            <div><button id='remove_url' onClick={() => {this.setState({removeUrl: true})}}>{"기존 영상을 삭제하겠소?"}</button></div>
            : <div><span>영상주소</span><input id='change_url' onChange={(e) => {console.log(url); url = e.target.value;}} /></div>
            : null
        }
        <button id={this.props.buttonId} onClick={editClick}>고치기</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
     textId: "edit_text_field",
     buttonId: "edit_button_field",
  }
}

EditArticle.propTypes = {
    thisArticle: PropTypes.object.isRequired
}

let mapDispatchToProps = (dispatch) => {
   return {
      onEditClick: (id, text, removeImg, files, removeUrl, url) => dispatch(putArticle(id, text, removeImg, files, removeUrl, url)),
   }
}

EditArticle = connect(mapStateToProps, mapDispatchToProps)(EditArticle)

export default EditArticle

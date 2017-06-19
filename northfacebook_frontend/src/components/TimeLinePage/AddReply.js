import React from 'react'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'
import PropTypes from 'prop-types'

class AddReply extends React.Component{
  render(){
    let text = "글을 입력하시라우";
    let files = null;
    let url = '';
    const onPostClick = () => {
        // eslint-disable-next-line
        const tmp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/(watch\?v=|embed\/)|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/g;
        if(url !== '') {
            const pattern = tmp.exec(url);
            if (pattern === null) {
                console.log(url);
                alert('올바른 주소를 입력하시오!');
                return;
            }
            else {
                console.log(pattern);
                url = 'https://www.youtube.com/embed/'+pattern[2];
            }
        }
        this.props.onClick(this.props.parent_id, text, files, url);
    }
    const handleChange = (e) => {
        text = e.target.value;
    }
    return(
      <div id="add_reply_field" className="AddArticle">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={text} onChange={handleChange}/>
        <br />
        <input id="upload_reply_img0" type="file" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => {files = e.target.files;}}/>
        <br />
        영상넣기: <input id='add_reply_youtube_link' onChange={(e) => {url=e.target.value;}}/>
        <br />
        <button id={this.props.buttonId} onClick={onPostClick}>글쓰기</button>
      </div>
    );
  }
}

AddReply.propTypes = {
    parent_id: PropTypes.object.isRequired
}

let mapStateToProps = (state) => {
    console.log(window.location.pathname)
  return {
     textId: "post_reply_text_field",
     buttonId: "post_reply_button_field"
  }
} 

let mapDispatchToProps = (dispatch) => {
   return {
      onClick: (id, text, images, url) => {
                   dispatch(addArticle(id, text, images, url))
               },
   }
}

AddReply = connect(mapStateToProps, mapDispatchToProps)(AddReply)

export default AddReply

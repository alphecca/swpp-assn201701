import React from 'react'
import {connect} from 'react-redux'
import {addArticle} from '../../actions'

class AddArticle extends React.Component{
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
        this.props.onClick(this.props.id, text, files, url);
    }
    const handleChange = (e) => {
        text = e.target.value;
    }
    return(
      <div id="add_article_field" className="AddArticle">
        <textarea id={this.props.textId} cols="50" rows="10" placeholder={text} onChange={handleChange}/>
        <br />
        <input id="upload_img0" type="file" accept=".png, .jpg, .jpeg, .gif" onChange={(e) => {files = e.target.files;}}/>
        <br />
        영상넣기: <input id='add_youtube_link' onChange={(e) => {url=e.target.value;}}/>
        <br />
        <button id={this.props.buttonId} onClick={onPostClick}>글쓰기</button>
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
      onClick: (id, text, images, url) => {
                   dispatch(addArticle(id, text, images, url))
               },
   }
}

AddArticle = connect(mapStateToProps, mapDispatchToProps)(AddArticle)

export default AddArticle

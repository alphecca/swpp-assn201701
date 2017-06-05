import React from 'react'
import ArticleList from './ArticleList.js'
import {moreArticle,writeArticle, showChattingRoom} from '../../actions'
import {connect} from 'react-redux'

var re=0;
class TimeLine extends React.Component {
    render() {
        const Scroll = () => {
                this.props.onMoreClick()
        };
        window.onscroll = function(ev) {
          if(re<document.body.scrollHeight && (window.innerHeight + window.scrollY) >= document.body.scrollHeight){
            re=document.body.scrollHeight;
            Scroll();
            alert("더!");
          }
        };
      return(
         <div className="TimeLine">
                    <button id="write_button_field" onClick={this.props.onWriteClick}>Write</button>
                    <button id="chat_button_field" onClick={this.props.onChatClick}>Chat</button>
                    <hr />
                    <ArticleList />
        </div>
      );
    }
}

//<button id="more_button_field" onClick={this.props.onMoreClick}>더!</button>
TimeLine = connect(undefined, (dispatch) => {
  return {
    onWriteClick: () => dispatch(writeArticle(null)),
    onChatClick: () => dispatch(showChattingRoom(null)),
    onMoreClick: () => dispatch(moreArticle())
  }
})(TimeLine)
export default TimeLine

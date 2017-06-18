import React from 'react'
import ArticleList from './ArticleList.js'
import {moreArticle,writeArticle} from '../../actions'
import {connect} from 'react-redux'
import AddArticle from '../AddArticlePage/AddArticle.js';
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
		    <AddArticle />
                    <ArticleList />
        </div>
      );
    }
}

//<button id="more_button_field" onClick={this.props.onMoreClick}>더!</button>
TimeLine = connect(undefined, (dispatch) => {
  return {
    onWriteClick: () => dispatch(writeArticle(null)),
    onMoreClick: () => dispatch(moreArticle())
  }
})(TimeLine)
export default TimeLine

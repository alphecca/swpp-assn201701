import React from 'react'
import WallArticle from './WallArticle.js'
import {moreArticle} from '../../actions'
import {connect} from 'react-redux'

var re=0;
class WallArticleList extends React.Component {
    render() {
         const Scroll = () => {
          this.props.onMoreClick()
        };
        window.onscroll = function(ev){
          if(re<document.body.scrollHeight && (window.innerHeight + window.scrollY)>=document.body.scrollHeight){
            re=document.body.scrollHeight;
            Scroll();
            alert("더!");
          }
        };
       const list = this.props.articles
        return (
                <div id="article_list_field" className="ArticleList">
                {list.map(article => <WallArticle key={article.id} {...article}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        articles: Object.assign(state.articles).slice(0, state.load+5).map(article => JSON.parse(JSON.stringify(
                          {
                              article: article,
                              id: article.id
                          })
                          )
                          )
    }
}
let mapDispatchToProps = (dispatch)=>{
  return{
    onMoreClick:()=>dispatch(moreArticle())
  }
}
WallArticleList = connect(mapStateToProps,mapDispatchToProps)(WallArticleList)

export default WallArticleList

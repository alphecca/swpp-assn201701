import React from 'react'
import Article from './Article.js'
import {connect} from 'react-redux'
class ArticleList extends React.Component {
  render() {
   const list = this.props.articles
        return (
                <div id="article_list_field" className="ArticleList">
                {list.map(article => <Article key={article.id} {...article}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
  return {
        articles: Object.assign(state.articles).slice(0,state.load+5).map(article => JSON.parse(JSON.stringify(
                          {
                              article: article,
                              id: article.id,
                          })
                          )
                          ),
        load : state.load
    }
}

ArticleList = connect(mapStateToProps)(ArticleList)

export default ArticleList

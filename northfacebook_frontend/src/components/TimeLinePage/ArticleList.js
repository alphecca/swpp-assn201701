import React from 'react'
import Article from './Article.js'
import {connect} from 'react-redux'
//import {writeArticle} from '../../actions'

class ArticleList extends React.Component {
    render() {
        const list = this.props.articles
        return (
<<<<<<< HEAD
                <div className="ArticleList">
                {list.map(article => <Article key={article.id} id={"a"+article.id+"_field"}{...article}/>)}
=======
                <div id="article_list_field">
                {list.map(article => <Article key={article.id} {...article}/>)}
>>>>>>> upstream/master
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        articles: Object.assign(state.articles).slice(0, 5).map(article => JSON.parse(JSON.stringify(
                          {
                              article: article,
                              id: article.id
                          })
                          )
                          )
    }
}

ArticleList = connect(mapStateToProps)(ArticleList)

export default ArticleList

import React from 'react'
import WallArticle from './WallArticle.js'
import {connect} from 'react-redux'

class WallArticleList extends React.Component {
    render() {
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
        articles: Object.assign(state.articles).slice(0, 5).map(article => JSON.parse(JSON.stringify(
                          {
                              article: article,
                              id: article.id
                          })
                          )
                          )
    }
}

WallArticleList = connect(mapStateToProps)(WallArticleList)

export default WallArticleList

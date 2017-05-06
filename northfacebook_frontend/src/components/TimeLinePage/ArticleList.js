import React from 'react'
import Article from './Article.js'
import {connect} from 'react-redux'
//import {writeArticle} from '../../actions'

class ArticleList extends React.Component {
    render() {
        const list = this.props.articles
        return (
                <div>
                {list.map(article => <Article key={article.id} id={"a"+article.id+"_field"}{...article}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        articles: Object.assign(state.articles).slice(0, 5).map(article => JSON.parse(JSON.stringify(
                          {
                              id: Number(article.id),
                              writerId: "a"+article.id+"_writer_field",
                              username: article.owner,
                              textId: "a"+article.id+"_text_field",
                              articleText: article.text,
                              likeNum: article.like_num,
                              likeButtonId: "a"+article.id+"_like_button_field",
                              editButtonId: "a"+article.id+"_edit_button_field",
                              deleteButtonId: "a"+article.id+"_delete_button_field",
                              detailButtonId: "a"+article.id+"_detail_button_field",
                              replyNum: article.children_num
                          })
                          )
                          )
    }
}

ArticleList = connect(mapStateToProps)(ArticleList)

export default ArticleList

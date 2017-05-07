import React from 'react'
import PropTypes from 'prop-types'
import Article from '../TimeLinePage/Article.js'
import {connect} from 'react-redux'

class ArticleDetailPage extends React.Component {
    render() {
        return (
                <div>
                <p> you have accessed article detail page! horray </p>
                </div>
               )
    }
}
/*
let mapStateToProps = (state) => {
     return {
         article: {
             article: Object.assign(state.parent_article),
             id: Object.assign(state.parent_article.id),
             writerId: "a"+state.parent_article.id+"_writer_field",
             username: state.parent_article.owner,
             textId: "a"+state.parent_article.id+"_text_field",
             articleText: state.parent_article.text,
             likeNum: state.parent_article.like_num,
             likeButtonId: "a"+state.parent_article.id+"_like_button_field",
             editButtonId: "a"+state.parent_article.id+"_edit_button_field",
             deleteButtonId: "a"+state.parent_article.id+"_delete_button_field",
             detailButtonId: "a"+state.parent_article.id+"_detail_button_field",
             replyNum: state.parent_article.children_num
         }
     }
}

ArticleDetailPage = connect(mapStateToProps)(ArticleDetailPage)
*/
export default ArticleDetailPage

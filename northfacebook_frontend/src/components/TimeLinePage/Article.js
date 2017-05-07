import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {writeArticle, postLike, articleDetail} from '../../actions'
import  './styles.css'

class Article extends React.Component {
    render() {
        const writerId = "a"+this.props.article.id+"_writer_field"
        const username = this.props.article.owner
        const textId = "a"+this.props.article.id+"_text_field"
        const articleText = this.props.article.text
        const likeNum = this.props.article.like_num
        const likeButtonId = "a"+this.props.article.id+"_like_button_field"
        const editButtonId = "a"+this.props.article.id+"_edit_button_field"
        const deleteButtonId = "a"+this.props.article.id+"_delete_button_field"
        const replyNum = this.props.article.children_num
        const replyButtonId = "a"+this.props.article.id+"_reply_button_field"
        const detailButtonId = "a"+this.props.article.id+"_detail_button_field"
        return (
                <div className="Article">
                    <p id={writerId}>id: {username}</p>
                    <hr />
                    <div id={textId} className="article_text">{articleText}</div>
                    <hr />
                    <p>Created: {this.props.article.created_time}</p>
                    <p>Last update: {this.props.article.updated_time}</p>
                    <div className="Tags">
                    좋아요: {likeNum}
                    <div className="divider"/>
                    <button id={likeButtonId} onClick={() => this.props.onLikeClick(this.props.article.id, this.props.authorization)}>Like</button>
                    <div className="divider"/>
                    <button id={editButtonId} onClick={this.props.onEditClick}>Edit</button>
                    <div className="divider"/>
                    <button id={deleteButtonId} onClick={this.props.onDeleteClick}>Delete</button>
                    <br />
                    댓글: {replyNum}
                    <div className="divider"/>
                    <button id={detailButtonId} onClick={() =>this.props.onDetailClick(this.props.article)}>Detail</button>
                    <div className="divider"/>
                    <button id={replyButtonId} onClick={() =>this.props.onReplyClick(this.props.article)}>Reply</button>
                    <br />
                    </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        authorization: Object.assign(state.authorization)
    }
}

Article.propTypes = {
    article: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: () => alert("Delete button cliked"),
        onEditClick: () => alert("Edit button clicked"),
        onReplyClick: (id) => dispatch(writeArticle(id)),
        onLikeClick: (id, auth) => dispatch(postLike(id, auth)),
        onDetailClick: (id) => dispatch(articleDetail(id))
    }
}

//Article = connect(undefined, mapDispatchToProps)(Article)

Article = connect(mapStateToProps, mapDispatchToProps)(Article)

export default Article

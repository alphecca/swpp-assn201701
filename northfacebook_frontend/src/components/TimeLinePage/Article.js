import React from 'react'
import {connect} from 'react-redux'
import {writeArticle} from '../../actions'

class Article extends React.Component {
    render() {
        return (
                <div>
                    <p id={this.props.writerId}>id: {this.props.username}</p>
                    <div id={this.props.textId} className="article_text">{this.props.articleText}</div>
                    좋아요: {this.props.likeNum}<button id={this.props.likeButtonId} onClick={this.props.onLikeClick}>Like</button>
                    <button id={this.props.editButtonId} onClick={this.props.onEditClick}>Edit</button>
                    <button id={this.props.deleteButtonId} onClick={this.props.onDeleteClick}>Delete</button>
                    <br />
                    댓글: {this.props.replyNum}<button id={this.props.replyButtonId} onClick={this.props.onReplyClick}>Reply</button>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        writerId: "writer",
        username: Object.assign(state.authorization).split(":")[0],
        textId: "text",
        articleText: "종강하고 싶다",
        likeNum: "4444",
        likeButtonId: "like",
        editButtonId: "edit",
        deleteButtonId: "delete",
        replyButtonId: "reply",
        replyNum: "4444",
        state: Object.assign(state)
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLikeClick: () => alert("Like button cliked"),
        onEditClick: () => alert("Edit button clicked"),
        onDeleteClick: () => alert("Delete button clicked"),
        onReplyClick: () => dispatch(writeArticle())
    }
}

Article = connect(mapStateToProps, mapDispatchToProps)(Article)

export default Article

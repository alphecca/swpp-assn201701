import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {postLike, articleDetail} from '../../actions'

class Article extends React.Component {
    render() {
        return (
                <div>
                    <p id={this.props.writerId}>id: {this.props.username}</p>
                    <div id={this.props.textId} className="article_text">{this.props.articleText}</div>
                    좋아요: {this.props.likeNum}<button id={this.props.likeButtonId} onClick={() => this.props.onLikeClick(this.props.id, this.props.authorization)}>Like</button>
                    <button id={this.props.editButtonId} onClick={this.props.onEditClick}>Edit</button>
                    <button id={this.props.deleteButtonId} onClick={this.props.onDeleteClick}>Delete</button>
                    <br />
                    댓글: {this.props.replyNum}<button id={this.props.detailButtonId} onClick={() =>this.props.onDetailClick(this.props.id)}>detail</button>
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
    id: PropTypes.number.isRequired,
    writerId: PropTypes.string.isRequired,
    username: PropTypes.number.isRequired,
    textId: PropTypes.string.isRequired,
    articleText: PropTypes.string.isRequired,
    likeNum: PropTypes.number.isRequired,
    likeButtonId: PropTypes.string.isRequired,
    editButtonId: PropTypes.string.isRequired,
    deleteButtonId: PropTypes.string.isRequired,
    detailButtonId: PropTypes.string.isRequired,
    replyNum: PropTypes.number.isRequired
}

let mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: () => alert("Delete button cliked"),
        onEditClick: () => alert("Edit button clicked"),
        onLikeClick: (id, auth) => dispatch(postLike(id, auth)),
        onDetailClick: (id) => dispatch(articleDetail(id))
    }
}

//Article = connect(undefined, mapDispatchToProps)(Article)

Article = connect(mapStateToProps, mapDispatchToProps)(Article)

export default Article

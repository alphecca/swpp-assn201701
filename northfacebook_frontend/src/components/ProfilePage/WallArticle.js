import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {editArticle, deleteArticle, writeArticle, postLike, articleDetail} from '../../actions'

class WallArticle extends React.Component {
    render() {
        const writerId = "a"+this.props.article.id+"_writer_field"
        const username = this.props.article.owner
        const textId = "a"+this.props.article.id+"_text_field"
        const articleText = this.props.article.text
        const likeNum = this.props.article.like_num
        const likeNumId = "a"+this.props.article.id+"_like_field"
        const likeButtonId = "a"+this.props.article.id+"_like_button_field"
        const editButtonId = "a"+this.props.article.id+"_edit_button_field"
        const deleteButtonId = "a"+this.props.article.id+"_delete_button_field"
        const replyNum = this.props.article.children_num
        const replyNumId = "a"+this.props.article.id+"_reply_field"
        const replyButtonId = "a"+this.props.article.id+"_reply_button_field"
        const detailButtonId = "a"+this.props.article.id+"_detail_button_field"
        const componentId = "a"+this.props.article.id+"_field"
        const createdId = "a"+this.props.article.id+"_created_field"
        const updatedId = "a"+this.props.article.id+"_updated_field"
        const typeLabel = () => {
            const current = window.atob(localStorage['auth']).split(":")[0];
            console.log(current);
            if(this.props.article.owner !== current)
                return (
                        <div>
                            <p>{current}가 좋아요한 글입니다.</p>
                        </div>
                       )
            else if(this.props.article.depth !== 0)
                return (
                        <div>
                            <p>{current}가 작성한 댓글입니다.</p>
                        </div>
                       )
            else
                return (
                        <div>
                            <p>{current}가 작성한 글입니다.</p>
                        </div>
                       )
        }
        return (
                <div id={componentId} className="Article">
                    {typeLabel()}
                    <p id={writerId}>id: {username}</p>
                    <hr />
                    <div id={textId} className="article_text">{articleText.split('\n').map( (line,textId) => {return (<span key={'line'+textId}>{line}<br/></span>)} )}</div>
                    <hr />
                    <p id={createdId}>Created: {this.props.article.created_time}</p>
                    <p id={updatedId}>Last update: {this.props.article.updated_time}</p>
                    <div className="Tags">
                    좋아요: <span id={likeNumId}>{likeNum}</span>
                    <div className="divider"/>
                    <button id={likeButtonId} onClick={() => this.props.onLikeClick(this.props.article.id, this.props.authorization)}>Like</button>
                    <div className="divider"/>
                    <button id={editButtonId} onClick={ ()=>this.props.onEditClick(this.props.article.id,this.props.article.text)}>Edit</button>
                    <div className="divider"/>
                    <button id={deleteButtonId} onClick={() => this.props.onDeleteClick(this.props.article.id)}>Delete</button>
                    <br />
                    댓글:<span id={replyNumId}>{replyNum}</span>
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

WallArticle.propTypes = {
    article: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (id) => dispatch(deleteArticle(id)), 
        onEditClick: (id,text,time) => dispatch(editArticle(id,text)), 
        onReplyClick: (id) => dispatch(writeArticle(id)),
        onLikeClick: (id, auth) => dispatch(postLike(id, auth)),
        onDetailClick: (id) => dispatch(articleDetail(id))
    }
}

WallArticle = connect(mapStateToProps, mapDispatchToProps)(WallArticle)

export default WallArticle;
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { toProfile, editArticle, deleteArticle, writeArticle, postLike, articleDetail } from '../../actions'
//import AddArticle from '../AddArticlePage/AddArticle.js';

class Article extends React.Component {
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

        const created_ = this.props.article.created_time.split('T');
        const created_date = created_[0].split('-');
        const created_time = created_[1].split(':');
        const updated_ = this.props.article.created_time.split('T');
        const updated_date = updated_[0].split('-');
        const updated_time = updated_[1].split(':');

        const imgId = 'a'+this.props.article.id+'_images';
        const images = this.props.article.images;
        const profileId = 'a'+this.props.article.id+'_profile_img';
        const videoId = 'a'+this.props.article.id+'_video';
        
        const onPostClick = ()=>{
            this.props.onPostClick(username);
        }
        var depth=this.props.article.depth;
        if(depth===0){
        return (
                <div id={componentId} className="Article">
                    <img src={this.props.article.owner_img} id={profileId} className='PROFILEIMG' alt='' />
                    <a className='Link' id={writerId} onClick={onPostClick}><u>{username}</u></a>
                    <hr />
                    {this.props.article.youtube_video !== 'None' ?
                        <iframe id={videoId} width="560" height="315" src={this.props.article.youtube_video} frameBorder="0" allowFullScreen></iframe> : null
                    }
                    <div id={imgId}>
                    {images !== null ? images.map( (img) => {return (<span key={"img_"+imgId}><img src={img} alt="" /></span>)} ) : null}
                    </div>

                    <div id={textId} className="article_text">
                    {articleText.split('\n').map( (line,textId) => {return (<span key={'line'+textId}>{line}<br/></span>)} )}
                    </div>

                    <hr />
                    <p id={createdId}>쓴날: {created_date[0]}년 {created_date[1]}월 {created_date[2]}일 {created_time[0]}시 {created_time[1]}분 {created_time[2].split('.')[0]}초</p>
                    <p id={updatedId}>바꾼날: {updated_date[0]}년 {updated_date[1]}월 {updated_date[2]}일 {updated_time[0]}시 {updated_time[1]}분 {updated_time[2].split('.')[0]}초</p>
                    <div className="Tags">
                    좋소: <span id={likeNumId}>{likeNum}</span>
                    <div className="divider"/>
                    <button id={likeButtonId} onClick={() => this.props.onLikeClick(this.props.article.id, this.props.authorization)}>좋소</button>
                    <div className="divider"/>
                    <button id={editButtonId} onClick={ ()=>this.props.onEditClick(this.props.article.id, username)}>바꾸기</button>
                    <div className="divider"/>
                    <button id={deleteButtonId} onClick={() => this.props.onDeleteClick(this.props.article.id)}>지우기</button>
                    <br />
                    붙임글:<span id={replyNumId}>{replyNum}</span>
                    <div className="divider"/>
                    <button id={detailButtonId} onClick={() =>this.props.onDetailClick(this.props.article)}>자세히</button>
                    <div className="divider"/>
                    <button id={replyButtonId} onClick={() =>this.props.onReplyClick(this.props.article)}>붙이기</button>
                    <br />
                    </div>
                </div>
        )
        }
        else if(depth===1){
        return (
              <div id={componentId} className="ArticleArticle">
                    <img src={this.props.article.owner_img} id={profileId} className='PROFILEIMG' alt='' />
                    <a className='Link' id={writerId} onClick={onPostClick}><u>{username}</u></a>
                    <hr />
                    {this.props.article.youtube_video !== 'None' ?
                        <iframe id={videoId} width="560" height="315" src={this.props.article.youtube_video} frameBorder="0" allowFullScreen></iframe> : null
                    }
                    <div id={imgId}>
                    {images !== null ? images.map( (img) => {return (<span key={"img_"+imgId}><img src={img} alt="" /></span>)} ) : null}
                    </div>

                    <div id={textId} className="article_text">
                    {articleText.split('\n').map( (line,textId) => {return (<span key={'line'+textId}>{line}<br/></span>)} )}
                    </div>

                    <hr />
                    <p id={createdId}>쓴날: {created_date[0]}년 {created_date[1]}월 {created_date[2]}일 {created_time[0]}시 {created_time[1]}분 {created_time[2].split('.')[0]}초</p>
                    <p id={updatedId}>바꾼날: {updated_date[0]}년 {updated_date[1]}월 {updated_date[2]}일 {updated_time[0]}시 {updated_time[1]}분 {updated_time[2].split('.')[0]}초</p>
                    <div className="Tags">
                    좋소: <span id={likeNumId}>{likeNum}</span>
                    <div className="divider"/>
                    <button id={likeButtonId} onClick={() => this.props.onLikeClick(this.props.article.id, this.props.authorization)}>좋소</button>
                    <div className="divider"/>
                    <button id={editButtonId} onClick={ ()=>this.props.onEditClick(this.props.article.id, username)}>바꾸기</button>
                    <div className="divider"/>
                    <button id={deleteButtonId} onClick={() => this.props.onDeleteClick(this.props.article.id)}>지우기</button>
                    <br />
                    붙임글:<span id={replyNumId}>{replyNum}</span>
                    <div className="divider"/>
                    <button id={replyButtonId} onClick={() =>this.props.onReplyClick(this.props.article)}>붙이기</button>
                    <br />
                    </div>
                </div>
        )
        }
        else{
        return (
                <div id={componentId} className="ArticleArticleArticle">
                    <img src={this.props.article.owner_img} id={profileId} className='PROFILEIMG' alt='' />
                    <a className='Link' id={writerId} onClick={onPostClick}><u>{username}</u></a>
                    <hr />
                    {this.props.article.youtube_video !== 'None' ?
                        <iframe id={videoId} width="560" height="315" src={this.props.article.youtube_video} frameBorder="0" allowFullScreen></iframe> : null
                    }
                    <div id={imgId}>
                    {images !== null ? images.map( (img) => {return (<span key={"img_"+imgId}><img src={img} alt="" /></span>)} ) : null}
                    </div>

                    <div id={textId} className="article_text">
                    {articleText.split('\n').map( (line,textId) => {return (<span key={'line'+textId}>{line}<br/></span>)} )}
                    </div>

                    <hr />
                    <p id={createdId}>쓴날: {created_date[0]}년 {created_date[1]}월 {created_date[2]}일 {created_time[0]}시 {created_time[1]}분 {created_time[2].split('.')[0]}초</p>
                    <p id={updatedId}>바꾼날: {updated_date[0]}년 {updated_date[1]}월 {updated_date[2]}일 {updated_time[0]}시 {updated_time[1]}분 {updated_time[2].split('.')[0]}초</p>
                    <div className="Tags">
                    좋소: <span id={likeNumId}>{likeNum}</span>
                    <div className="divider"/>
                    <button id={likeButtonId} onClick={() => this.props.onLikeClick(this.props.article.id, this.props.authorization)}>좋소</button>
                    <div className="divider"/>
                    <button id={editButtonId} onClick={ ()=>this.props.onEditClick(this.props.article.id, username)}>바꾸기</button>
                    <div className="divider"/>
                    <button id={deleteButtonId} onClick={() => this.props.onDeleteClick(this.props.article.id)}>지우기</button>
                    <br />
                    </div>
                </div>
        )
        }
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
        onDeleteClick: (id) => dispatch(deleteArticle(id)),
        onEditClick: (id, username) => dispatch(editArticle(id, username)),
        onReplyClick: (id) => dispatch(writeArticle(id)),
        onLikeClick: (id, auth) => dispatch(postLike(id, auth)),
        onDetailClick: (id) => dispatch(articleDetail(id)),
        onPostClick: (profuser) =>dispatch(toProfile(profuser)),


    }
}

Article = connect(mapStateToProps, mapDispatchToProps)(Article)

export default Article

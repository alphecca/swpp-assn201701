import React from 'react'
//import PropTypes from 'prop-types'
import Article from '../TimeLinePage/Article.js'
//import ArticleList from '../TimeLinePage/ArticleList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import ReplyList from './ReplyList.js'
import {connect} from 'react-redux'
import {postBack} from '../../actions'
import './styles.css'

class ArticleDetailPage extends React.Component {
    render() {
        return (
                this.props.article.parent_article === null ? <p>"Now loading..."</p> : (
                    <div >
                    <SignOut />
                    <div className="ArticleDetail">
                    <Article article={this.props.article.parent_article} />
                    <hr />
                    <ReplyList articles={this.props.article.articles}/>
                    </div>
                    </div>
                    )
               )
    }
}

let mapStateToProps = (state) => {
     return {
         article: Object.assign(state)
     }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onBackClick: () => dispatch(postBack())
    }
}

ArticleDetailPage = connect(mapStateToProps, mapDispatchToProps)(ArticleDetailPage)

export default ArticleDetailPage

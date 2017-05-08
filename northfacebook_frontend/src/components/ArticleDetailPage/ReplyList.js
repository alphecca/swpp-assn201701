import React from 'react'
//import PropTypes from 'prop-types'
import Article from '../TimeLinePage/Article.js'
import {connect} from 'react-redux'

class ReplyList extends React.Component {
    render() {
        const list = this.props.articles
        return (
                <div>
                <p>Reply List</p>
                {list.map(article => <Article key={article.id} id={"r"+article.id+"_field"} {...article}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        articles: Object.assign(state.articles).reverse().map(article => JSON.parse(JSON.stringify({
            article: article,
            id: article.id
        })))
    }
}

ReplyList = connect(mapStateToProps)(ReplyList)

export default ReplyList

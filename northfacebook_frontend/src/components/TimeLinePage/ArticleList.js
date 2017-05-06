import React from 'react'
import Article from './Article.js'
import {connect} from 'react-redux'
//import {writeArticle} from '../../actions'

class ArticleList extends React.Component {
    render() {
        const list = this.props.articles
        return (
                <div>
                {list.map(article => <Article key={article} />)}
                <p>{JSON.stringify(this.props.articles)}</p>
                <button onClick={() => alert(typeof(this.props.articles))}> tmp </button>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        articles: [1, 2, 3]
//        articles: Object.assign(state.articles)
    }
}

ArticleList = connect(mapStateToProps)(ArticleList)

export default ArticleList

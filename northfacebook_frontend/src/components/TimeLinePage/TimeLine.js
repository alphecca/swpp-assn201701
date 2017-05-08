import React from 'react'
import ArticleList from './ArticleList.js'
import {writeArticle} from '../../actions'
import {connect} from 'react-redux'

class TimeLine extends React.Component {
    render() {
        return (
                <div>
                    <button id="write_button_field" onClick={this.props.onClick}>Write</button>
                    <hr />
                    <ArticleList />
                </div>
               );
    }
}

TimeLine = connect(undefined, (dispatch) => {return {onClick: () => dispatch(writeArticle(null))}})(TimeLine)

export default TimeLine

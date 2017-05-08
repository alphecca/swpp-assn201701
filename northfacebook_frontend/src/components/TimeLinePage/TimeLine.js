import React from 'react'
import ArticleList from './ArticleList.js'
import {writeArticle} from '../../actions'
import {connect} from 'react-redux'
import './styles.css'

class TimeLine extends React.Component {
    render() {
        return (
<<<<<<< HEAD
                <div className="TimeLine">
=======
                <div>
>>>>>>> upstream/master
                    <button id="write_button_field" onClick={this.props.onClick}>Write</button>
                    <hr />
                    <ArticleList />
                </div>
               );
    }
}

TimeLine = connect(undefined, (dispatch) => {return {onClick: () => dispatch(writeArticle(null))}})(TimeLine)

export default TimeLine

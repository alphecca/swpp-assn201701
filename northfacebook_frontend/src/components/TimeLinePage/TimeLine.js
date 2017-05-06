import React from 'react'
import ArticleList from './ArticleList.js'
import {testState} from '../../actions'
import {connect} from 'react-redux'

class TimeLine extends React.Component {
    render() {
        return (
                <div>
                    <ArticleList />
                </div>
               );
    }
}

TimeLine = connect(undefined, (dispatch) => {return {onClick: () => dispatch(testState())}})(TimeLine)

export default TimeLine

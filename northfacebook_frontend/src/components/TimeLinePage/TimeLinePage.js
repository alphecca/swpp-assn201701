import React from 'react'
import TimeLine from './TimeLine.js'
import Article from './Article.js'
import SignOut from './SignOut.js'

class TimeLinePage extends React.Component {
    render() {
        return (
                <div>
                    <SignOut />
                    <TimeLine />
                    <Article />
                </div>
               )
    }
}

export default TimeLinePage;

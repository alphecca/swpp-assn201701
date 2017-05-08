import React from 'react'
import TimeLine from './TimeLine.js'
//import ArticleBox from './ArticleBox.js'
import SignOut from './SignOut.js'

class TimeLinePage extends React.Component {
    render() {
        return (
                <div>
                    <SignOut />
                    <TimeLine />
                </div>
               )
    }
}

export default TimeLinePage;

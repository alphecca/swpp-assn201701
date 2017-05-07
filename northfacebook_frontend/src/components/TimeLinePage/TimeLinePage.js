import React from 'react'
import TimeLine from './TimeLine.js'
import SignOut from './SignOut.js'
import './styles.css'

class TimeLinePage extends React.Component {
    render() {
        return (
                <div >
                    <SignOut />
                    <TimeLine />
                </div>
               )
    }
}

export default TimeLinePage;

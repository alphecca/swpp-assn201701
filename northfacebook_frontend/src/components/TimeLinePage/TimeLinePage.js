import React from 'react'
import TimeLine from './TimeLine.js'
import SignOut from './SignOut.js'
import { connect } from 'react-redux'

class TimeLinePage extends React.Component {

  render() {
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
        return (
                <div >
                    <SignOut />
                    <TimeLine />
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
    }
}

TimeLinePage = connect(mapStateToProps)(TimeLinePage);

export default TimeLinePage;

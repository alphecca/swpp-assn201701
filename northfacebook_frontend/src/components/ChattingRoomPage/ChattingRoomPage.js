import React from 'react'
import RoomList from './RoomList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { postBack, showCreateRoom } from '../../actions'
import { connect } from 'react-redux'

class ChattingRoomPage extends React.Component {
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
                <div className="ChattingRoom">
                <div className="divider" />
                <button id="new_room_button_field" onClick={this.props.onNewRoomClick}>새로운 방</button>
                <RoomList />
                </div>
                </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onBackClick: () => dispatch(postBack()),
        onNewRoomClick: () => dispatch(showCreateRoom())
    }
}

ChattingRoomPage = connect(mapStateToProps, mapDispatchToProps)(ChattingRoomPage)

export default ChattingRoomPage

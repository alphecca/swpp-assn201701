import React from 'react'
import RoomList from './RoomList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { postBack, showCreateRoom } from '../../actions'
import { connect } from 'react-redux'

class ChattingRoomPage extends React.Component {
    render() {
        return (
                <div >
                <SignOut />
                <br /> <br /> <br /> <br /> <br /> <br />
                <div className="ChattingRoom">
                <div className="divider" />
                <button id="new_room_button_field" onClick={this.props.onNewRoomClick}>새로운 방</button>
                <RoomList />
                </div>
                </div>
        )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onBackClick: () => dispatch(postBack()),
        onNewRoomClick: () => dispatch(showCreateRoom())
    }
}

ChattingRoomPage = connect(undefined, mapDispatchToProps)(ChattingRoomPage)

export default ChattingRoomPage

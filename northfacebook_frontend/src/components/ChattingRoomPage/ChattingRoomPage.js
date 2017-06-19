import React from 'react'
import NowChatRoomList from './NowChatRoomList.js'
import NonChatRoomList from './NonChatRoomList.js'
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
                <button id="new_room_button_field" onClick={this.props.onNewRoomClick}>새로운 방</button>
                <br />
                <br />
                <h2>참여한 방 목록</h2>
                <NowChatRoomList />
                <br />
                <h2>참여하지 않은 방 목록</h2>
                <NonChatRoomList />
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

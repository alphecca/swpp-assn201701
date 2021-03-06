import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { joinRoom, showChatting } from '../../actions'

class NonChatRoom extends React.Component {
    render() {
        const userNum = this.props.room.user_num;
        const userNumId = "room"+this.props.room.id+"_user_num_field";
        const roomName = this.props.room.room_name
        const roomNameId = "room"+this.props.room.id+"_name_field";
        const joinButtonId = "room"+this.props.room.id+"_join_field";
        const chatButtonId = "room"+this.props.room.id+"_chat_field";
        const componentId = "room"+this.props.room.id+"_field";

        return (
                <div id={componentId} className="Room">
                    <span id={userNumId}>{userNum}</span>
                    <div className="divider"/>
                    <span id={roomNameId}>{roomName}</span>
                    <div className="divider"/>
                    <button id={joinButtonId} onClick={() => this.props.onJoinClick(this.props.room.id)}>참여하기</button>
                    <div className="divider"/>
                    <button id={chatButtonId} onClick={() => this.props.onChatClick(this.props.room.id)}>도청하기</button>
                </div>
        )
    }
}

NonChatRoom.propTypes = {
    room: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onJoinClick: (id) => dispatch(joinRoom(id)),
        onChatClick: (id) => dispatch(showChatting(id))
    }
}

NonChatRoom = connect(undefined, mapDispatchToProps)(NonChatRoom)

export default NonChatRoom

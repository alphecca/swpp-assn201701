import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { quitRoom, showChatting } from '../../actions'

class NowChatRoom extends React.Component {
    render() {
        const userNum = this.props.room.user_num;
        const userNumId = "room"+this.props.room.id+"_user_num_field";
        const roomName = this.props.room.room_name
        const roomNameId = "room"+this.props.room.id+"_name_field";
        const quitButtonId = "room"+this.props.room.id+"_quit_field";
        const chatButtonId = "room"+this.props.room.id+"_chat_field";
        const componentId = "room"+this.props.room.id+"_field";
        if (this.props.room.secret) {
            return (
                    <div id={componentId} className="SecretRoom">
                        <span id={userNumId}>{userNum}</span>
                        <div className="divider"/>
                        <span id={roomNameId}>{roomName}</span>
                        <div className="divider"/>
                        <button id={chatButtonId} onClick={() => this.props.onChatClick(this.props.room.id)}>대화하기</button>
                        <div className="divider"/>
                        <button id={quitButtonId} onClick={() => this.props.onQuitClick(this.props.room.id)}>탈주하기</button>
                    </div>
            )
        } else {
            return (
                    <div id={componentId} className="Room">
                        <span id={userNumId}>{userNum}</span>
                        <div className="divider"/>
                        <span id={roomNameId}>{roomName}</span>
                        <div className="divider"/>
                        <button id={chatButtonId} onClick={() => this.props.onChatClick(this.props.room.id)}>대화하기</button>
                        <div className="divider"/>
                        <button id={quitButtonId} onClick={() => this.props.onQuitClick(this.props.room.id)}>탈주하기</button>
                    </div>
            )
        }
    }
}

NowChatRoom.propTypes = {
    room: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onQuitClick: (id) => dispatch(quitRoom(id)),
        onChatClick: (id) => dispatch(showChatting(id))
    }
}

NowChatRoom = connect(undefined, mapDispatchToProps)(NowChatRoom)

export default NowChatRoom

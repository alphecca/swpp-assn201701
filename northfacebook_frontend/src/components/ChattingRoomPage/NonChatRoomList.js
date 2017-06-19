import React from 'react'
import NonChatRoom from './NonChatRoom.js'
import { connect } from 'react-redux'

class NonChatRoomList extends React.Component {
    render() {
        const list = this.props.rooms;
        return (
                <div id="non_chat_room_list_field" className="RoomList">
                {list.map(room => <NonChatRoom key={room.id} {...room}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        rooms: Object.assign(state.nonchat_rooms).map(room => JSON.parse(JSON.stringify(
                            {
                                room: room,
                                id: room.id
                            })
                           )
                       )
    }
}

NonChatRoomList = connect(mapStateToProps)(NonChatRoomList)

export default NonChatRoomList

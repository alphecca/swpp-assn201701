import React from 'react'
import NowChatRoom from './NowChatRoom.js'
import { connect } from 'react-redux'

class NowChatRoomList extends React.Component {
    render() {
        const list = this.props.rooms;
        return (
                <div id="now_chat_room_list_field" className="RoomList">
                {list.map(room => <NowChatRoom key={room.id} {...room}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        rooms: Object.assign(state.nowchat_rooms).map(room => JSON.parse(JSON.stringify(
                            {
                                room: room,
                                id: room.id
                            })
                           )
                       )
    }
}

NowChatRoomList = connect(mapStateToProps)(NowChatRoomList)

export default NowChatRoomList

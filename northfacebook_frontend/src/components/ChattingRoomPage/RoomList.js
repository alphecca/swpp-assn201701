import React from 'react'
import Room from './Room.js'
import { connect } from 'react-redux'

class RoomList extends React.Component {
    render() {
        const list = this.props.rooms;
        return (
                <div id="room_list_field" className="RoomList">
                {list.map(room => <Room key={room.id} {...room}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        rooms: Object.assign(state.rooms).map(room => JSON.parse(JSON.stringify(
                            {
                                room: room,
                                id: room.id
                            })
                           )
                       )
    }
}

RoomList = connect(mapStateToProps)(RoomList)

export default RoomList

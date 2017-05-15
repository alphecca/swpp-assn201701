import React from 'react'
import { connect } from 'react-redux'
import { postRoom, showChattingRoom } from '../../actions'
import './styles.css'

class CreateRoom extends React.Component{
    render() {
        const onSubmit = () => {
            if (this.roomName !== undefined) {
                this.props.onClick(this.roomName.value)
            }
        };
        return (
                <div id="create_room_field" className="CreateRoom">
                <form onSubmit={e => {
                    e.preventDefault()
                    onSubmit()
                    }}
                >
                <div className="Text-Field">
                    Room name
                    <div className="divider" />
                    <input type="text" ref={ node => {this.roomName = node;} } id='input_room_name_field' className='field'></input><br />
                    <button type="submit" id='post_room_button_field' className='PostRoomButton'>Create room</button>
                    <div className="divider" />
                    <button id="cancel_button_field" className='CancelButton' onClick={this.props.onCancelClick}>Cancel</button>
                </div>
                </form>
                </div>
               )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (roomName) => {
                     dispatch(postRoom(roomName))
                 },
        onCancelClick: () => dispatch(showChattingRoom())
    }
}

CreateRoom = connect(undefined, mapDispatchToProps)(CreateRoom);

export default CreateRoom;


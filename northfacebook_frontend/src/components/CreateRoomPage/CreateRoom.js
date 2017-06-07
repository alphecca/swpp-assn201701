import React from 'react'
import { connect } from 'react-redux'
import { postRoom, showChattingRoom } from '../../actions'

class CreateRoom extends React.Component{
    render() {
        const onSubmit = () => {
            if (this.roomName !== undefined) {
                this.props.onPostClick(this.roomName.value)
            }
        };
        return (
                <div id="create_room_field" className="CreateRoom">
                <div className="Text-Field">
                    <form onSubmit={e => {
                        e.preventDefault()
                        onSubmit()
                        }}
                    >
                    Room name
                    <div className="divider" />
                    <input type="text" ref={ node => {this.roomName = node;} } id='input_room_name_field' className='field'></input><br />
                    <button type='submit' id='post_room_button_field' className='PostRoomButton'>만들기</button>
                    </form>
                    <button id="cancel_button_field" className='CancelButton' onClick={this.props.onCancelClick}>그만두기</button>
                </div>
                </div>
               )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onPostClick: (roomName) => {
                     dispatch(postRoom(roomName))
                 },
        onCancelClick: () => dispatch(showChattingRoom())
    }
}

CreateRoom = connect(undefined, mapDispatchToProps)(CreateRoom);

export default CreateRoom;


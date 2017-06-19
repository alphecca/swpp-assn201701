import React from 'react'
import { connect } from 'react-redux'
import InviteList from './InviteList.js'
import { postRoom, showChattingRoom } from '../../actions'

class CreateRoom extends React.Component{
    render() {
        const onSubmit = () => {
            if (this.roomName !== undefined) {
                let secret = document.getElementById('input_secret_field').checked;
                let invite = [], i=0;
                let friends = this.props.friends;
                console.log("friends")
                console.log(friends)
                for (i=0; i<friends.length; i++) {
                    if (document.getElementById('I_'+friends[i]["friend"]+'_check_field').checked)
                        invite.push(friends[i]["friend"])
                }
                this.props.onPostClick(this.roomName.value, secret, invite)
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
                    방 이름
                    <div className="divider" />
                    <input type="text" ref={ node => {this.roomName = node;} } id='input_room_name_field' className='field'></input><br />
                    비밀방인가?
                    <input type='checkbox' id='input_secret_field' className='checkfield'></input><br /><br />
                    초대하고 싶은 동무가 있는가?
                    <InviteList />
                    <button type='submit' id='post_room_button_field' className='PostRoomButton'>만들기</button>
                    </form>
                    <button id="cancel_button_field" className='CancelButton' onClick={this.props.onCancelClick}>그만두기</button>
                </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        friends: state.friends,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onPostClick: (roomName, secret, invite) => {
                     dispatch(postRoom(roomName, secret, invite))
                 },
        onCancelClick: () => dispatch(showChattingRoom())
    }
}

CreateRoom = connect(mapStateToProps, mapDispatchToProps)(CreateRoom);

export default CreateRoom;


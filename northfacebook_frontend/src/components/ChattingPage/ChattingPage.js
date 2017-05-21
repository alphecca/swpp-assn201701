import React from 'react'
import ChattingUserList from './ChattingUserList.js'
import TextList from './TextList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { postBack, showChattingRoom, postText } from '../../actions'
import { connect } from 'react-redux'
import './styles.css'

class ChattingPage extends React.Component {
    render() {
        // TODO <br />
        const onSubmit = () => {
            if (this.message !== undefined) {
                this.props.onSendClick(this.props.room.room_id, this.message.value)
            }
        };
        return (
                <div >
                <SignOut />
                <br /> <br /> <br /> <br /> <br /> <br />
                <div className="Chatting">
                <button id="to_main_page_field" onClick={this.props.onBackClick}>Back to main</button>
                <div className="divider" />
                <button id="change_room_button_field" onClick={this.props.onChangeRoomClick}>Change room</button>
                <p>Chatting user list</p>
                <ChattingUserList />
                <br />
                <hr />
                <br />
                <TextList />
                <form onSubmit={e => {
                    e.preventDefault()
                    onSubmit()
                    }}
                >
                <div className="Text-Field">
                    <input type="text" ref={ node => {this.message = node;} } id='input_text_field' className='field'></input>
                    <div className="divider" />
                    <button type="submit" id='post_text_button_field' className="PostTextButton">Send</button>
                </div>
                </form>
                </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        room: Object.assign(state)
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onBackClick: () => dispatch(postBack()),
        onChangeRoomClick: () => dispatch(showChattingRoom()),
        onSendClick: (room_id, message) => dispatch(postText(room_id, message))
    }
}

ChattingPage = connect(mapStateToProps, mapDispatchToProps)(ChattingPage)

export default ChattingPage
import React from 'react'
import ChattingUserList from './ChattingUserList.js'
import TextList from './TextList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { moreChat,lessChat, postBack, showChattingRoom, postText } from '../../actions'
import { connect } from 'react-redux'

class ChattingPage extends React.Component {
    render() {
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
        const onSubmit = () => {
            if (this.message !== undefined) {
                this.props.onSendClick(this.props.room.room_id, this.message.value)
            }
        };
      return (
          <div>
                <SignOut />
                <div className="Chatting">
                    <div className="divider" />
                    <button id="change_room_button_field" onClick={this.props.onChangeRoomClick}>모든방</button>
                    <div className="chattingBox">
                	<p>떠든 사람</p>
	                <ChattingUserList />
        	        <button id="more_chat_button_field" onClick={this.props.onMoreClick}>더!</button>
	                <button id="less_chat_button_field" onClick={this.props.onLessClick}>덜!</button>
	                <hr />
	                <TextList />
                    </div>
	                <form onSubmit={e => {
        	            e.preventDefault()
                	    onSubmit()
	                }}>
                        <div className="Text-Field">
                        <input type="text" ref={ node => {this.message = node;} } id='input_text_field' className='field'></input>
                        <div className="divider" />
                        <button type="submit" id='post_text_button_field' className="PostTextButton">한마디!</button>
  		    </div>
                    </form>
                </div>
          </div>
               )
    }
}

//<button id='more_button_field' onClick={()=>this.props.onMoreClick()}>더!</button>
let mapStateToProps = (state) => {
    return {
        loading: state.loading,
        room: Object.assign(state)
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onBackClick: () => dispatch(postBack()),
        onChangeRoomClick: () => dispatch(showChattingRoom()),
        onSendClick: (room_id, message) => {
            dispatch(postText(room_id, message));
            document.getElementById("input_text_field").value = "";
        },
        onMoreClick: () => dispatch(moreChat()),
        onLessClick: () => dispatch(lessChat())
    }
}

ChattingPage = connect(mapStateToProps, mapDispatchToProps)(ChattingPage)

export default ChattingPage

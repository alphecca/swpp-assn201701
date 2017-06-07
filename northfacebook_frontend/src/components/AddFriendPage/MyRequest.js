import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { postAddFriend, deleteAddFriend, changeUrl } from '../../actions'

class MyRequest extends React.Component {
    render() {
        const friendName = this.props.friend.me;
        const friendNameId = "mr_"+this.props.friend.me+"_name_field";
        const OKButtonId = "mr_"+this.props.friend.me+"_ok_button_field";
        const declineButtonId = "mr_"+this.props.friend.me+"_decline_button_field";
        const componentId = "mr_"+this.props.friend.me+"_field";

        return (
                <div id={componentId} className="MyRequest">
                    <a id={friendNameId} className="Link" onClick={() => this.props.onFriendClick(this.props.friend.me)}><u>{friendName}</u></a>
                    <div className="divider"/>
                    <button id={declineButtonId} onClick={() => this.props.onDeclineClick(this.props.friend.me)}>요청 취소</button>
                </div>
               )
    }
}

MyRequest.propTypes = {
    friend: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onFriendClick: (friend) => dispatch(changeUrl('/profile/'+friend+'/')),
        onDeclineClick: (friend) => dispatch(deleteAddFriend(friend))
    }
}

MyRequest = connect(undefined, mapDispatchToProps)(MyRequest)

export default MyRequest

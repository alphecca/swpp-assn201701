import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { postAddFriend, deleteAddFriend, changeUrl } from '../../actions'

class FriendRequest extends React.Component {
    render() {
        const friendName = this.props.friend.friend;
        const friendNameId = "fr_"+this.props.friend.friend+"_name_field";
        const OKButtonId = "fr_"+this.props.friend.friend+"_ok_button_field";
        const declineButtonId = "fr_"+this.props.friend.friend+"_decline_button_field";
        const componentId = "fr_"+this.props.friend.friend+"_field";

        return (
                <div id={componentId} className="FriendRequest">
                    <a id={friendNameId} className="Link" onClick={() => this.props.onFriendClick(this.props.friend.friend)}><u>{friendName}</u></a>
                    <div className="divider"/>
                    <button id={OKButtonId} onClick={() => this.props.onOKClick(this.props.friend.friend)}>좋소</button>
                    <div className="divider"/>
                    <button id={declineButtonId} onClick={() => this.props.onDeclineClick(this.props.friend.friend)}>싫소</button>
                </div>
               )
    }
}

FriendRequest.propTypes = {
    friend: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onFriendClick: (friend) => dispatch(changeUrl('/profile/'+friend+'/')),
        onOKClick: (friend) => dispatch(postAddFriend(friend)),
        onDeclineClick: (friend) => dispatch(deleteAddFriend(friend))
    }
}

FriendRequest = connect(undefined, mapDispatchToProps)(FriendRequest)

export default FriendRequest

import React from 'react'
import FriendList from './FriendList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { addFriend } from '../../actions'
import { connect } from 'react-redux'

class FriendPage extends React.Component {
    render() {
        let profuser = this.props.profuser;
        return (
                <div>
                    <SignOut />
                    <button id="add_friend_button_field" onClick={() => {this.props.onClick(profuser)}}>새 동무 추가</button>
                    <hr />
                    <FriendList />
                </div>
               );
    }
}

let mapStateToProps = (state) => {
    return {
        profuser: state.profile_user !== null ? Object.assign(state.profile_user.user) : null
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (profuser) => dispatch(addFriend(profuser))
    }
}

FriendPage = connect(mapStateToProps, mapDispatchToProps)(FriendPage);

export default FriendPage;

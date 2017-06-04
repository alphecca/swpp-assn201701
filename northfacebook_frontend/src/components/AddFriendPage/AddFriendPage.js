import React from 'react'
//import AddFriendList from './AddFriendList.js'
import SignOut from '../TimeLinePage/SignOut.js'
//import { postAddFriend, deleteAddFriend } from '../../actions'
import { connect } from 'react-redux'

class AddFriendPage extends React.Component {
    render() {
        return (
                <div>
                <SignOut />
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        profile_user: state.profile_user !== null ? Object.assign(state.profile_user.username) : null
    }
}

let mapDispatchToProps = (dispatch) => {
    return {

    }
}

AddFriendPage = connect(mapStateToProps, mapDispatchToProps)(AddFriendPage);

export default AddFriendPage;

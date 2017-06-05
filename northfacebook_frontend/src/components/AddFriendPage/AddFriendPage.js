import React from 'react'
import FriendRequestList from './FriendRequestList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { postAddFriend, deleteAddFriend, changeUrl } from '../../actions'
import { connect } from 'react-redux'

class AddFriendPage extends React.Component {
    render() {
        const profuserNameId = "fr_profuser_name_field";
        if (this.props.profile_user === null) {
            return (
                    <div>Now loading...</div>
                    )
        }
        else if (this.props.username == this.props.profile_user) { // warning이 뜨지만 == 으로 써야 합니다.
            console.log("yes");
            return (
                    <div>
                    <SignOut />
                    <br /> <br /> <br /> <br /> <br /> <br />
                    <div>
                    <span id="fr_message_field"><a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profile_user)}><u>{this.props.profile_user}</u></a>와 동무가 되고 싶어하는 인민들이라우.</span>
                    </div>
                    <FriendRequestList />
                    </div>
                   )
        }
        else if (this.props.friends.length === 0) {
            return (
                    <div>
                    <SignOut />
                    <br /> <br /> <br /> <br /> <br /> <br />
                    <div>
                    <span id="fr_message_field"><a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profile_user)}><u>{this.props.profile_user}</u></a>와(과) 동무가 되고 싶은가?</span>
                    </div>
                    </div>
                    )
        }
    }
}

let mapStateToProps = (state) => {
    return {
        username: state.authorization !== null ? Object.assign(state.authorization).split(":")[0] : null,
        profile_user: state.profile_user !== null ? Object.assign(state.profile_user.user) : null,
        friends: Object.assign(state.friends).map(friend => JSON.parse(JSON.stringify(
                        {
                            friend: friend
                        })
                    )
                )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onProfuserClick: (profuser) => dispatch(changeUrl('/profile/'+profuser+'/')),
    }
}

AddFriendPage = connect(mapStateToProps, mapDispatchToProps)(AddFriendPage);

export default AddFriendPage;

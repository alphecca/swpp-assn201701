import React from 'react'
import FriendRequestList from './FriendRequestList.js'
import MyRequestList from './MyRequestList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { postAddFriend, deleteAddFriend, changeUrl } from '../../actions'
import { connect } from 'react-redux'

class AddFriendPage extends React.Component {
    render() {
        const profuserNameId = "fr_"+this.props.profile_user+"_name_field";
        function checkFriend(objList, username) {
            var i;
            for (i=0; i<objList.length; i++) {
                // eslint-disable-next-line
                if (objList[i].friend.friend == username) return username;
            }
            return undefined;
        }
        console.log(this.props.username);
        if (this.props.profile_user === null) {
            return (
                    <div>불러오는 중...</div>
                    )
        }
        // eslint-disable-next-line
        else if (this.props.username == this.props.profile_user) { // warning이 뜨지만 == 으로 써야 합니다.
//            console.log("yes");
            return (
                    <div>
                    <SignOut />
                    <div className="AddFriendPage">
                    <div>
                    <span id="fr_message_field">자네와 동무가 되고 싶어하는 인민들이라우.</span>
                    </div>
                    <FriendRequestList />
                    <hr />
                    <div>
                    <span id="mr_message_field">자네가 다른 인민들에게 보낸 요청이라우.</span>
                    </div>
                    <MyRequestList />
                    <br />
                    <button id={"fr_"+this.props.profile_user+"_friend_button_field"} onClick={() => this.props.onFriendClick(this.props.profile_user)}>나의 동무들</button>
                    <div className="divider" />
                    <button id={"fr_"+this.props.profile_user+"_back_button_field"} onClick={() => this.props.onBackClick(this.props.profile_user)}>돌아가기</button>
                    </div>
                    </div>
                   )
        }
        else if (this.props.friend_requests.length === 0 && checkFriend(this.props.friends, this.props.username) === undefined) {
            return (
                    <div>
                    <SignOut />
                    <div className="AddFriendPage">
                    <div>
                    <span id="fr_message_field"><a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profile_user)}><u>{this.props.profile_user}</u></a>와(과) 동무가 되고 싶은가?</span>
                    </div>
                    <br />
                    <button id={"fr_"+this.props.profile_user+"_ok_button_field"} onClick={() => this.props.onOKClick(this.props.profile_user)}>그렇소</button>
                    <div className="divider" />
                    <button id={"fr_"+this.props.profile_user+"_back_button_field"} onClick={() => this.props.onBackClick(this.props.profile_user)}>일없읍니다</button>
                    </div>
                    </div>
                    )
        }
        else if (this.props.friend_requests.length !== 0) {
            console.log(this.props.friend_requests);
            return (
                    <div>
                    <SignOut />
                    <div className="AddFriendPage">
                    <div>
                    <span id="fr_message_field"><a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profile_user)}><u>{this.props.profile_user}</u></a>에게 동무가 되고 싶다고 말해 두었다우.</span>
                    </div>
                    <br />
                    <button id={"fr_"+this.props.profile_user+"_decline_button_field"} onClick={() => this.props.onDeclineClick(this.props.profile_user)}>요청 취소</button>
                    <div className="divider" />
                    <button id={"fr_"+this.props.profile_user+"_back_button_field"} onClick={() => this.props.onBackClick(this.props.profile_user)}>돌아가기</button>
                    </div>
                    </div>
                   )
        }
        else {
            return (
                    <div>
                    <SignOut />
                    <div className="AddFriendPage">
                    <div>
                    <span id="fr_message_field">자네는 이미 <a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profile_user)}><u>{this.props.profile_user}</u></a>와(과) 동무가 되었다우.</span>
                    </div>
                    <br />
                    <button id={"fr_"+this.props.profile_user+"_back_button_field"} onClick={() => this.props.onBackClick(this.props.profile_user)}>돌아가기</button>
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
        friend_requests: Object.assign(state.friend_requests).map(friend => JSON.parse(JSON.stringify(
                        {
                            friend: friend
                        })
                    )
                ),
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
        onBackClick: (profuser) => dispatch(changeUrl('/profile/'+profuser+'/')),
        onFriendClick: (profuser) => dispatch(changeUrl('/friend/'+profuser+'/')),
        onOKClick: (friend) => dispatch(postAddFriend(friend)),
        onDeclineClick: (friend) => dispatch(deleteAddFriend(friend))
    }
}

AddFriendPage = connect(mapStateToProps, mapDispatchToProps)(AddFriendPage);

export default AddFriendPage;

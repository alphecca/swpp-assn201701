import React from 'react'
import FriendList from './FriendList.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { addFriend, changeUrl } from '../../actions'
import { connect } from 'react-redux'

class FriendPage extends React.Component {
    render() {
        let profuser = this.props.profuser;
        const profuserNameId = "f_profuser_name_field";
        console.log(this.props.profuser);
        if (this.props.profuser === null) {
            return (
                    <div>Now loading...</div>
                    )
        }
        // eslint-disable-next-line
        if (this.props.username == this.props.profuser) { // warning이 뜨지만 == 으로 써야 합니다.
            return (
                    <div>
                        <SignOut />
                        <br /> <br /> <br /> <br /> <br /> <br />
                        <div>
                        <span id="f_message_field">자네의 동무 목록</span>
                        </div>
                        <button id="add_friend_button_field" onClick={() => {this.props.onClick(profuser)}}>동무 추가 요청 관리하기</button>
                        <hr />
                        <FriendList />
                    </div>
                   );
        }
        return (
                <div>
                    <SignOut />
                    <br /> <br /> <br /> <br /> <br /> <br />
                    <div>
                    <span id="f_message_field"><a id={profuserNameId} className="Link" onClick={() => this.props.onProfuserClick(this.props.profuser)}><u>{this.props.profuser}</u></a>의 동무 목록</span>
                    </div>
                    <button id="add_friend_button_field" onClick={() => {this.props.onClick(profuser)}}>이 인민과 동무가 되고 싶소!</button>
                    <hr />
                    <FriendList />
                </div>
               );
    }
}

let mapStateToProps = (state) => {
    return {
        username: state.authorization !== null ? Object.assign(state.authorization).split(":")[0] : null,
        profuser: state.profile_user !== null ? Object.assign(state.profile_user.user) : null
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (profuser) => dispatch(addFriend(profuser)),
        onProfuserClick: (profuser) => dispatch(changeUrl('/profile/'+profuser+'/')),
    }
}

FriendPage = connect(mapStateToProps, mapDispatchToProps)(FriendPage);

export default FriendPage;

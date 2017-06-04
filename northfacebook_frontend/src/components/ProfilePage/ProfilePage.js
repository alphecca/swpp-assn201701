import React from 'react';
import SignOut from '../TimeLinePage/SignOut.js';
import ButtonList from './ButtonList.js';
import {connect} from 'react-redux';

class ProfilePage extends React.Component {
    render() {
        return (
                <div>
                    <SignOut />
                    <div className="TimeLine">
                        <span>{this.props.profile_user}의 프로필</span>
                        <br />
                        <h2>이름:{this.props.profile_myname}</h2>
                        <h2>소속:{this.props.profile_mybelong}</h2>
                        <h2>소개말:{this.props.profile_myintro}</h2>
                    <div>
                        <ButtonList/>
                    </div>
                    </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        profile_user : state.profile_user !== null ? Object.assign(state.profile_user.user) : null,
//        profile_user:state.profile_data['user'],//TODO 나중에 내프로필이 아닌 남의 프로필 클릭하면 이거면 안됨
        profile_myname: state.profile_user !== null? Object.assign(state.profile_user.myname): null, 
        profile_mybelong: state.profile_user !== null? Object.assign(state.profile_user.mybelong):null, 
        profile_myintro: state.profile_user !== null? Object.assign(state.profile_user.myintro): null 
    }
}

/*let mapDispatchToProps = (dispatch) => {
    return {
    }
}
*/

export default ProfilePage = connect(mapStateToProps)(ProfilePage);


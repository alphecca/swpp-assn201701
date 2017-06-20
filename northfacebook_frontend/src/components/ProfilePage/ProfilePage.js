import React from 'react';
import SignOut from '../TimeLinePage/SignOut.js';
import ButtonList from './ButtonList.js';
import {connect} from 'react-redux';

class ProfilePage extends React.Component {
    render() {
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
        return (
                <div>
                    <SignOut />
                    <div className="TimeLine">
                        <img id='p_img' src={this.props.profile_myimage} alt='' />
                        <br />
			<div className="Change">
                        <span>{this.props.profile_user}의 프로필</span>
                        <br />
                        <h2 id="p_name">이름:{this.props.profile_myname}</h2>
                        <h2 id="p_belong">소속:{this.props.profile_mybelong}</h2>
                        <h2 id="p_intro">소개말:{this.props.profile_myintro}</h2>
			</div>
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
        loading: state.loading,
        profile_user : state.profile_user !== null ? Object.assign(state.profile_user.user) : null,
        profile_myname: state.profile_user !== null? Object.assign(state.profile_user.myname): null, 
        profile_mybelong: state.profile_user !== null? Object.assign(state.profile_user.mybelong):null, 
        profile_myintro: state.profile_user !== null? Object.assign(state.profile_user.myintro): null,
        profile_myimage: state.profile_user !== null? Object.assign(state.profile_user.domain): null, 
    }
}

export default ProfilePage = connect(mapStateToProps)(ProfilePage);


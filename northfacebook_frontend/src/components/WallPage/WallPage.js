import React from 'react';
import SignOut from '../TimeLinePage/SignOut.js';
import WallArticleList from './WallArticleList.js';
import {connect} from 'react-redux';

class WallPage extends React.Component {
    render() {
        return (
                <div>
                    <SignOut />
                    <div className="TimeLine">
                        <span id="wall_info">{this.props.profile_user}의 담벼락</span>
                        <button id="back_to_profile" onClick={this.props.onBackToProfile}>Back to Profile</button>
                        <WallArticleList />
                    </div>
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
        onBackToProfile: () => dispatch({type: 'TO_PROFILE'})
    }
}

WallPage = connect(mapStateToProps, mapDispatchToProps)(WallPage);

export default WallPage;

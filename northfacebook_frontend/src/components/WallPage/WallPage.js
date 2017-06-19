import React from 'react';
import SignOut from '../TimeLinePage/SignOut.js';
import WallArticleList from './WallArticleList.js';
import {connect} from 'react-redux';

class WallPage extends React.Component {
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
                        <h1 id="wall_info" >{this.props.profile_user}의 담벼락</h1>
                        <WallArticleList />
                    </div>
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
        profile_user: state.profile_user !== null ? Object.assign(state.profile_user.username) : null //TODO 이후 프로필 전체 구현 끝나면 수정 예정
    }
}
WallPage = connect(mapStateToProps)(WallPage);

export default WallPage;

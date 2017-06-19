import React from 'react'
import {connect} from 'react-redux'
import {signOut, changeUrl} from '../../actions'

class SignOut extends React.Component {
    //TODO 커밋 전에는 portnum 8000으로 수정
    render() {
        if (!this.props.loading) {
            return (
                <div className="ToolBar" >
                   <button id="to_main_page_field" className="TOMAIN" onClick={this.props.onBackClick}/>
                   <div className="Notif">
                   <span id="user_data_field">불러오는 중...</span>
                   </div>
                </div>
                    )
        }
        return (
                <div className="ToolBar" >
                   <button id="to_main_page_field" className="TOMAIN" onClick={this.props.onBackClick}/>
                   <div className="Notif">
                   <span id="user_data_field"><a id="to_my_profile" className="Link" onClick={ () => this.props.onToProfile(this.props.username) }><u>{this.props.username}</u></a> 동무 어서오시오!</span>
                   <button id="sign_out" className="Notif_button" onClick={this.props.onLogOut}>나오기</button>
                   <button id="to_my_wall" className="Notif_button" onClick={() => this.props.onToWall(this.props.username)}>담벼락</button>
                    <button id="chat_button_field" className="Notif_button" onClick={this.props.onChatClick}>대화방</button>
                   <audio controls loop>
                     <source id='janggunnim' src='http://wlxyzlw.iptime.org:8000/media/default/defaultBGM.mp3' type='audio/mpeg' />
                   </audio>
                   </div>
                </div>

               );
    }
}

let mapStateToProps = (state) => {
    return {
        username: state.authorization !== null ? Object.assign(state.authorization).split(":")[0] : null,
        loading: state.loading,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch(signOut()),
        onBackClick: () => dispatch(changeUrl('/main/')),
        onToWall: (username) => dispatch(changeUrl('/wall/'+username+"/")),
        onToProfile: (username) => dispatch(changeUrl('/profile/'+username+"/")),
        onChatClick: () => dispatch(changeUrl('/room/')),
    }
}

SignOut = connect(mapStateToProps, mapDispatchToProps)(SignOut);

export default SignOut

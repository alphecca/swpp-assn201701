import React from 'react'
import {connect} from 'react-redux'
import {signOut, postBack, changeUrl} from '../../actions'

class SignOut extends React.Component {
    render() {
        return (
                <div className="ToolBar" >
                   <div className="Notif">
                   <button id="to_main_page_field" className="TOMAIN" onClick={this.props.onBackClick}/>
                   <span id="user_data_field">{this.props.username} 동무 어서오시오!</span>
                   <button id="sign_out" className="SIGNOUT" onClick={this.props.onLogOut}>나오기</button>
                   <button id="to_my_wall" className="WALLBUTTON" onClick={() => this.props.onToWall(this.props.username)}>담벼락</button>
                   <button id="to_my_profile" className="PROFILEBUTTON" onClick={ ()=>this.props.onToProfile(this.props.username) }>내프로필</button>
                   </div>
                </div>

               );
    }
}

let mapStateToProps = (state) => {
    return {
        username: Object.assign(state.authorization).split(":")[0],
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch(signOut()),
        onBackClick: () => dispatch(postBack()),
        onToWall: (username) => dispatch(changeUrl('/wall/'+username+"/")),
        onToProfile: (username) => dispatch(changeUrl('/profile/'+username+"/"))
    }
}

SignOut = connect(mapStateToProps, mapDispatchToProps)(SignOut);

export default SignOut

import React from 'react'
import {connect} from 'react-redux'
import {signOut, postBack} from '../../actions'

class SignOut extends React.Component {
    render() {
        return (
                <div className="ToolBar" >
                   <div className="Notif">
                   <button className="TOMAIN" onClick={this.props.onBackClick}/>
                   <span id="user_data_field">{this.props.username} 동무 어서오시오!</span>
                   <button id="sign_out" className="SIGNOUT" onClick={this.props.onLogOut}>Sign Out</button>
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
        onBackClick: () => dispatch(postBack())
    }
}

SignOut = connect(mapStateToProps, mapDispatchToProps)(SignOut);

export default SignOut

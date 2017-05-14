import React from 'react'
import {connect} from 'react-redux'
import {signOut} from '../../actions'

class SignOut extends React.Component {
    render() {
        return (
                <div className="ToolBar" >
                   <div className="Notif">
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
        onLogOut: () => dispatch(signOut())
    }
}

SignOut = connect(mapStateToProps, mapDispatchToProps)(SignOut);

export default SignOut

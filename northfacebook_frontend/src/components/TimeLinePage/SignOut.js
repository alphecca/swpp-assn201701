import React from 'react'
import {connect} from 'react-redux'
import {signOut} from '../../actions'

class SignOut extends React.Component {
    render() {
        return (
<<<<<<< HEAD
                <div className="ToolBar" >
                   <div className="sign_out">
                   {this.props.username} 동무 어서오시오! <button id="sign_out" onClick={this.props.onLogOut}>Sign Out</button>
                   </div>
=======
                <div>
                <span id="user_data_field">{this.props.username} logged in!</span>
                <button id="sign_out" className="sign_out" onClick={this.props.onLogOut}>Sign Out</button>
>>>>>>> upstream/master
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

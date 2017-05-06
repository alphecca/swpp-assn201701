import React from 'react'
import {connect} from 'react-redux'
import {signOut} from '../../actions'

class SignOut extends React.Component {
    render() {
        return (
                <div>
                {this.props.username} logged in!<button id="sign_out" className="sign_out" onClick={this.props.onLogOut}>Sign Out</button>
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

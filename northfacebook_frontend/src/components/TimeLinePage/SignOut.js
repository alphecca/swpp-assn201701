import React from 'react'
import {connect} from 'react-redux'
import {signOut} from '../../actions'

const home_url = "http://wlxyzlw.iptime.org:3000/"

class SignOut extends React.Component {
    render() {
        return (
                <div>
                    <button id="sign_out" className="sign_out" onClick={() =>{window.open(home_url, '_self', false); this.props.onLogOut();}}>Sign Out</button>
                </div>
               );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch(signOut())
    }
}

SignOut = connect(undefined, mapDispatchToProps)(SignOut);

export default SignOut

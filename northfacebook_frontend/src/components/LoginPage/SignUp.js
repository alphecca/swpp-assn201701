import React from 'react';
import { connect } from 'react-redux';
//import { } from '../actions';

const SignUpUrl = window.location.href + 'sign_up'

class SignUp extends React.Component {
    render() {
        const onNewTab = () => {
            window.location = '/sign_up';
            console.log("Redirect to signup page...");
        };
        return (
                <div>
                    No account? <button id="sign_up" onClick={onNewTab}>Sign Up</button>
                </div>
                )
    }
}

SignUp = connect()(SignUp);

export default SignUp;

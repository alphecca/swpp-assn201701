import React from 'react';
import { connect } from 'react-redux';
//import { } from '../actions';

const SignUpUrl = "http://183.101.189.163:3000/#/sign_up"

class SignUp extends React.Component {
    render() {
        const onNewTab = () => {
            window.open(SignUpUrl, "SignUp page"); //TODO change url into account create page
            console.log("Redirect to signup page...");
        };
        return (
                <div>
                    No account? <button onClick={onNewTab}>Sign Up</button>
                </div>
                )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

SignUp = connect(undefined, mapDispatchToProps)(SignUp);

export default SignUp;

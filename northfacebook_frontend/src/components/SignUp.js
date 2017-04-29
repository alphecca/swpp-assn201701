import React from 'react';
import { connect } from 'react-redux';
//import { } from '../actions';

class SignUp extends React.Component {
    render() {
        const onNewTab = () => {
            window.open("http://183.101.189.163:8000/admin", "SignUp page"); //TODO change url into account create page
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

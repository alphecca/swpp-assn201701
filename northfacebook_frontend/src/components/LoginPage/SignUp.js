import React from 'react';
import { connect } from 'react-redux';
import {gotoSignUpPage} from '../../actions'

class SignUp extends React.Component {
    render() {
        const onNewTab = () => {
            console.log("Redirect to signup page...");
            this.props.onClick();
        };
        return (
                <div className="Button-Field">
                     No account? <button id="sign_up" onClick={onNewTab}>Sign Up</button>
                </div>
                )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => dispatch(gotoSignUpPage())
    }
}

SignUp = connect(undefined, mapDispatchToProps)(SignUp);

export default SignUp;

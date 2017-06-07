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
                     려권이 없소?? <button id="sign_up" onClick={onNewTab}>입BooK 하기</button>
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

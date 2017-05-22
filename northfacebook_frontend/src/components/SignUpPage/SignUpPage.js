import React from 'react'
import { connect } from 'react-redux';
import {postSignUp} from '../../actions';

class SignUpPage extends React.Component {
    render() {
        const onCreateSubmit = () => {
            if(this.username.value === "")
                alert("Enter the username");
            else if(this.password.value === "")
                alert("Enter the password");
            else if(this.pwdverification.value === "")
                alert("Enter the password verification");
            else if(this.password.value !== this.pwdverification.value)
                alert("Password does not match");
            else
                this.props.onClick(this.username.value, this.password.value)
        }
        return (
              <div>
                <div>
                   <img alt="" />
                </div>
                <div className="box">
                    아이디<input type="text" ref={ node => {this.username = node;}} id="username_field" className="field" />
                    <br />
                    비밀번호<input type="password" ref={ node => {this.password = node;}} id="password_field" className="field" />
                    <br />
                    비밀번호 확인<input type="password" ref={ node => {this.pwdverification = node;}} id="pwdverification_field" className="field" />
                    <br />
                    <button type="submit" id="sign_up"  onClick={onCreateSubmit} >반갑소 동무!</button>
                </div>
              </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (username, password) => {
            console.log("ask for sign-up");
            dispatch(postSignUp(username, password))
        }
    }
}

SignUpPage = connect(undefined, mapDispatchToProps)(SignUpPage);

export default SignUpPage;

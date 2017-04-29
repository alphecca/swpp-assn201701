import React from 'react'
import { connect } from 'react-redux';
import {postSignUp} from '../../actions';

class SignUpPage extends React.Component {
    render() {
        const onCreateSubmit = () => {
            if(this.username.value === "")
                alert("아이디를 입력하세요");
            else if(this.password.value === "")
                alert("비밀번호를 입력하세요");
            else if(this.pwdverification.value === "")
                alert("비밀번호 확인란을 입력하세요");
            else if(this.password.value !== this.pwdverification.value)
                alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요");
            else
                this.props.onClick(this.username.value, this.password.value)
        }
        return (
                <div style={{textAlign:'center'}}>
                    아이디<input type="text" ref={ node => {this.username = node;}} id="username_field" className="field" />
                    <br />
                    비밀번호<input type="password" ref={ node => {this.password = node;}} id="password_field" className="field" />
                    <br />
                    비밀번호 확인<input type="password" ref={ node => {this.pwdverification = node;}} id="pwdverification_field" className="field" />
                    <br />
                    <button type="submit" id="sign_up" onClick={onCreateSubmit}>회원가입</button>
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

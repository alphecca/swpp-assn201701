import React from 'react';
import { connect } from 'react-redux';
import { signIn } from '../../actions';

class SignIn extends React.Component {
    render() {
        const onSubmit = () => {
            if (this.username !== undefined && this.password !== undefined) {
                this.props.onClick(this.username.value, this.password.value)
            }
        };
        return (
         <div>
           <div className="Login-Box"></div>
           <div>
            <form onSubmit={e => {
                e.preventDefault()
                onSubmit()
                }}
                >
                <div className="Text-Field">
                    성명
                    <input type="text" ref={ node => {this.username = node;} } id='username_field' className='field'></input>
                    암호
                    <input type="password" ref={ node => {this.password = node;} } id='password_field' className='field'></input>
                    <button type="submit" id='sign_in' className='sign_in'>들어가기</button>
                </div>
            </form>
           </div>
          </div>
        )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: (username, password) => {
            dispatch(signIn(username, password))
        }
    }
}

SignIn = connect(undefined, mapDispatchToProps)(SignIn);

export default SignIn;

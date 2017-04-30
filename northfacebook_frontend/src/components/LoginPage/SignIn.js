import React from 'react';
import { connect } from 'react-redux';
import { signIn } from '../../actions';
//import './styles.css';

//var home_url ='http://wlxyzlw.iptime.org:3000'

class SignIn extends React.Component {
    render() {
        const onSubmit = () => {
            if (this.username !== undefined && this.password !== undefined) {
                this.props.onClick(this.username.value, this.password.value)
            }
        };
        return (
           <div>
            <form onSubmit={e => {
                e.preventDefault()
                onSubmit()
                }}
                >
                <div>
                    <input type="text" ref={ node => {this.username = node;} } id='username_field' className='field'></input>
                    <input type="password" ref={ node => {this.password = node;} } id='password_field' className='field'></input>
                    <button type="submit" id='sign_in' className='sign_in'>Sign in</button>
                </div>
            </form>
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

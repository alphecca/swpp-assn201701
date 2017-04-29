import React, { Component } from 'react';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import './styles.css';

class Root extends Component {
    render() {
        return (
            <div style={ {textAlign: 'center'} }>
                <SignIn />
                <SignUp />
            </div>
    );
  }
}

export default Root;

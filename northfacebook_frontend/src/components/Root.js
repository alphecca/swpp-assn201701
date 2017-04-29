import React, { Component } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

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

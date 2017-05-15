import React, { Component } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './styles1.css';

class Root extends Component {
    render() {
        return (
           <body>
            <div className="app">
                <SignIn />
                <SignUp />
            </div>
           </body>
    );
  }
}

export default Root;

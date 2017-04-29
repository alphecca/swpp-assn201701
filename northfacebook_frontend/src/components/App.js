import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route } from 'react-router-dom';
import Root from './Root';
import SignUpPage from './SignUpPage';
import PropTypes from 'prop-types';

const Tmp = () => (
            <BrowserRouter>
                <div>
                <Route exact path="/main" component={Root} />
                <Route exact path="/sign_up" component={SignUpPage} />
                </div>
            </BrowserRouter>
        );

const App = ({store}) => (
        <Provider store={store}>
            <Tmp />
        </Provider>
        );

App.propTypes = {
    store: PropTypes.object.isRequired,
};

export default App;

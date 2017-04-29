import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {HashRouter, Route } from 'react-router-dom';
import Root from './Root';
import SignUpPage from './SignUpPage';
import PropTypes from 'prop-types';

const Tmp = () => (
            <HashRouter>
                <div>
                <Route exact path="/main" component={Root} />
                <Route exact path="/sign_up" component={SignUpPage} />
                </div>
            </HashRouter>
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

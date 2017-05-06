import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage.js';
import SignUpPage from './SignUpPage/SignUpPage.js';
import TimeLinePage from './TimeLinePage/TimeLinePage.js';
import PropTypes from 'prop-types';


// Used for controlling multiple pages in one frontend project
const App = ({store}) => (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/sign_up" component={SignUpPage} />
                    <Route exact path="/main" component={TimeLinePage} />
                </div>
            </BrowserRouter>
        </Provider>
        );

App.propTypes = {
    store: PropTypes.object.isRequired,
};

export default App;

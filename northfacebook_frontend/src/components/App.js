import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route } from 'react-router-dom';
import Root from './Root';
import SignUpPage from './SignUp/SignUpPage';
import PropTypes from 'prop-types';

const App = ({store}) => (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Root} />
                    <Route exact path="/sign_up" component={SignUpPage} />
                </div>
            </BrowserRouter>
        </Provider>
        );

App.propTypes = {
    store: PropTypes.object.isRequired,
};

export default App;

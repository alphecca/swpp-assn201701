import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage.js';
import SignUpPage from './SignUpPage/SignUpPage.js';
import TimeLinePage from './TimeLinePage/TimeLinePage.js';
import AddArticlePage from './AddArticlePage/AddArticlePage.js';
import ArticleDetailPage from './ArticleDetailPage/ArticleDetailPage.js';
import EditArticlePage from './EditArticlePage/EditArticlePage.js';
import ChattingRoomPage from './ChattingRoomPage/ChattingRoomPage.js';
//import NoMatchPage from './NoMatchPage/NoMatchPage.js';
import PropTypes from 'prop-types';



// Used for controlling multiple pages in one frontend project
// hard-coding : access of unlogged-in user to TimeLinePage
const App = ({store}) => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/sign_up" component={SignUpPage} />
                    <Route exact path="/main" component={TimeLinePage} />
                    <Route path="/article/:id" component={ArticleDetailPage} />
                    <Route exact path="/write/:id?" component={AddArticlePage} />
                    <Route exact path="/edit/:id" component={EditArticlePage} /> 
		    <Route exact path="/room" component={ChattingRoomPage} />
                </div>
            </BrowserRouter>
        </Provider>
        )
}

App.propTypes = {
    store: PropTypes.object.isRequired,
};

export default App;

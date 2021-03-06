import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage.js';
import SignUpPage from './SignUpPage/SignUpPage.js';
import TimeLinePage from './TimeLinePage/TimeLinePage.js';
import ArticleDetailPage from './ArticleDetailPage/ArticleDetailPage.js';
import ChattingRoomPage from './ChattingRoomPage/ChattingRoomPage.js';
import CreateRoomPage from './CreateRoomPage/CreateRoomPage.js';
import ChattingPage from './ChattingPage/ChattingPage.js';
import WallPage from './WallPage/WallPage.js';
import ProfilePage from './ProfilePage/ProfilePage.js';
import FriendPage from './FriendPage/FriendPage.js';
import AddFriendPage from './AddFriendPage/AddFriendPage.js';
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
                    <Route exact path="/room" component={ChattingRoomPage} />
                    <Route exact path="/create_room" component={CreateRoomPage} />
                    <Route exact path="/chatting/:id" component={ChattingPage} />
                    <Route path="/wall/:id" component={WallPage} />
                    <Route path="/profile/:id" component={ProfilePage} />
                    <Route path="/friend/:id" component={FriendPage} />
                    <Route path="/addfriend/:id" component={AddFriendPage} />
                </div>
            </BrowserRouter>
        </Provider>
        )
}

App.propTypes = {
    store: PropTypes.object.isRequired,
};

export default App;

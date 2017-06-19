import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import homepageApp from './reducers'
import App from './components/App';
import saga from './store/homepage/new_sagas.js'
import './css/main_styles.css';

const sagaMiddleware = createSagaMiddleware();

const reducer = homepageApp;
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(saga)

render(
    <div id="mypage">
    <App store={store} />
    </div>,
    document.getElementById('root')
);

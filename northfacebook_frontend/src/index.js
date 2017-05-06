import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import homepageApp from './reducers'
import App from './components/App';
import saga from './store/homepage/sagas'
import './index.css';

const sagaMiddleware = createSagaMiddleware();

const reducer = homepageApp;
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(saga)

render(
    <App store={store} />,
    document.getElementById('root')
);
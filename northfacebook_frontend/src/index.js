import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import homepageApp from './reducers'
import App from './components/App';
import saga from './store/homepage/sagas'
import './index.css';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
    homepageApp,
    applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(saga)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

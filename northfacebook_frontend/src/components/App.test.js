import React from 'react';
import {render} from 'react-dom';
import App from './App.js';
import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';
import homepageApp from '../reducers';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const reducers = homepageApp;
  const sagaMiddleware = createSagaMiddleware;
  const store = createStore(
      reducers,
      applyMiddleware(sagaMiddleware)
      );
  render(<App store={store} />, div);

});

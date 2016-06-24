import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureStore from '../common/store/configureStore';
import getRoutes from '../common/routes';

const store = configureStore(window.__PRELOADED_STATE__);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={getRoutes(store)}/>
  </Provider>,
  document.getElementById('root')
)

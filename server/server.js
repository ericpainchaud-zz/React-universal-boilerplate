/* eslint-disable no-console, no-use-before-define */

import path from 'path';
import express from 'express';
import qs from 'qs';

import logger from 'morgan';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import { match, RouterContext } from 'react-router'
import routes from '../common/routes';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import nunjucks from 'nunjucks';

import configureStore from '../common/store/configureStore';
import { fetchCounter } from '../common/api/counter';

const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = 3000;
const server = express();

/**
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

**/
// view engine setup
nunjucks.configure('server/views', {
  autoescape: true,
  express: server
});
server.set('view engine', 'html');
server.set('port', PORT);
server.use(compression())
server.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(expressValidator());
server.use(cookieParser());

/**

server.use('/css', postcss({
  src: function(req) {
    return path.join(__dirname, 'public', 'css', req.path);
  },
  plugins: [atImport(), cssnext()]
}));

**/

/**
// Proxy to API server
server.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl})
})
**/

/**
// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }
  if (!res.headersSent) {
    if (typeof res.writeHead === 'function') res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message}
  res.end(JSON.stringify(json))
})
**/

if (DEBUG) {
  // Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig)
  server.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  server.use(webpackHotMiddleware(compiler))
} else {
  server.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

// This is fired every time the server side receives a request
server.use(handleRender)

function handleRender(req, res) {
  // Query our mock API asynchronously
  fetchCounter(apiResult => {
    // Read the counter from the request, if provided
    const params = qs.parse(req.query)
    const counter = parseInt(params.counter, 10) || apiResult || 0

    // Compile an initial state
    const initialState = { counter };

    var store = configureStore(initialState);

    match({ routes: routes(store), location: req.url }, function(err, redirectLocation, renderProps) {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        var html = renderToString(React.createElement(Provider, { store: store },
          React.createElement(RouterContext, renderProps)
        ));
        var page = nunjucks.render('layout.html', { html: html, initialState: JSON.stringify(store.getState()) });
        res.status(200).send(page);
      } else {
        res.sendStatus(404);
      }
    });
  })
}

server.use(express.static('static'));

server.listen(PORT, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`)
  }
})

module.exports = server;

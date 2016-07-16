/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { App } from './containers';
import io from 'socket.io-client';

const dest = document.getElementById('content');


function initSocket() {
  const socket = io('', { path: '/ws' });
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', (data) => {
    console.log(data);
  });

  return socket;
}

global.socket = initSocket();

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  dest
);

if (module.hot) {
  module.hot.accept('./containers', () => {
    var containers = require('./containers'); // eslint-disable-line
    const NextApp = containers.App;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      dest
    );
  });
}

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

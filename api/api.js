import Koa from 'koa';
import session from 'koa-session';
import convert from 'koa-convert';

import SocketIo from 'socket.io';
import http from 'http';

import config from '../src/config';

const app = new Koa();
const server = new http.Server(app.callback());

const io = new SocketIo(server);
io.path('/ws');

app.keys = [
  '197f14af3d1d09063b4b2a1de5e7bfd3bda01a5fe2aaef405d541d67b35c2cc8',
  '86dc3dcb01de28381df96960c2af14bc2b49b525bcaa2d3cf9d950bac273f584',
  'c66b70598477e13042428f19a825e9b07bc4af64616b9f144e126847b2c7e019'
];

const middlewares = [
  convert(session(app)),
];

// load middlewares
for (const middleware of middlewares) {
  app.use(middleware);
}

// response
app.use(ctx => {
  ctx.body = 'Hello Koa api'; // eslint-disable-line no-param-reassign
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', { msg: '\'Hello World!\' from server' });

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex; // eslint-disable-line no-param-reassign
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}


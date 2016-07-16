// koa
import Koa from 'koa';
import serve from 'koa-static';
import favicon from 'koa-favicon';
// import convert from 'koa-convert';
import compress from 'koa-compress';

// react
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// others
import httpProxy from 'http-proxy';
import path from 'path';
import http from 'http';
import { Z_SYNC_FLUSH } from 'zlib';

import config from './config';
import Html from './helpers/Html';

const app = new Koa();
const server = new http.Server(app.callback());

const faviconPath = path.join(__dirname, '../static/favicon.ico');
const staticPath = path.join(__dirname, '..', 'static');
const targetUrl = `http://${config.apiHost}:${config.apiPort}`;

const middlewares = [
  compress({ flush: Z_SYNC_FLUSH }),
  favicon(faviconPath),
  serve(staticPath, { maxage: 1000 * 60 * 60 * 24 * 30 }),
];

// load middlewares
for (const middleware of middlewares) {
  app.use(middleware);
}

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

app.use((ctx, next) => {
  if (/^\/api/i.test(ctx.originalUrl)) {
    ctx.respond = false;// eslint-disable-line no-param-reassign
    return proxy.web(ctx.req, ctx.res, { target: targetUrl });
  }

  if (/^\/ws/i.test(ctx.originalUrl)) {
    ctx.respond = false;// eslint-disable-line no-param-reassign
    return proxy.web(ctx.req, ctx.res, { target: `${targetUrl}/ws` });
  }

  return next();
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

app.use(ctx => {
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  function hydrateOnClient() {
    const html = ReactDOMServer.renderToString(
      <Html assets={webpackIsomorphicTools.assets()} store={{}} />
    );
    ctx.body = `<!doctype html>${html}`;// eslint-disable-line no-param-reassign
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }
  hydrateOnClient();
});


if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}

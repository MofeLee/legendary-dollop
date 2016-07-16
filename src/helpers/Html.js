import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
// import serialize from 'serialize-javascript';
import reactCSS from 'reactcss';
import Helmet from 'react-helmet';

const Html = ({
  assets,
  component,
  // store
}) => {
  const content = component ? ReactDOM.renderToString(component) : '';
  const head = Helmet.rewind();

  return (
    <html lang="zh-CN">
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel="shortcut icon" href="/favicon.ico" />
        <link href='http://fonts.useso.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* styles (will be present only in production with webpack extract text plugin) */}

      </head>
      <body style={s.body}>
        <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
        <script src={assets.javascript.main} charSet="UTF-8" />
      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object
};

export default Html;

const s = reactCSS({
  'default': {
    body: {
      flex:1,
      backgroundColor: 'gray'
    }
  }
})

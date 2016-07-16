require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Mofe\'s Blog',
    description: '李勇的个人博客',
    head: {
      titleTemplate: 'Mofe: %s',
      meta: [
        { name: 'description', content: 'Mofe\'s Blog' },
        { charset: 'utf-8' },
        { property: 'og:site_name', content: 'Mofe\'s Blog' },
        { property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg' },
        { property: 'og:locale', content: 'zh-CN' },
        { property: 'og:title', content: 'Mofe\'s Blog' },
        { property: 'og:description', content: '李勇的个人博客' },
        { property: 'og:card', content: 'summary' },
        { property: 'og:site', content: '@MofeLee' },
        { property: 'og:creator', content: '@MofeLee' },
        { property: 'og:image:width', content: '200' },
        { property: 'og:image:height', content: '200' }
      ]
    }
  },

}, environment);

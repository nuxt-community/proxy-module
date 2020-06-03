const { resolve } = require('path')
const proxyModule = require('../..')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    proxyModule
  ],
  serverMiddleware: [
    require('./middleware')
  ],
  proxy: [
    'http://icanhazip.com'
  ]
}

export default {
  createRequire: process.env.TEST ? 'native' : 'jiti',
  render: {
    resourceHints: false
  },
  modules: [
    '../../src/index.ts'
  ],
  serverMiddleware: {
    '/_api': '~/api/index'
  },
  proxy: {
    '/example': 'http://example.com'
  }
}

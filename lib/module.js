const { createProxyMiddleware } = require('http-proxy-middleware')
const logger = require('./logger')

// Redirect info ~> debug
logger.info = logger.debug

function proxyModule (options) {
  if (!this.options.proxy) {
    // No proxy defined
    logger.warn('No proxy defined on top level.')
    return
  }

  if (this.options.mode !== 'spa') {
    this.nuxt.hook('generate:before', () => {
      logger.warn('The module `@nuxtjs/proxy` does not work in generated mode.')
    })
  }

  // Defaults
  const defaults = Object.assign(
    {
      // Required for virtual hosted sites
      changeOrigin: true,
      // Proxy webSockets
      ws: true,
      // Use consola as default logger
      logProvider: () => logger
    },
    options
  )

  delete defaults.src

  // Normalize options.proxy to middleware arguments
  const applyDefaults = o => Object.assign({}, defaults, o)
  const normalizeTarget = o => (typeof o === 'object' ? o : { target: o })

  const proxy = []
  if (Array.isArray(this.options.proxy)) {
    // Array mode
    this.options.proxy.forEach((p) => {
      if (Array.isArray(p)) {
        proxy.push([p[0], applyDefaults(normalizeTarget(p[1]))])
      } else {
        proxy.push([p, applyDefaults()])
      }
    })
  } else {
    // Object mode
    Object.keys(this.options.proxy).forEach((context) => {
      proxy.push([
        context,
        applyDefaults(normalizeTarget(this.options.proxy[context]))
      ])
    })
  }

  // Register middleware
  proxy.forEach((args) => {
    // https://github.com/chimurai/http-proxy-middleware
    this.addServerMiddleware({
      prefix: false, // http-proxy-middleware uses req.originalUrl
      handler: createProxyMiddleware(...args)
    })
  })
}

module.exports = proxyModule
module.exports.meta = require('../package.json')

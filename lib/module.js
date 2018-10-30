const Proxy = require('http-proxy-middleware')
const consola = require('consola')

const logProvider = consola.withScope('nuxt:proxy')

// Redirect info ~> debug
logProvider.info = logProvider.debug

module.exports = function nuxtProxy (options) {
  if (!this.options.proxy) {
    // No proxy defined
    return
  }

  this.nuxt.hook('generate:before', () => {
    consola.warn('This module does not work in generated mode')
  })

  // Defaults
  const defaults = Object.assign(
    {
      // Required for virtual hosted sites
      changeOrigin: true,
      // Proxy webSockets
      ws: true,
      // Use consola as default logger
      logProvider: () => logProvider
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
    this.options.proxy.forEach(p => {
      if (Array.isArray(p)) {
        proxy.push([p[0], applyDefaults(normalizeTarget(p[1]))])
      } else {
        proxy.push([p, applyDefaults()])
      }
    })
  } else {
    // Object mode
    Object.keys(this.options.proxy).forEach(context => {
      proxy.push([
        context,
        applyDefaults(normalizeTarget(this.options.proxy[context]))
      ])
    })
  }

  // Register middleware
  proxy.forEach(args => {
    // https://github.com/chimurai/http-proxy-middleware
    const middleware = Proxy.apply(undefined, args)
    middleware.prefix = false // Don't add router base
    this.options.serverMiddleware.push(middleware)
  })
}

module.exports.meta = require('../package.json')

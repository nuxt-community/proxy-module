import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Module } from '@nuxt/types'
import { HttpProxyOptions, getProxyEntries, NuxtProxyOptions } from './options'

declare module '@nuxt/types' {
  interface Configuration {
    proxy?: NuxtProxyOptions
  }
}

const proxyModule: Module<HttpProxyOptions> = function (options: HttpProxyOptions) {
  const nuxt: any = this.nuxt

  if (!nuxt.options.server || !nuxt.options.proxy) {
    return
  }

  // Defaults
  const defaults: HttpProxyOptions = {
    changeOrigin: true,
    ws: true,
    ...options
  }

  const proxyEntries = getProxyEntries(nuxt.options.proxy as NuxtProxyOptions, defaults)

  // Register middleware
  for (const proxyEntry of proxyEntries) {
    // https://github.com/chimurai/http-proxy-middleware
    this.addServerMiddleware({
      prefix: false, // http-proxy-middleware uses req.originalUrl
      handler: createProxyMiddleware(proxyEntry.context, proxyEntry.options)
    })
  }
}

// @ts-ignore
proxyModule.meta = require('../package.json')

export default proxyModule

# Proxy Module

[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/proxy/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/proxy)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/proxy.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/proxy)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/proxy-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/proxy-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/proxy-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/proxy-module)
[![Dependencies](https://david-dm.org/nuxt-community/proxy-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/proxy-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> The one-liner node.js http-proxy middleware solution for Nuxt.js using
 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

[📖 **Release Notes**](./CHANGELOG.md)

✨ Do you know that [Axios Module](https://github.com/nuxt-community/axios-module) has built in support for Proxy Module?

## Features

✓ Path rewrites

✓ Host based router (useful for staging/test)

✓ Logs / Proxy Events

✓ WebSockets

✓ Auth / Cookie

✓ ...and more! (see [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) docs)

## Setup
- Add `@nuxtjs/proxy` dependency using yarn or npm to your project
- Add `@nuxtjs/proxy` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
   '@nuxtjs/proxy',

   // With options
   ['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/api/v1' } }],
  ]
}
```

- Define as many as proxy middleware you want in `proxy` section of  `nuxt.config.js` (See [proxy](#proxy) section below)

## Options
- `changeOrigin` and `ws` options are enabled by default.

[optional] You can provide default options to all proxy targets by passing options to module options.

## `proxy`
You can provide proxy config using either object or array.

### Array mode
You can use magic [shorthands](https://github.com/chimurai/http-proxy-middleware#shorthand)

```js
{
  proxy: [
    // Proxies /foo to http://example.com/foo
    'http://example.com/foo',

    // Proxies /api/books/*/**.json to http://example.com:8000
    'http://example.com:8000/api/books/*/**.json',

    // You can also pass more options
    [ 'http://example.com/foo', { ws: false } ]
  ]
}
```

### Object mode
Keys are [context](https://github.com/chimurai/http-proxy-middleware#context-matching)

```js
{
  proxy: {
      // Simple proxy
      '/api': 'http://example.com',

      // With options
      '/api2': { target: 'http://example.com', ws: false }
  }
}
```


## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community - Pooya Parsa <pooya@pi0.ir>

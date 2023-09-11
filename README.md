# @nuxtjs/proxy

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-src]][codecov-href]
[![license][license-src]][license-href]

> Proxy support for Nuxt 2 server

[📖 **Release Notes**](./CHANGELOG.md)

## Nuxt 3

In Nuxt 3 you can make use of [Route Rules](https://nitro.unjs.io/guide/routing) to configure your proxies.

```
export default defineNuxtConfig({
  routeRules: {
    '/proxy/example': { proxy: 'https://example.com' },
    '/proxy/**': { proxy: '/api/**' },
  }
})
```

## Features

✓ Path rewrites

✓ Host based router (useful for staging/test)

✓ Logs / Proxy Events

✓ WebSockets

✓ Auth / Cookie

✓ ...See [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) docs

⚠ Does not work with `nuxt generate` (see [static target](https://nuxtjs.org/docs/2.x/features/deployment-targets#static-hosting)).

## Setup

1. Add `@nuxtjs/proxy` dependency to your project

```bash
yarn add @nuxtjs/proxy # or npm install @nuxtjs/proxy
```

2. Add `@nuxtjs/proxy` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    '@nuxtjs/proxy'
  ],
  proxy: {
    // see Proxy section
  }
}
```

- Define as many as proxy middleware you want in `proxy` section of  `nuxt.config.js` (See [proxy](#proxy) section below)

## `proxy`

You can provide proxy config using either object or array.

### Array Config

You can use [shorthand syntax](https://github.com/chimurai/http-proxy-middleware#shorthand) to configure proxy:

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

### Object Config

Keys are [context](https://github.com/chimurai/http-proxy-middleware#context-matching)

```js
{
  proxy: {
    // Simple proxy
    '/api': 'http://example.com',

    // With options
    '/api2': {
      target: 'http://example.com',
      ws: false
    },

    // Proxy to backend unix socket
    '/api3': {
      changeOrigin: false,
      target: { socketPath: '/var/run/http-sockets/backend.sock' }
    }
  }
}
```

## Default Options

- `changeOrigin` and `ws` options are enabled by default.

You can provide default options to all proxy targets by passing options to module options:

```js
export default {
  modules: [
    // Disable ws option to all proxified endpoints
    ['@nuxtjs/proxy', { ws: false }]
  ],
  proxy: [
    'http://example.com/foo',
    'http://example.com:8000/api/books/*/**.json',
  ]
}
```

This will be similar to:

```js
export default {
  modules: [
    '@nuxtjs/proxy',
  ],
  proxy: [
    ['http://example.com/foo', { ws: false }],
    ['http://example.com:8000/api/books/*/**.json', { ws: false }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/proxy/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/proxy

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/proxy.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/proxy

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/proxy-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/proxy-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/proxy.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs/proxy

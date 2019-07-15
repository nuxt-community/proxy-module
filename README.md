# @nuxtjs/proxy

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> The one-liner node.js http-proxy middleware solution for Nuxt.js using [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

[📖 **Release Notes**](./CHANGELOG.md)

✨ Do you know that [Axios Module](https://github.com/nuxt-community/axios-module) has built in support for Proxy Module?

## Features

✓ Path rewrites

✓ Host based router (useful for staging/test)

✓ Logs / Proxy Events

✓ WebSockets

✓ Auth / Cookie

✓ ...and more! (see [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) docs)

⚠ Does not work in generated/static mode!

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
    '@nuxtjs/proxy',

    // With options
    ['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/api/v1' } }]
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
    '/api2': { target: 'http://example.com', ws: false },

    // Proxy to backend unix socket
    '/api3': {
      changeOrigin: false,
      target: { socketPath: '/var/run/http-sockets/backend.sock' }
    }
  }
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

[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/proxy-module.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/proxy-module

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/proxy-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/proxy-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/proxy.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs/proxy

jest.setTimeout(60000)

const { Nuxt, Generator, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const consola = require('consola')

const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt

consola.mockTypes(() => jest.fn())

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('warnings', () => {
  beforeEach(() => {
    consola.warn.mockClear()
  })

  afterEach(async () => {
    await nuxt.close()
  })

  test('generate universal mode', async () => {
    nuxt = new Nuxt({
      ...config,
      render: {
        ssr: false
      },
      build: {
        quiet: true
      },
      proxy: {
        '/proxy': url('/api'),
        '/rewrite': {
          target: url('/api'),
          pathRewrite: { '^/rewrite': '' }
        }
      }
    })

    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    expect(consola.warn).toHaveBeenNthCalledWith(1, 'The module `@nuxtjs/proxy` does not work in generated mode.')
  })

  test('generate spa mode', async () => {
    nuxt = new Nuxt({
      ...config,
      mode: 'spa',
      build: {
        quiet: true
      }
    })

    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    expect(consola.warn).not.toHaveBeenCalled()
  })
})

describe('object mode', () => {
  beforeAll(async () => {
    nuxt = new Nuxt({
      ...config,
      proxy: {
        '/proxy': url('/api'),
        '/rewrite': {
          target: url('/api'),
          pathRewrite: { '^/rewrite': '' }
        }
      }
    })

    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('basic', async () => {
    expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })

  test('pathRewrite', async () => {
    expect(await get('/rewrite/aaa')).toBe('url:/aaa')
  })
})

describe('array mode', () => {
  beforeAll(async () => {
    nuxt = new Nuxt({
      ...config,
      proxy: [
        url('/api'),
        [url('/api'), {}]
      ]
    })

    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('basic', async () => {
    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

describe('disabled', () => {
  beforeAll(async () => {
    nuxt = new Nuxt({
      ...config,
      proxy: false
    })

    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('basic', async () => {
    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

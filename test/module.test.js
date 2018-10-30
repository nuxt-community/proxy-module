const { Nuxt, Generator, Builder } = require('nuxt-edge')
const consola = require('consola')

const request = require('request-promise-native')
const config = require('./fixture/nuxt.config')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('warnings', () => {
  let nuxt
  let log

  beforeEach(() => {
    log = jest.fn()
    consola.clear().add({ log })
  })

  afterEach(async () => {
    await nuxt.close()
  })

  it('generate', async () => {
    nuxt = new Nuxt(
      Object.assign({}, config, {
        render: {
          ssr: false
        },
        build: {
          quiet: false
        },
        proxy: {
          '/proxy': url('/api'),
          '/rewrite': {
            target: url('/api'),
            pathRewrite: { '^/rewrite': '' }
          }
        }
      })
    )
    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    const messageInExtendFunction = 'This module does not work in generated mode'
    const consolaMessages = log.mock.calls.map(c => c[0].message)
    expect(consolaMessages).toContain(messageInExtendFunction)
  }, 30000)
})

describe('object mode', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(
      Object.assign({}, config, {
        proxy: {
          '/proxy': url('/api'),
          '/rewrite': {
            target: url('/api'),
            pathRewrite: { '^/rewrite': '' }
          }
        }
      })
    )

    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  it('basic', async () => {
    expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })

  it('pathRewrite', async () => {
    expect(await get('/rewrite/aaa')).toBe('url:/aaa')
  })
})

describe('array mode', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(
      Object.assign({}, config, {
        proxy: [url('/api')]
      })
    )
    await nuxt.listen(3000)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  it('basic', async () => {
    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

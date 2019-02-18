jest.setTimeout(60000)

const { Nuxt, Generator, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const consola = require('consola')

const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

describe('warnings', () => {
  let log

  beforeEach(() => {
    log = jest.fn()
    consola.clear().add({ log })
  })

  afterEach(async () => {
    await nuxt.close()
  })

  test.skip('generate', async () => {
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

    const messageInExtendFunction = 'The module `@nuxtjs/proxy` does not work in generated mode.'
    const consolaMessages = log.mock.calls.map(c => c[0].message)
    expect(consolaMessages).toContain(messageInExtendFunction)
  })
})

describe('object mode', () => {
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

  test('basic', async () => {
    expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })

  it('pathRewrite', async () => {
    expect(await get('/rewrite/aaa')).toBe('url:/aaa')
  })
})

describe('array mode', () => {
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

  test('basic', async () => {
    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

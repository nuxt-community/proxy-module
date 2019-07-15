jest.setTimeout(60000)

const { Nuxt, Generator, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')

const logger = require('../lib/logger')
logger.mockTypes(() => jest.fn())

const config = require('./fixture/nuxt.config')
config.dev = false

let nuxt, port

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await nuxt.ready()
  port = await getPort()
  await nuxt.listen(port)

  return nuxt
}

describe('module', () => {
  beforeEach(() => {
    logger.warn.mockClear()
  })

  afterEach(async () => {
    if (nuxt) {
      await nuxt.close()
    }
  })

  test('generate universal mode', async () => {
    nuxt = await setupNuxt({
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

    expect(logger.warn).toHaveBeenCalledWith('The module `@nuxtjs/proxy` does not work in generated mode.')
  })

  test('generate spa mode', async () => {
    nuxt = await setupNuxt({
      ...config,
      mode: 'spa',
      build: {
        quiet: true
      }
    })

    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    expect(logger.warn).not.toHaveBeenCalled()
  })

  test('object mode', async () => {
    nuxt = await setupNuxt({
      ...config,
      proxy: {
        '/proxy': url('/api'),
        '/rewrite': {
          target: url('/api'),
          pathRewrite: { '^/rewrite': '' }
        }
      }
    })

    expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
    expect(await get('/rewrite/aaa')).toBe('url:/aaa')
  })

  test('array mode', async () => {
    nuxt = await setupNuxt({
      ...config,
      proxy: [
        url('/api'),
        [url('/api'), {}]
      ]
    })

    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })

  test('disabled', async () => {
    nuxt = await setupNuxt({
      ...config,
      proxy: false
    })

    expect(logger.warn).toHaveBeenCalledWith('No proxy defined on top level.')

    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

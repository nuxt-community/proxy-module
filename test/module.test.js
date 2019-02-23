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

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await nuxt.listen(3000)

  return nuxt
}

describe('module', () => {
  beforeEach(() => {
    consola.warn.mockClear()
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

    expect(consola.warn).toHaveBeenNthCalledWith(1, 'The module `@nuxtjs/proxy` does not work in generated mode.')
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

    expect(consola.warn).not.toHaveBeenCalled()
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

    await expect(await get('/proxy/aaa')).toBe('url:/proxy/aaa')
  })
})

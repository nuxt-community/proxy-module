const { Nuxt } = require('nuxt-edge')
const request = require('request-promise-native')

const config = require('./fixture/nuxt.config')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))

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

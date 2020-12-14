import { setupTest, url } from '@nuxt/test-utils'
import fetch from 'node-fetch'

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: 'fixture',
    server: true
  })

  test('object mode', async () => {
    expect(await fetch(url('/example')).then(r => r.text())).toMatch('Example Domain')
  })
})

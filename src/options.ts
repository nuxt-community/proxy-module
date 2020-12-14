import type { Filter, Options as HttpProxyOptions } from 'http-proxy-middleware'
export type { Options as HttpProxyOptions } from 'http-proxy-middleware'

export type ProxyContext = Filter | HttpProxyOptions
export type ProxyEntry = { context: ProxyContext, options: HttpProxyOptions }

export type ProxyOptionsObject = { [target: string]: HttpProxyOptions }
export type ProxyOptionsArray = Array<[ProxyContext, HttpProxyOptions?] | HttpProxyOptions | string>
export type NuxtProxyOptions = ProxyOptionsObject | ProxyOptionsArray

export function getProxyEntries (proxyOptions: NuxtProxyOptions, defaults: HttpProxyOptions): ProxyEntry[] {
  const applyDefaults = (opts?: HttpProxyOptions) => ({ ...defaults, ...opts }) as HttpProxyOptions
  const normalizeTarget = (input: string | HttpProxyOptions) =>
    (typeof input === 'object' ? input : { target: input }) as HttpProxyOptions

  const proxyEntries: ProxyEntry[] = []

  if (!proxyOptions) {
    return proxyEntries
  }

  // Object mode
  if (!Array.isArray(proxyOptions)) {
    for (const key in proxyOptions) {
      proxyEntries.push({
        context: key,
        options: applyDefaults(normalizeTarget(proxyOptions[key]))
      })
    }
    return proxyEntries
  }

  // Array mode
  for (const input of proxyOptions) {
    if (Array.isArray(input)) {
      proxyEntries.push({
        context: input[0],
        options: applyDefaults(normalizeTarget(input[1] as string))
      })
    } else {
      proxyEntries.push({
        context: input,
        options: applyDefaults()
      })
    }
  }
  return proxyEntries
}

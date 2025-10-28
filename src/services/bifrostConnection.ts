import { ApiPromise, WsProvider } from '@polkadot/api'
import { BIFROST_NETWORK } from '../utils/constants'

type ConnectionEvent =
  | { type: 'connecting'; endpoint: string }
  | { type: 'connected'; endpoint: string; api: ApiPromise }
  | { type: 'disconnected'; endpoint: string }
  | { type: 'error'; endpoint: string | null; error: Error }

export type ConnectionListener = (event: ConnectionEvent) => void

const RECONNECT_DELAY_MS = 1500

class BifrostConnectionManager {
  private static singleton: BifrostConnectionManager | null = null

  static getInstance(): BifrostConnectionManager {
    if (!BifrostConnectionManager.singleton) {
      BifrostConnectionManager.singleton = new BifrostConnectionManager()
    }
    return BifrostConnectionManager.singleton
  }

  private readonly endpoints: string[] = [...BIFROST_NETWORK.rpcUrls].filter(
    (endpoint, index, array) => array.indexOf(endpoint) === index
  )
  private listeners: Set<ConnectionListener> = new Set()
  private api: ApiPromise | null = null
  private provider: WsProvider | null = null
  private connectingPromise: Promise<ApiPromise> | null = null
  private reconnectTimeout: number | null = null
  private endpointIndex = 0

  private constructor() {}

  subscribe(listener: ConnectionListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async getApi(): Promise<ApiPromise> {
    if (this.api && this.api.isConnected) {
      return this.api
    }

    if (this.connectingPromise) {
      return this.connectingPromise
    }

    this.connectingPromise = this.tryEndpoints().finally(() => {
      this.connectingPromise = null
    })

    return this.connectingPromise
  }

  private notify(event: ConnectionEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch (error) {
        console.error('[BifrostConnectionManager] Listener error', error)
      }
    })
  }

  private async tryEndpoints(): Promise<ApiPromise> {
    const attempts: string[] = []

    for (let offset = 0; offset < this.endpoints.length; offset += 1) {
      const index = (this.endpointIndex + offset) % this.endpoints.length
      const endpoint = this.endpoints[index]
      attempts.push(endpoint)

      try {
        const api = await this.connectViaEndpoint(endpoint)
        this.endpointIndex = index
        return api
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        this.notify({ type: 'error', endpoint, error: err })
        await this.cleanup()
      }
    }

    const aggregated = new Error(`Unable to connect to Bifrost RPC endpoints: ${attempts.join(', ')}`)
    this.notify({ type: 'error', endpoint: null, error: aggregated })
    const lastTried = attempts[attempts.length - 1] || this.endpoints[this.endpointIndex] || ''
    this.scheduleReconnect(lastTried)
    throw aggregated
  }

  private async connectViaEndpoint(endpoint: string): Promise<ApiPromise> {
    this.notify({ type: 'connecting', endpoint })

    const provider = new WsProvider(endpoint, RECONNECT_DELAY_MS)

    const handleProviderError = (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error))
      this.notify({ type: 'error', endpoint, error: err })
      this.scheduleReconnect(endpoint)
    }

    const handleProviderDisconnected = () => {
      this.notify({ type: 'disconnected', endpoint })
      this.scheduleReconnect(endpoint)
    }

    provider.on('error', handleProviderError)
    provider.on('disconnected', handleProviderDisconnected)

    try {
      const api = await ApiPromise.create({
        provider,
        noInitWarn: true,
      })

      await api.isReadyOrError

      this.provider = provider
      this.api = api

      api.on('error', (error) => {
        const err = error instanceof Error ? error : new Error(String(error))
        this.notify({ type: 'error', endpoint, error: err })
      })

      this.notify({ type: 'connected', endpoint, api })
      return api
    } catch (error) {
      provider.disconnect().catch(() => {})
      throw error
    }
  }

  private scheduleReconnect(endpoint: string) {
    if (this.reconnectTimeout !== null) {
      return
    }

    const foundIndex = this.endpoints.indexOf(endpoint)
    if (foundIndex >= 0 && this.endpoints.length > 1) {
      this.endpointIndex = (foundIndex + 1) % this.endpoints.length
    }

    this.cleanup().catch(() => {})

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null
      this.tryReconnect(endpoint)
    }, RECONNECT_DELAY_MS)
  }

  private async tryReconnect(previousEndpoint: string) {
    try {
      const api = await this.tryEndpoints()
      // `tryEndpoints` already notifies listeners; nothing else required.
      return api
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.notify({ type: 'error', endpoint: previousEndpoint, error: err })
    }
  }

  private async cleanup() {
    if (this.api) {
      try {
        await this.api.disconnect()
      } catch (error) {
        console.warn('[BifrostConnectionManager] Failed to disconnect API', error)
      }
    }

    if (this.provider) {
      try {
        await this.provider.disconnect()
      } catch (error) {
        console.warn('[BifrostConnectionManager] Failed to disconnect provider', error)
      }
    }

    this.api = null
    this.provider = null
  }
}

export const bifrostConnectionManager = BifrostConnectionManager.getInstance()

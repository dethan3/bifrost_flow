import { useEffect } from 'react'
import { bifrostConnectionManager } from '../services/bifrostConnection'
import { useAppStore } from '../store'

export const useBifrost = () => {
  const api = useAppStore((state) => state.api)
  const isConnecting = useAppStore((state) => state.isApiConnecting)
  const isConnected = useAppStore((state) => state.isApiConnected)
  const error = useAppStore((state) => state.apiError)
  const endpoint = useAppStore((state) => state.apiEndpoint)

  const setApi = useAppStore((state) => state.setApi)
  const setIsApiConnecting = useAppStore((state) => state.setIsApiConnecting)
  const setIsApiConnected = useAppStore((state) => state.setIsApiConnected)
  const setApiError = useAppStore((state) => state.setApiError)
  const setApiEndpoint = useAppStore((state) => state.setApiEndpoint)

  useEffect(() => {
    const unsubscribe = bifrostConnectionManager.subscribe((event) => {
      switch (event.type) {
        case 'connecting': {
          setIsApiConnecting(true)
          setIsApiConnected(false)
          setApiEndpoint(event.endpoint)
          setApiError(null)
          setApi(null)
          break
        }
        case 'connected': {
          setApi(event.api)
          setIsApiConnected(true)
          setIsApiConnecting(false)
          setApiEndpoint(event.endpoint)
          setApiError(null)
          break
        }
        case 'disconnected': {
          setApi(null)
          setIsApiConnected(false)
          setIsApiConnecting(true)
          setApiEndpoint(event.endpoint)
          setApiError('Connection lost. Retrying...')
          break
        }
        case 'error': {
          setApi(null)
          setIsApiConnected(false)
          setIsApiConnecting(event.endpoint !== null)
          setApiEndpoint(event.endpoint)
          setApiError(event.error.message || 'Connection error')
          break
        }
        default:
          break
      }
    })

    bifrostConnectionManager
      .getApi()
      .catch((connectionError) => {
        const message = connectionError instanceof Error ? connectionError.message : String(connectionError)
        setApi(null)
        setIsApiConnected(false)
        setIsApiConnecting(false)
        setApiEndpoint(null)
        setApiError(message)
      })

    return () => {
      unsubscribe()
    }
  }, [setApi, setApiEndpoint, setApiError, setIsApiConnected, setIsApiConnecting])

  return {
    api,
    isConnecting,
    isConnected,
    endpoint,
    error,
  }
}

import { useCallback, useState } from 'react'
import type { DispatchError } from '@polkadot/types/interfaces'
import { useBifrost } from './useBifrost'
import { useWallet } from './useWallet'
import { useAppStore } from '../store'
import type { RedeemParams } from '../types'

const decodeDispatchError = (dispatchError: DispatchError, api: ReturnType<typeof useBifrost>['api']): string => {
  if (!dispatchError) {
    return 'Unknown error'
  }

  if (!api) {
    return dispatchError.toString()
  }

  if (dispatchError.isModule) {
    const metaError = api.registry.findMetaError(dispatchError.asModule)
    const { section, name, docs } = metaError
    const doc = docs.length ? `: ${docs.map((d) => d.toString()).join(' ')}` : ''
    return `${section}.${name}${doc}`
  }

  return dispatchError.toString()
}

export const useRedeem = () => {
  const { api, isConnected } = useBifrost()
  const { account, getSigner } = useWallet()
  const setTxStatus = useAppStore((state) => state.setTxStatus)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redeem = useCallback(async ({ amount, isInstant }: RedeemParams) => {
    if (!api || !isConnected || !api.isConnected) {
      const message = 'Bifrost network not connected'
      setError(message)
      throw new Error(message)
    }

    if (!account) {
      const message = 'Wallet not connected'
      setError(message)
      throw new Error(message)
    }

    setIsLoading(true)
    setError(null)
    setTxStatus({ status: 'pending', message: 'Awaiting signature…' })

    try {
      const signer = await getSigner(account.address)
      const tokenParam = { Token: 'DOT' }

      const vtokenMinting = (api.tx as unknown as {
        vtokenMinting?: {
          redeem?: (token: unknown, value: string) => { signAndSend: typeof api.tx.balances.transfer['signAndSend'] }
          redeemInstant?: (token: unknown, value: string) => { signAndSend: typeof api.tx.balances.transfer['signAndSend'] }
        }
      }).vtokenMinting

      const extrinsic = isInstant ? vtokenMinting?.redeemInstant?.(tokenParam, amount) : vtokenMinting?.redeem?.(tokenParam, amount)

      if (!extrinsic) {
        throw new Error('Redeem extrinsic not available on current network')
      }

      await new Promise<void>((resolve, reject) => {
        let unsubscribe: (() => void) | undefined

        const cleanup = () => {
          unsubscribe?.()
          setIsLoading(false)
        }

        extrinsic
          .signAndSend(account.address, { signer }, (result) => {
            const txHash = result.txHash?.toHex()

            if (result.dispatchError) {
              const decoded = decodeDispatchError(result.dispatchError, api)
              setTxStatus({ status: 'error', message: decoded, txHash })
              setError(decoded)
              cleanup()
              reject(new Error(decoded))
              return
            }

            if (result.status.isInBlock) {
              setTxStatus({ status: 'pending', message: 'Included in block…', txHash })
            }

            if (result.status.isFinalized) {
              setTxStatus({ status: 'success', message: 'Redeem transaction finalized', txHash })
              cleanup()
              resolve()
            }
          })
          .then((unsub) => {
            unsubscribe = unsub
          })
          .catch((signError) => {
            cleanup()
            reject(signError)
          })
      })
    } catch (transactionError) {
      const message =
        transactionError instanceof Error ? transactionError.message : 'Redeem transaction failed'
      setError(message)
      setTxStatus({ status: 'error', message })
      setIsLoading(false)
      throw transactionError instanceof Error ? transactionError : new Error(message)
    }
  }, [account, api, getSigner, isConnected, setTxStatus])

  return {
    redeem,
    isLoading,
    error,
  }
}

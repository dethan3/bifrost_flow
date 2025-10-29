import { useEffect, useCallback } from 'react'
import { useBifrost } from './useBifrost'
import { useAppStore } from '../store'
import type { UserBalances, TokenBalance } from '../types'

interface SystemAccountJson {
  data?: {
    free?: unknown
    reserved?: unknown
    frozen?: unknown
    miscFrozen?: unknown
  }
}

interface TokenAccountJson {
  free?: unknown
  reserved?: unknown
  frozen?: unknown
}

const toChainJson = <T>(value: unknown): T => {
  if (value && typeof (value as { toJSON?: () => unknown }).toJSON === 'function') {
    return (value as { toJSON: () => unknown }).toJSON() as T
  }
  return value as T
}

const createZeroBalance = (): TokenBalance => ({
  free: '0',
  reserved: '0',
  frozen: '0',
  total: '0',
})

const toStringSafe = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '0'
  }
  return value.toString()
}

const sumBalances = (free: string, reserved: string): string =>
  (BigInt(free) + BigInt(reserved)).toString()

export const useBalance = () => {
  const { api, isConnected } = useBifrost()
  const { account, balances, isLoadingBalances, setBalances, setIsLoadingBalances } = useAppStore()

  const fetchBalances = useCallback(async () => {
    if (!api || !account?.address || !isConnected) {
      setBalances(null)
      return
    }

    if (!api.isConnected) {
      setBalances(null)
      return
    }

    setIsLoadingBalances(true)

    try {
      // Fetch DOT balance (native token)
      const dotAccountInfo = await api.query.system.account(account.address)
      const dotJson = toChainJson<SystemAccountJson>(dotAccountInfo)
      const dotData = dotJson?.data ?? {}
      const dotFree = toStringSafe(dotData.free)
      const dotReserved = toStringSafe(dotData.reserved)
      const dotFrozen = toStringSafe(dotData.frozen ?? dotData.miscFrozen)

      const dotBalance: TokenBalance = {
        free: dotFree,
        reserved: dotReserved,
        frozen: dotFrozen,
        total: sumBalances(dotFree, dotReserved),
      }

      // Fetch vDOT balance (token ID for vDOT on Bifrost Polkadot)
      // vDOT token structure: { Token: 'DOT' } creates vToken
      let vdotBalance: TokenBalance = createZeroBalance()

      try {
        // Query vToken balance using the vToken module
        // The token ID for vDOT is typically { VToken: 'DOT' }
        const vdotTokenId = { VToken: 'DOT' }
        const vdotAccountInfo = await api.query.tokens.accounts(account.address, vdotTokenId)

        const vdotJson = toChainJson<TokenAccountJson>(vdotAccountInfo)

        if (vdotJson) {
          const vdotFree = toStringSafe(vdotJson.free)
          const vdotReserved = toStringSafe(vdotJson.reserved)
          const vdotFrozen = toStringSafe(vdotJson.frozen)

          vdotBalance = {
            free: vdotFree,
            reserved: vdotReserved,
            frozen: vdotFrozen,
            total: sumBalances(vdotFree, vdotReserved),
          }
        }
      } catch (vdotError) {
        console.warn('Failed to fetch vDOT balance, using default:', vdotError)
        // Keep default zero balance
      }

      const userBalances: UserBalances = {
        dot: dotBalance,
        vdot: vdotBalance,
      }

      setBalances(userBalances)
    } catch (error) {
      console.error('Error fetching balances:', error)
      setBalances(null)
    } finally {
      setIsLoadingBalances(false)
    }
  }, [api, account?.address, isConnected, setBalances, setIsLoadingBalances])

  // Fetch balances when account or API changes
  useEffect(() => {
    if (account && api && isConnected) {
      fetchBalances()
    } else {
      setBalances(null)
    }
  }, [account, api, isConnected, fetchBalances, setBalances])

  // Subscribe to balance changes
  useEffect(() => {
    if (!api || !account?.address || !isConnected || !api.isConnected) {
      return
    }

    let unsubscribeDot: (() => void) | undefined
    let unsubscribeVdot: (() => void) | undefined

    const subscribeToBalances = async () => {
      try {
        unsubscribeDot = (await api.query.system.account(account.address, (accountInfo: unknown) => {
          const dotJson = toChainJson<SystemAccountJson>(accountInfo)
          const dotData = dotJson?.data ?? {}
          const dotFree = toStringSafe(dotData.free)
          const dotReserved = toStringSafe(dotData.reserved)
          const dotFrozen = toStringSafe(dotData.frozen ?? dotData.miscFrozen)

          const dotBalance: TokenBalance = {
            free: dotFree,
            reserved: dotReserved,
            frozen: dotFrozen,
            total: sumBalances(dotFree, dotReserved),
          }

          const currentBalances = useAppStore.getState().balances

          setBalances({
            dot: dotBalance,
            vdot: currentBalances?.vdot ?? createZeroBalance(),
          })
        })) as unknown as () => void

        const vdotTokenId = { VToken: 'DOT' }
        unsubscribeVdot = (await api.query.tokens.accounts(
          account.address,
          vdotTokenId,
          (vdotAccountInfo: unknown) => {
            const vdotData = toChainJson<TokenAccountJson>(vdotAccountInfo)
            const vdotFree = toStringSafe(vdotData?.free)
            const vdotReserved = toStringSafe(vdotData?.reserved)
            const vdotFrozen = toStringSafe(vdotData?.frozen)

            const vdotBalance: TokenBalance = {
              free: vdotFree,
              reserved: vdotReserved,
              frozen: vdotFrozen,
              total: sumBalances(vdotFree, vdotReserved),
            }

            const currentBalances = useAppStore.getState().balances

            setBalances({
              dot: currentBalances?.dot ?? createZeroBalance(),
              vdot: vdotBalance,
            })
          }
        )) as unknown as () => void
      } catch (error) {
        console.error('Error subscribing to balances:', error)
      }
    }

    subscribeToBalances()

    return () => {
      unsubscribeDot?.()
      unsubscribeVdot?.()
    }
  }, [api, account?.address, isConnected, setBalances])

  return {
    balances,
    isLoading: isLoadingBalances,
    refetch: fetchBalances,
  }
}

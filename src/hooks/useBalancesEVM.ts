/**
 * useBalancesEVM Hook
 * Retrieves balances on EVM chains (native tokens and ERC20).
 */

import { useBalance, useReadContracts, useAccount, useChainId } from 'wagmi'
import { useCallback, useMemo } from 'react'
import type { Address } from 'viem'
import { erc20Abi } from '../config/abis'
import { getTokensByChainId } from '../config/contracts'

export function useBalancesEVM() {
  const { address } = useAccount()
  const chainId = useChainId()
  const tokens = useMemo(() => getTokensByChainId(chainId), [chainId])

  // Query native ETH balance
  const { 
    data: nativeBalance, 
    isLoading: isNativeBalanceLoading, 
    refetch: refetchNativeBalance 
  } = useBalance({
    address,
    query: {
      enabled: !!address,
      staleTime: 10_000, // Treat data as fresh for 10 seconds
    }
  })

  // Use useMemo to avoid recreating token references on each render
  const vethToken = useMemo(() => tokens.find(t => t.symbol === 'vETH'), [tokens])
  const dotToken = useMemo(() => tokens.find(t => t.symbol === 'DOT'), [tokens])
  const vdotToken = useMemo(() => tokens.find(t => t.symbol === 'vDOT'), [tokens])

  // Build the contract query array with useMemo to avoid regenerating it
  const contractQueries = useMemo(() => {
    const queries = []
    
    if (vethToken?.address) {
      queries.push({
        address: vethToken.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf' as const,
        args: address ? [address] : undefined,
      })
    }
    
    if (dotToken?.address) {
      queries.push({
        address: dotToken.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf' as const,
        args: address ? [address] : undefined,
      })
    }
    
    if (vdotToken?.address) {
      queries.push({
        address: vdotToken.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf' as const,
        args: address ? [address] : undefined,
      })
    }
    
    return queries
  }, [vethToken, dotToken, vdotToken, address])

  // Query ERC20 token balances
  const { 
    data: tokenBalances, 
    isLoading: isTokenBalancesLoading, 
    refetch: refetchTokenBalances 
  } = useReadContracts({
    contracts: contractQueries,
    query: {
      enabled: !!address && contractQueries.length > 0,
      staleTime: 10_000, // Treat data as fresh for 10 seconds
    }
  })

  // Extract balances in the same order as the contract queries
  let vethBalance = BigInt(0)
  let dotBalance = BigInt(0)
  let vdotBalance = BigInt(0)
  
  let resultIndex = 0
  if (vethToken?.address && tokenBalances?.[resultIndex]?.status === 'success') {
    vethBalance = tokenBalances[resultIndex].result as bigint
    resultIndex++
  } else if (vethToken?.address) {
    resultIndex++
  }
  
  if (dotToken?.address && tokenBalances?.[resultIndex]?.status === 'success') {
    dotBalance = tokenBalances[resultIndex].result as bigint
    resultIndex++
  } else if (dotToken?.address) {
    resultIndex++
  }
  
  if (vdotToken?.address && tokenBalances?.[resultIndex]?.status === 'success') {
    vdotBalance = tokenBalances[resultIndex].result as bigint
  }

  // Wrap refetchAll with useCallback to avoid infinite loops
  const refetchAll = useCallback(() => {
    refetchNativeBalance()
    refetchTokenBalances()
  }, [refetchNativeBalance, refetchTokenBalances])

  return {
    // Native ETH
    nativeBalance: nativeBalance?.value || BigInt(0),
    isNativeBalanceLoading,
    refetchNativeBalance,

    // ERC20 tokens
    dotBalance,
    vethBalance,
    vdotBalance,
    isTokenBalancesLoading,
    refetchTokenBalances,

    // Refresh all balances
    refetchAll,

    // Combined loading state
    isLoading: isNativeBalanceLoading || isTokenBalancesLoading,
  }
}

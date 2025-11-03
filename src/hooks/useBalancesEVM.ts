/**
 * useBalancesEVM Hook
 * 用于查询 EVM 链上的余额（原生代币和 ERC20）
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

  // 查询原生 ETH 余额
  const { 
    data: nativeBalance, 
    isLoading: isNativeBalanceLoading, 
    refetch: refetchNativeBalance 
  } = useBalance({
    address,
    query: {
      enabled: !!address,
      staleTime: 10_000, // 10 秒内认为数据是新鲜的
    }
  })

  // 使用 useMemo 查找代币，避免每次渲染都创建新对象引用
  const vethToken = useMemo(() => tokens.find(t => t.symbol === 'vETH'), [tokens])
  const dotToken = useMemo(() => tokens.find(t => t.symbol === 'DOT'), [tokens])
  const vdotToken = useMemo(() => tokens.find(t => t.symbol === 'vDOT'), [tokens])

  // 使用 useMemo 构建查询合约数组，避免每次渲染都重新创建
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

  // 查询 ERC20 代币余额
  const { 
    data: tokenBalances, 
    isLoading: isTokenBalancesLoading, 
    refetch: refetchTokenBalances 
  } = useReadContracts({
    contracts: contractQueries,
    query: {
      enabled: !!address && contractQueries.length > 0,
      staleTime: 10_000, // 10 秒内认为数据是新鲜的
    }
  })

  // 提取余额数据（根据实际查询的代币顺序）
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

  // 使用 useCallback 包装 refetchAll，避免无限循环
  const refetchAll = useCallback(() => {
    refetchNativeBalance()
    refetchTokenBalances()
  }, [refetchNativeBalance, refetchTokenBalances])

  return {
    // 原生 ETH
    nativeBalance: nativeBalance?.value || BigInt(0),
    isNativeBalanceLoading,
    refetchNativeBalance,

    // ERC20 代币
    dotBalance,
    vethBalance,
    vdotBalance,
    isTokenBalancesLoading,
    refetchTokenBalances,

    // 刷新所有余额
    refetchAll,

    // 是否正在加载
    isLoading: isNativeBalanceLoading || isTokenBalancesLoading,
  }
}

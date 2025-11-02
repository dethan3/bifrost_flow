/**
 * useBalancesEVM Hook
 * 用于查询 EVM 链上的余额（原生代币和 ERC20）
 */

import { useBalance, useReadContracts, useAccount, useChainId } from 'wagmi'
import type { Address } from 'viem'
import { erc20Abi } from '../config/abis'
import { getTokensByChainId } from '../config/contracts'

export function useBalancesEVM() {
  const { address } = useAccount()
  const chainId = useChainId()
  const tokens = getTokensByChainId(chainId)

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

  // 获取 ERC20 代币地址（只查询实际存在的代币）
  const vethToken = tokens.find(t => t.symbol === 'vETH')
  const dotToken = tokens.find(t => t.symbol === 'DOT')
  const vdotToken = tokens.find(t => t.symbol === 'vDOT')

  // 构建查询合约数组（只包含存在的代币）
  const contractQueries = []
  
  if (vethToken?.address) {
    contractQueries.push({
      address: vethToken.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: address ? [address] : undefined,
    })
  }
  
  if (dotToken?.address) {
    contractQueries.push({
      address: dotToken.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: address ? [address] : undefined,
    })
  }
  
  if (vdotToken?.address) {
    contractQueries.push({
      address: vdotToken.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: address ? [address] : undefined,
    })
  }

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

    // 刷新所有余额（简单实现，不使用 useCallback 避免复杂依赖）
    refetchAll: () => {
      refetchNativeBalance()
      refetchTokenBalances()
    },

    // 是否正在加载
    isLoading: isNativeBalanceLoading || isTokenBalancesLoading,
  }
}

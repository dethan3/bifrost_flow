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

  // 获取 ERC20 代币地址
  const dotToken = tokens.find(t => t.symbol === 'DOT')
  const vethToken = tokens.find(t => t.symbol === 'vETH')
  const vdotToken = tokens.find(t => t.symbol === 'vDOT')

  // 查询 ERC20 代币余额
  const { 
    data: tokenBalances, 
    isLoading: isTokenBalancesLoading, 
    refetch: refetchTokenBalances 
  } = useReadContracts({
    contracts: [
      {
        address: dotToken?.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: vethToken?.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: vdotToken?.address as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: !!address,
      staleTime: 10_000, // 10 秒内认为数据是新鲜的
    }
  })

  // 提取余额数据（安全地处理可能的 undefined）
  const dotBalance = (tokenBalances?.[0]?.status === 'success' ? tokenBalances[0].result as bigint : undefined) || BigInt(0)
  const vethBalance = (tokenBalances?.[1]?.status === 'success' ? tokenBalances[1].result as bigint : undefined) || BigInt(0)
  const vdotBalance = (tokenBalances?.[2]?.status === 'success' ? tokenBalances[2].result as bigint : undefined) || BigInt(0)

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
    refetchAll: async () => {
      try {
        await Promise.all([
          refetchNativeBalance(),
          refetchTokenBalances(),
        ])
      } catch (error) {
        console.error('Error refetching balances:', error)
      }
    },

    // 是否正在加载
    isLoading: isNativeBalanceLoading || isTokenBalancesLoading,
  }
}

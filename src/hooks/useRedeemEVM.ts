/**
 * useRedeemEVM Hook
 * 用于在 EVM 链上 redeem vTokens
 */

import { useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract, useAccount } from 'wagmi'
import { parseEther, type Address, maxUint256 } from 'viem'
import { erc20Abi } from '../config/abis'
import { l2SlpxAbi } from '../config/abis'
import { getL2SlpxAddress, getTokensByChainId } from '../config/contracts'

export interface RedeemEVMParams {
  amount: string // 以 vETH/vDOT 为单位的字符串
  asset: 'eth' | 'dot' // 选择 redeem vETH 或 vDOT
}

export function useRedeemEVM() {
  const chainId = useChainId()
  const { address: userAddress } = useAccount()
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  
  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 获取 L2Slpx 合约地址
  const l2SlpxAddress = getL2SlpxAddress(chainId)
  
  // 获取 vToken 地址
  const tokens = getTokensByChainId(chainId)
  const vethToken = tokens.find(t => t.symbol === 'vETH')
  const vdotToken = tokens.find(t => t.symbol === 'vDOT')

  // 查询 vETH 授权额度
  const { data: vethAllowance, refetch: refetchVethAllowance } = useReadContract({
    address: vethToken?.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress ? [userAddress, l2SlpxAddress] : undefined,
    query: {
      enabled: !!(userAddress && vethToken?.address),
      staleTime: 30_000, // 30 秒缓存，减少查询频率
    }
  })

  // 查询 vDOT 授权额度
  const { data: vdotAllowance, refetch: refetchVdotAllowance } = useReadContract({
    address: vdotToken?.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress ? [userAddress, l2SlpxAddress] : undefined,
    query: {
      enabled: !!(userAddress && vdotToken?.address),
      staleTime: 30_000, // 30 秒缓存
    }
  })

  const redeem = async ({ amount, asset }: RedeemEVMParams) => {
    try {
      const amountWei = parseEther(amount)
      const vTokenAddress = asset === 'eth' ? vethToken?.address : vdotToken?.address
      const currentAllowance = asset === 'eth' ? vethAllowance : vdotAllowance

      if (!vTokenAddress) {
        throw new Error(`vToken address not found for ${asset}`)
      }

      // 如果授权不足，先进行授权
      if (!currentAllowance || currentAllowance < amountWei) {
        console.log('Approving vToken...')
        writeContract({
          address: vTokenAddress as Address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [l2SlpxAddress, maxUint256],
        })
        return
      }

      // 执行 redeem
      console.log('Redeeming...')
      writeContract({
        address: l2SlpxAddress,
        abi: l2SlpxAbi,
        functionName: 'createOrder',
        args: [
          vTokenAddress as Address,
          amountWei,
          1, // Operation.Redeem
          'bifrost',
        ],
      })
    } catch (err) {
      console.error('Redeem error:', err)
      throw err
    }
  }

  return {
    redeem,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
    vethAllowance,
    vdotAllowance,
    refetchVethAllowance,
    refetchVdotAllowance,
    needsApproval: (amount: string, asset: 'eth' | 'dot') => {
      // 安全地处理空字符串或无效输入
      if (!amount || amount === '0' || isNaN(Number(amount))) {
        return false
      }
      
      try {
        const amountWei = parseEther(amount)
        const currentAllowance = asset === 'eth' ? vethAllowance : vdotAllowance
        return !currentAllowance || currentAllowance < amountWei
      } catch (error) {
        console.error('Error parsing amount:', error)
        return false
      }
    },
  }
}

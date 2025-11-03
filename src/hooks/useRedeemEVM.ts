import { useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract, useAccount } from 'wagmi'
import { useCallback } from 'react'
import { parseEther, type Address, maxUint256 } from 'viem'
import { erc20Abi } from '../config/abis'
import { l2SlpxAbi } from '../config/abis'
import { getL2SlpxAddress, getTokensByChainId } from '../config/contracts'

export interface RedeemEVMParams {
  amount: string // Amount represented as vETH/vDOT
  asset: 'eth' | 'dot' // Indicates whether to redeem vETH or vDOT
}

export function useRedeemEVM() {
  const chainId = useChainId()
  const { address: userAddress } = useAccount()
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  
  // Wait for the transaction to be confirmed
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Resolve the L2Slpx contract address
  const l2SlpxAddress = getL2SlpxAddress(chainId)
  
  // Resolve vToken addresses
  const tokens = getTokensByChainId(chainId)
  const vethToken = tokens.find(t => t.symbol === 'vETH')
  const vdotToken = tokens.find(t => t.symbol === 'vDOT')

  // Query vETH allowance
  const { data: vethAllowance, refetch: refetchVethAllowance } = useReadContract({
    address: vethToken?.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress ? [userAddress, l2SlpxAddress] : undefined,
    query: {
      enabled: !!(userAddress && vethToken?.address),
      staleTime: 30_000, // Cache for 30 seconds to reduce polling
    }
  })

  // Query vDOT allowance
  const { data: vdotAllowance, refetch: refetchVdotAllowance } = useReadContract({
    address: vdotToken?.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress ? [userAddress, l2SlpxAddress] : undefined,
    query: {
      enabled: !!(userAddress && vdotToken?.address),
      staleTime: 30_000, // 30-second cache
    }
  })

  const redeem = useCallback(async ({ amount, asset }: RedeemEVMParams) => {
    try {
      const amountWei = parseEther(amount)
      const vTokenAddress = asset === 'eth' ? vethToken?.address : vdotToken?.address
      const currentAllowance = asset === 'eth' ? vethAllowance : vdotAllowance

      if (!vTokenAddress) {
        throw new Error(`vToken address not found for ${asset}`)
      }

      // Request approval first if allowance is insufficient
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

      // Execute the redeem
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
  }, [vethToken?.address, vdotToken?.address, vethAllowance, vdotAllowance, writeContract, l2SlpxAddress])

  const needsApproval = useCallback((amount: string, asset: 'eth' | 'dot') => {
    // Safely handle empty strings or invalid input
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
  }, [vethAllowance, vdotAllowance])

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
    needsApproval,
  }
}

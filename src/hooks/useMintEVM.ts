/**
 * useMintEVM Hook
 * 用于在 EVM 链上 mint vTokens
 */

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { getTestnetMintParams } from 'slpx-sdk'
import type { ValidTestnetChainInput } from 'slpx-sdk'

export interface MintEVMParams {
  amount: string // 以 ETH/DOT 为单位的字符串，如 "1.5"
  asset: 'eth' | 'dot' // 选择 mint vETH 或 vDOT
}

export function useMintEVM() {
  const chainId = useChainId()
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  
  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = async ({ amount, asset }: MintEVMParams) => {
    try {
      // 使用 slpx-sdk 生成交易参数
      const params = getTestnetMintParams(
        asset,
        chainId as ValidTestnetChainInput,
        amount,
        'bifrost' // remark
      )

      // 调用合约
      writeContract(params)
    } catch (err) {
      console.error('Mint error:', err)
      throw err
    }
  }

  return {
    mint,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    isLoading: isPending || isConfirming,
  }
}

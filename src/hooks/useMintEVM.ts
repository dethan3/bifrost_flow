import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { useCallback } from 'react'
import { getTestnetMintParams } from 'slpx-sdk'
import type { ValidTestnetChainInput } from 'slpx-sdk'

export interface MintEVMParams {
  amount: string // Amount as an ETH/DOT-denominated string, e.g. "1.5"
  asset: 'eth' | 'dot' // Indicates whether to mint vETH or vDOT
}

export function useMintEVM() {
  const chainId = useChainId()
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  
  // Wait for the transaction to be confirmed
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const mint = useCallback(async ({ amount, asset }: MintEVMParams) => {
    try {
      // Generate contract params with slpx-sdk
      const params = getTestnetMintParams(
        asset,
        chainId as ValidTestnetChainInput,
        amount,
        'bifrost' // remark
      )

      // Invoke the contract call
      writeContract(params)
    } catch (err) {
      console.error('Mint error:', err)
      throw err
    }
  }, [chainId, writeContract])

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

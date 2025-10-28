// Core Type Definitions

export interface WalletAccount {
  address: string
  name?: string
  source?: string
}

export interface TokenBalance {
  free: string
  reserved: string
  frozen: string
  total: string
}

export interface UserBalances {
  dot: TokenBalance
  vdot: TokenBalance
}

export interface MintParams {
  amount: string
  tokenSymbol: 'DOT'
}

export interface RedeemParams {
  amount: string
  isInstant: boolean
}

export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'error'
  message?: string
  txHash?: string
}

export type RedeemType = 'instant' | 'standard'

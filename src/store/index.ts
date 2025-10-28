import { create } from 'zustand'
import type { ApiPromise } from '@polkadot/api'
import type { WalletAccount, UserBalances, TransactionStatus } from '../types'

interface AppState {
  // Wallet State
  account: WalletAccount | null
  isConnecting: boolean
  
  // Bifrost API State
  api: ApiPromise | null
  isApiConnecting: boolean
  isApiConnected: boolean
  apiError: string | null
  apiEndpoint: string | null
  
  // Balance State
  balances: UserBalances | null
  isLoadingBalances: boolean
  
  // Transaction State
  txStatus: TransactionStatus
  
  // Actions
  setAccount: (account: WalletAccount | null) => void
  setIsConnecting: (isConnecting: boolean) => void
  setBalances: (balances: UserBalances | null) => void
  setIsLoadingBalances: (isLoading: boolean) => void
  setTxStatus: (status: TransactionStatus) => void
  resetTxStatus: () => void
  setApi: (api: ApiPromise | null) => void
  setIsApiConnecting: (isConnecting: boolean) => void
  setIsApiConnected: (isConnected: boolean) => void
  setApiError: (error: string | null) => void
  setApiEndpoint: (endpoint: string | null) => void
}

const initialTxStatus: TransactionStatus = {
  status: 'idle',
  message: undefined,
  txHash: undefined,
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State - Wallet
  account: null,
  isConnecting: false,
  
  // Initial State - Bifrost API
  api: null,
  isApiConnecting: false,
  isApiConnected: false,
  apiError: null,
  apiEndpoint: null,
  
  // Initial State - Balances
  balances: null,
  isLoadingBalances: false,
  
  // Initial State - Transaction
  txStatus: initialTxStatus,
  
  // Actions
  setAccount: (account) => set({ account }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setBalances: (balances) => set({ balances }),
  setIsLoadingBalances: (isLoading) => set({ isLoadingBalances: isLoading }),
  setTxStatus: (status) => set({ txStatus: status }),
  resetTxStatus: () => set({ txStatus: initialTxStatus }),
  setApi: (api) => set({ api }),
  setIsApiConnecting: (isConnecting) => set({ isApiConnecting: isConnecting }),
  setIsApiConnected: (isConnected) => set({ isApiConnected: isConnected }),
  setApiError: (error) => set({ apiError: error }),
  setApiEndpoint: (endpoint) => set({ apiEndpoint: endpoint }),
}))

import { useState, useEffect, useCallback } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { useAppStore } from '../store'
import type { WalletAccount } from '../types'

type ExtensionAccount = Awaited<ReturnType<typeof web3Accounts>>[number]

export const useWallet = () => {
  const { account, setAccount, isConnecting, setIsConnecting } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const [availableAccounts, setAvailableAccounts] = useState<ExtensionAccount[]>([])

  // Check for available extensions on mount
  useEffect(() => {
    checkExtensions()
  }, [])

  const checkExtensions = async () => {
    try {
      const extensions = await web3Enable('Bifrost Flow')
      if (extensions.length === 0) {
        setError('No Polkadot extension found. Please install Polkadot.js extension.')
        return false
      }
      return true
    } catch (err) {
      setError('Failed to connect to wallet extension')
      return false
    }
  }

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Enable web3
      const extensions = await web3Enable('Bifrost Flow')
      
      if (extensions.length === 0) {
        setError('No Polkadot extension found')
        setIsConnecting(false)
        return
      }

      // Get all accounts
      const accounts = await web3Accounts()
      
      if (accounts.length === 0) {
        setError('No accounts found in extension')
        setIsConnecting(false)
        return
      }

      setAvailableAccounts(accounts)
      
      // Auto-select first account
      const selectedAccount = accounts[0]
      const walletAccount: WalletAccount = {
        address: selectedAccount.address,
        name: selectedAccount.meta.name,
        source: selectedAccount.meta.source,
      }
      
      setAccount(walletAccount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [setAccount, setIsConnecting])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setAvailableAccounts([])
    setError(null)
  }, [setAccount])

  const switchAccount = useCallback((address: string) => {
    const selectedAccount = availableAccounts.find(acc => acc.address === address)
    if (selectedAccount) {
      const walletAccount: WalletAccount = {
        address: selectedAccount.address,
        name: selectedAccount.meta.name,
        source: selectedAccount.meta.source,
      }
      setAccount(walletAccount)
    }
  }, [availableAccounts, setAccount])

  const getSigner = useCallback(async (address: string) => {
    try {
      const injector = await web3FromAddress(address)
      return injector.signer
    } catch (err) {
      throw new Error('Failed to get signer from wallet')
    }
  }, [])

  return {
    account,
    availableAccounts,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchAccount,
    getSigner,
  }
}

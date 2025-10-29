import { useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { formatSubstrateAddress, formatAddress, UI_MESSAGES } from '../utils'

export const ConnectWalletButton = () => {
  const {
    account,
    availableAccounts,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchAccount,
  } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!account) {
      setIsMenuOpen(false)
    }
  }, [account])

  const buttonLabel = useMemo(() => {
    if (account) {
      if (account.name) return account.name
      return formatSubstrateAddress(account.address)
    }

    return isConnecting ? UI_MESSAGES.CONNECTING : UI_MESSAGES.CONNECT_WALLET
  }, [account, isConnecting])

  const subtitle = useMemo(() => {
    if (!account) return 'Polkadot.js Extension'
    return formatSubstrateAddress(account.address)
  }, [account])

  const otherAccounts = useMemo(
    () => availableAccounts.filter((item) => item.address !== account?.address),
    [availableAccounts, account?.address]
  )

  const toggleMenu = () => {
    if (!account) {
      void connectWallet()
      return
    }

    setIsMenuOpen((prev) => !prev)
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsMenuOpen(false)
  }

  const handleSwitchAccount = (address: string) => {
    switchAccount(address)
    setIsMenuOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleMenu}
        disabled={isConnecting}
        className="group flex items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-fuchsia-500/80 via-purple-500/80 to-indigo-500/80 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_-15px_rgba(139,92,246,0.8)] backdrop-blur transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-15px_rgba(236,72,153,0.9)] focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
          {account ? (
            <span className="text-sm font-semibold text-white">
              {formatAddress(account.address, 2, 2).toUpperCase()}
            </span>
          ) : (
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white/80" />
          )}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/20 opacity-0 transition group-hover:opacity-100" />
        </span>
        <span className="flex flex-col text-left">
          <span className="text-[0.95rem] leading-tight">{buttonLabel}</span>
          <span className="text-[0.65rem] font-normal text-white/70">
            {subtitle}
          </span>
        </span>
      </button>

      {error && (
        <div className="absolute -bottom-14 left-0 z-10 w-64 rounded-2xl border border-rose-500/40 bg-rose-500/25 px-4 py-2 text-xs text-rose-100 shadow-[0_10px_30px_rgba(244,63,94,0.35)]">
          {error}
        </div>
      )}

      {account && isMenuOpen && (
        <div className="absolute right-0 top-14 z-20 w-72 origin-top-right rounded-3xl border border-white/15 bg-slate-950/90 p-4 text-xs text-purple-50 shadow-[0_18px_50px_rgba(79,70,229,0.4)] backdrop-blur-xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{account.name ?? 'Active Account'}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-purple-200">
                {formatSubstrateAddress(account.address)}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Connected
            </span>
          </div>

          {otherAccounts.length > 0 && (
            <div className="mb-3 space-y-2">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-purple-300/70">
                Switch Account
              </p>
              <div className="space-y-1.5">
                {otherAccounts.map((wallet) => (
                  <button
                    key={wallet.address}
                    type="button"
                    onClick={() => handleSwitchAccount(wallet.address)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-[0.75rem] font-medium text-white/90 transition hover:border-purple-400/40 hover:bg-purple-500/10"
                  >
                    <span className="block text-[0.7rem] text-white/80">{wallet.meta.name ?? 'Polkadot Wallet'}</span>
                    <span className="font-mono text-[0.65rem] text-purple-200">
                      {formatSubstrateAddress(wallet.address)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleDisconnect}
            className="flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-[0.75rem] font-semibold text-white transition hover:border-rose-400/50 hover:bg-rose-500/20"
          >
            {UI_MESSAGES.DISCONNECT}
          </button>
        </div>
      )}
    </div>
  )
}

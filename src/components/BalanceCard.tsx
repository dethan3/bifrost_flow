/**
 * EVM 版本的 BalanceCard
 * 使用 useBalancesEVM
 */

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBalancesEVM } from '../hooks/useBalancesEVM'
import { UI_MESSAGES } from '../utils'

const BalanceRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${accent ? 'text-white font-semibold' : 'text-white/70'}`}>{label}</span>
    <span className={`font-mono text-sm ${accent ? 'text-white' : 'text-purple-100/90'}`}>{value}</span>
  </div>
)

export const BalanceCard = () => {
  const { address: account } = useAccount()
  const { nativeBalance, vethBalance, isLoading, refetchAll } = useBalancesEVM()

  // 格式化 ETH 余额
  const ethDisplay = useMemo(() => {
    const formatted = formatEther(nativeBalance)
    return Number(formatted).toFixed(4)
  }, [nativeBalance])

  // 格式化 vETH 余额
  const vethDisplay = useMemo(() => {
    const formatted = formatEther(vethBalance)
    return Number(formatted).toFixed(4)
  }, [vethBalance])

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_35px_80px_-50px_rgba(59,130,246,0.65)] transition hover:border-white/20 hover:shadow-[0_45px_90px_-55px_rgba(139,92,246,0.75)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
      <div className="relative flex flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Balance</h2>
            <p className="text-sm text-purple-100/80">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect your EVM wallet to view balances'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void refetchAll()
            }}
            disabled={isLoading || !account}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white/80 transition hover:border-white/30 hover:bg-white/20 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/40 sm:w-auto sm:justify-start sm:py-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v6h6m9-3c0-1.091-.312-2.138-.896-3.038a6.75 6.75 0 00-2.206-2.112A6.75 6.75 0 0012 1.5a6.75 6.75 0 00-6.75 6.75m0 9c0 1.091.312 2.138.896 3.038a6.75 6.75 0 002.206 2.112 6.75 6.75 0 003.648 1.1 6.75 6.75 0 006.75-6.75" />
            </svg>
            Refresh
          </button>
        </header>

        {!account ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-purple-100/80">
            <p className="font-medium text-white">Wallet not connected</p>
            <p className="mt-1 text-sm text-purple-100/70">
              {UI_MESSAGES.CONNECT_WALLET} to load your ETH and vETH balances.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-sky-500/25 p-5 shadow-[0_20px_45px_-35px_rgba(129,140,248,0.8)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Available ETH</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{ethDisplay}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-semibold text-white">
                  ETH
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <BalanceRow label="Native Token" value="Ethereum" />
                <BalanceRow label="Network" value="Arbitrum/Base Sepolia" accent />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/30 via-pink-500/25 to-rose-500/25 p-5 shadow-[0_20px_45px_-35px_rgba(236,72,153,0.8)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Staked vETH</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{vethDisplay}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xs font-semibold text-white">
                  vETH
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <BalanceRow label="Liquid Staking Token" value="Voucher ETH" />
                <BalanceRow label="Exchange Rate" value="~1:1" accent />
              </div>
            </div>
          </div>
        )}

        {isLoading && account && (
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Updating balances...</p>
        )}
      </div>
    </section>
  )
}

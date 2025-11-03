import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBalancesEVM } from '../hooks/useBalancesEVM'

const MOCK_APY = 12.5 // TODO: Fetch from Bifrost API

export const BalanceCard = () => {
  const { address: account } = useAccount()
  const { nativeBalance, vethBalance, isLoading, refetchAll } = useBalancesEVM()

  // Format the native ETH balance
  const ethDisplay = useMemo(() => {
    const formatted = formatEther(nativeBalance)
    return Number(formatted).toFixed(4)
  }, [nativeBalance])

  // Format the vETH balance
  const vethDisplay = useMemo(() => {
    const formatted = formatEther(vethBalance)
    return Number(formatted).toFixed(4)
  }, [vethBalance])

  // Estimate rewards with a 30-day holding assumption
  const estimatedRewards = useMemo(() => {
    const vethAmount = Number(formatEther(vethBalance))
    const dailyRate = MOCK_APY / 100 / 365
    const estimatedDays = 30 // Assume a 30-day holding period
    return (vethAmount * dailyRate * estimatedDays).toFixed(4)
  }, [vethBalance])

  // Total USD value (assuming ETH = $2000)
  const totalValueUSD = useMemo(() => {
    const ethAmount = Number(ethDisplay)
    const vethAmount = Number(vethDisplay)
    const ETH_PRICE = 2000 // Mock price
    return ((ethAmount + vethAmount) * ETH_PRICE).toFixed(2)
  }, [ethDisplay, vethDisplay])

  if (!account) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="text-center">
          <p className="font-medium text-white">Connect your wallet</p>
          <p className="mt-1 text-sm text-purple-100/70">
            View your portfolio balance and staking rewards
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),_transparent_55%)]" />
      
      <div className="relative space-y-5">
        {/* Header: portfolio totals */}
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">Portfolio Overview</h2>
            <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">${totalValueUSD}</p>
            <p className="text-xs text-purple-200/70">Total Value (USD)</p>
          </div>
          <button
            type="button"
            onClick={() => void refetchAll()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white/80 transition hover:border-white/30 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Three circular cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* ETH card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 border border-indigo-400/30">
              <span className="text-xl">💎</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-white/70">ETH</p>
            <p className="mt-1 text-lg font-bold text-white sm:text-xl">{ethDisplay}</p>
            <p className="mt-1 text-[0.65rem] text-purple-200/60">≈ ${(Number(ethDisplay) * 2000).toFixed(2)}</p>
          </div>

          {/* vETH card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500/30 border border-fuchsia-400/30">
              <span className="text-xl">🔮</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-white/70">vETH</p>
            <p className="mt-1 text-lg font-bold text-white sm:text-xl">{vethDisplay}</p>
            <p className="mt-1 text-[0.65rem] text-purple-200/60">≈ ${(Number(vethDisplay) * 2000).toFixed(2)}</p>
          </div>

          {/* Rewards card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/30 border border-emerald-400/30">
              <span className="text-xl">💰</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-white/70">Rewards</p>
            <p className="mt-1 text-lg font-bold text-emerald-400 sm:text-xl">{estimatedRewards}</p>
            <p className="mt-1 text-[0.65rem] text-emerald-300/60">~{MOCK_APY}% APY</p>
          </div>
        </div>

        {isLoading && (
          <p className="text-center text-xs uppercase tracking-[0.35em] text-white/40">Updating...</p>
        )}
      </div>
    </section>
  )
}

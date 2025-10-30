import { useMemo } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useBalance } from '../hooks/useBalance'
import { formatBalance, formatSubstrateAddress, UI_MESSAGES, TOKEN_DECIMALS } from '../utils'

const BalanceRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`text-sm ${accent ? 'text-white font-semibold' : 'text-white/70'}`}>{label}</span>
    <span className={`font-mono text-sm ${accent ? 'text-white' : 'text-purple-100/90'}`}>{value}</span>
  </div>
)

export const BalanceCard = () => {
  const { account } = useWallet()
  const { balances, isLoading, refetch } = useBalance()

  const dotBalance = balances?.dot
  const vdotBalance = balances?.vdot

  const dotAvailable = useMemo(
    () => formatBalance(dotBalance?.free ?? '0', TOKEN_DECIMALS.DOT, 4),
    [dotBalance?.free]
  )
  const vdotAvailable = useMemo(
    () => formatBalance(vdotBalance?.free ?? '0', TOKEN_DECIMALS.VDOT, 4),
    [vdotBalance?.free]
  )

  const dotReserved = useMemo(
    () => formatBalance(dotBalance?.reserved ?? '0', TOKEN_DECIMALS.DOT, 4),
    [dotBalance?.reserved]
  )
  const vdotReserved = useMemo(
    () => formatBalance(vdotBalance?.reserved ?? '0', TOKEN_DECIMALS.VDOT, 4),
    [vdotBalance?.reserved]
  )

  const dotTotal = useMemo(
    () => formatBalance(dotBalance?.total ?? '0', TOKEN_DECIMALS.DOT, 4),
    [dotBalance?.total]
  )
  const vdotTotal = useMemo(
    () => formatBalance(vdotBalance?.total ?? '0', TOKEN_DECIMALS.VDOT, 4),
    [vdotBalance?.total]
  )

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_35px_80px_-50px_rgba(59,130,246,0.65)] transition hover:border-white/20 hover:shadow-[0_45px_90px_-55px_rgba(139,92,246,0.75)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_55%)]" />
      <div className="relative flex flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Balance</h2>
            <p className="text-sm text-purple-100/80">
              {account ? formatSubstrateAddress(account.address) : 'Connect your Polkadot wallet to view balances'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void refetch()
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
              {UI_MESSAGES.CONNECT_WALLET} to load your DOT and vDOT balances.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-sky-500/25 p-5 shadow-[0_20px_45px_-35px_rgba(129,140,248,0.8)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Available DOT</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{dotAvailable}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                  DOT
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <BalanceRow label="Reserved" value={`${dotReserved} DOT`} />
                <BalanceRow label="Total" value={`${dotTotal} DOT`} accent />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/30 via-pink-500/25 to-rose-500/25 p-5 shadow-[0_20px_45px_-35px_rgba(236,72,153,0.8)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Staked vDOT</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{vdotAvailable}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                  vDOT
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <BalanceRow label="Reserved" value={`${vdotReserved} vDOT`} />
                <BalanceRow label="Total" value={`${vdotTotal} vDOT`} accent />
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

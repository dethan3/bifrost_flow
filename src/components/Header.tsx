import { ConnectWalletButton } from './ConnectWalletButton'
import { useAccount } from 'wagmi'

export const Header = () => {
  const { isConnected } = useAccount()

  return (
    <header className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_25px_60px_-35px_rgba(76,29,149,0.8)] backdrop-blur-2xl sm:px-6 sm:py-5">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-lg font-black text-white shadow-[0_20px_40px_rgba(168,85,247,0.4)] sm:h-14 sm:w-14 sm:text-xl">
            BF
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white sm:text-3xl">Bifrost Flow</h1>
            <p className="text-sm font-medium text-purple-200/90 sm:text-base">
              Liquid staking gateway for the omnichain world
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end">
          {isConnected && (
            <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs text-purple-100 shadow-inner sm:w-auto sm:py-1.5">
              <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full shadow-[0_0_10px] bg-emerald-400 shadow-emerald-500/40" />
              <span className="font-semibold uppercase tracking-[0.25em] text-[0.6rem]">
                EVM Connected
              </span>
            </div>
          )}
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}

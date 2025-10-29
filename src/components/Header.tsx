import { useMemo } from 'react'
import { ConnectWalletButton } from './ConnectWalletButton'
import { useBifrost } from '../hooks/useBifrost'

const getEndpointLabel = (endpoint: string | null): string | null => {
  if (!endpoint) return null

  try {
    const url = new URL(endpoint)
    return url.host
  } catch (error) {
    console.warn('Failed to parse endpoint URL', error)
    return endpoint
  }
}

export const Header = () => {
  const { isConnected, isConnecting, endpoint, error } = useBifrost()

  const networkStatus = useMemo(() => {
    if (isConnected) {
      return {
        label: 'Live on Bifrost',
        className: 'bg-emerald-400 shadow-emerald-500/40',
      }
    }

    if (isConnecting) {
      return {
        label: 'Syncing...',
        className: 'bg-amber-400 shadow-amber-500/40 animate-pulse',
      }
    }

    return {
      label: 'Offline',
      className: 'bg-rose-500 shadow-rose-500/40',
    }
  }, [isConnected, isConnecting])

  const endpointLabel = useMemo(() => getEndpointLabel(endpoint), [endpoint])

  return (
    <header className="w-full rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_25px_60px_-35px_rgba(76,29,149,0.8)] backdrop-blur-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-xl font-black text-white shadow-[0_20px_40px_rgba(168,85,247,0.4)]">
            BF
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Bifrost Flow</h1>
            <p className="text-sm font-medium text-purple-200/90 sm:text-base">
              Liquid staking gateway for the omnichain world
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-purple-100 shadow-inner">
            <span
              className={`inline-flex h-2.5 w-2.5 items-center justify-center rounded-full shadow-[0_0_10px] ${networkStatus.className}`}
            />
            <span className="font-semibold uppercase tracking-[0.25em] text-[0.6rem]">
              {networkStatus.label}
            </span>
            {endpointLabel && (
              <span className="hidden text-[0.65rem] text-white/60 sm:inline">{endpointLabel}</span>
            )}
          </div>
          <ConnectWalletButton />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
          {error}
        </div>
      )}
    </header>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../store'
import { UI_MESSAGES, formatAddress } from '../utils'

const statusMap = {
  pending: {
    label: 'Transaction Pending',
    defaultMessage: UI_MESSAGES.PROCESSING,
    gradient: 'from-sky-500/60 via-indigo-500/60 to-purple-500/60',
    border: 'border-sky-400/30',
    iconBg: 'bg-sky-500/20',
  },
  success: {
    label: 'Transaction Confirmed',
    defaultMessage: UI_MESSAGES.SUCCESS,
    gradient: 'from-emerald-500/60 via-teal-500/60 to-cyan-500/60',
    border: 'border-emerald-400/30',
    iconBg: 'bg-emerald-500/25',
  },
  error: {
    label: 'Transaction Failed',
    defaultMessage: UI_MESSAGES.FAILED,
    gradient: 'from-rose-500/60 via-amber-500/60 to-red-500/60',
    border: 'border-rose-400/30',
    iconBg: 'bg-rose-500/20',
  },
} as const

const PendingIcon = () => (
  <span className="relative flex h-5 w-5 items-center justify-center">
    <span className="absolute h-full w-full animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
    <span className="relative h-2 w-2 rounded-full bg-white" />
  </span>
)

const SuccessIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-5 w-5 text-emerald-50"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75L9 17.25L19.5 6.75" />
  </svg>
)

const ErrorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-5 w-5 text-rose-50"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export const TransactionToast = () => {
  const txStatus = useAppStore((state) => state.txStatus)
  const resetTxStatus = useAppStore((state) => state.resetTxStatus)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (txStatus.status === 'idle') {
      setVisible(false)
      return
    }

    setVisible(true)

    if (txStatus.status === 'pending') {
      return
    }

    const timeout = window.setTimeout(() => {
      setVisible(false)
      resetTxStatus()
    }, 5200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [txStatus, resetTxStatus])

  const config = useMemo(() => {
    if (txStatus.status === 'idle') return null
    return statusMap[txStatus.status]
  }, [txStatus.status])

  if (!config && !visible) {
    return null
  }

  const message = txStatus.message ?? config?.defaultMessage ?? UI_MESSAGES.PROCESSING

  const handleDismiss = () => {
    setVisible(false)
    resetTxStatus()
  }

  const toastIcon = (() => {
    switch (txStatus.status) {
      case 'success':
        return <SuccessIcon />
      case 'error':
        return <ErrorIcon />
      default:
        return <PendingIcon />
    }
  })()

  return (
    <div
      className={`pointer-events-auto fixed bottom-4 left-4 right-4 z-[60] transition-all duration-300 ease-out sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-3xl border sm:w-80 ${
          config?.border ?? 'border-white/20'
        } bg-slate-950/90 px-5 py-4 shadow-[0_25px_60px_-25px_rgba(14,116,144,0.6)] backdrop-blur-2xl`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${config?.gradient ?? 'from-indigo-500/40 to-purple-500/40'} opacity-25`} />
        <div className="relative flex items-start gap-4">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 ${
              config?.iconBg ?? 'bg-indigo-500/20'
            }`}
          >
            {toastIcon}
          </span>
          <div className="flex-1 text-sm text-white">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
              {config?.label ?? 'Transaction'}
            </p>
            <p className="mt-1 text-[0.95rem] font-semibold leading-tight text-white">
              {message}
            </p>
            {txStatus.txHash && (
              <p className="mt-2 font-mono text-[0.7rem] text-purple-200/90">
                Hash: {formatAddress(txStatus.txHash, 10, 8)}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={handleDismiss}
            className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 transition hover:border-white/20 hover:bg-white/15 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

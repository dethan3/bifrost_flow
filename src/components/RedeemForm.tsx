import { useMemo, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useRedeemEVM } from '../hooks/useRedeemEVM'
import { useBalancesEVM } from '../hooks/useBalancesEVM'
import { UI_MESSAGES } from '../utils'

const MOCK_APY = 12.5 // TODO: Fetch from Bifrost API

export const RedeemForm = () => {
  const { address: account } = useAccount()
  const { vethBalance, refetchAll } = useBalancesEVM()
  const { redeem, isLoading, error, needsApproval, isConfirmed } = useRedeemEVM()

  const [amount, setAmount] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  // Refresh balances automatically after confirmation
  useEffect(() => {
    if (isConfirmed) {
      setAmount('')
      void refetchAll()
    }
  }, [isConfirmed, refetchAll])

  const vethAvailableDisplay = useMemo(() => {
    const formatted = formatEther(vethBalance)
    return Number(formatted).toFixed(4)
  }, [vethBalance])

  // Memoize the approval check result
  const needsApprove = useMemo(() => {
    return needsApproval(amount || '0', 'eth')
  }, [amount, needsApproval])

  const handlePreset = (percentage: number) => {
    if (!account) {
      setLocalError('Connect your wallet to redeem vETH')
      return
    }

    const raw = (vethBalance * BigInt(percentage)) / BigInt(100)
    const formatted = formatEther(raw)
    const display = Number(formatted).toFixed(4)
    setAmount(display)
    setLocalError(null)
  }

  const handleInputChange = (value: string) => {
    if (value === '' || /^\d*(?:\.\d{0,6})?$/.test(value)) {
      setAmount(value)
      setLocalError(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!account) {
      setLocalError('Connect your wallet to redeem vETH')
      return
    }

    if (!amount || Number(amount) === 0) {
      setLocalError('Enter an amount greater than 0')
      return
    }

    try {
      const amountNum = Number(amount)

      if (amountNum <= 0) {
        setLocalError('Enter an amount greater than 0')
        return
      }

      const availableNum = Number(formatEther(vethBalance))
      if (amountNum > availableNum) {
        setLocalError('Amount exceeds available vETH balance')
        return
      }

      setLocalError(null)
      await redeem({ amount, asset: 'eth' })
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : 'Failed to submit redeem transaction'
      setLocalError(message)
    }
  }

  const estimatedEth = amount && Number(amount) > 0 ? amount : '0'
  const disableAction = !account || isLoading || !amount

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Convert vETH → ETH</h2>
        <p className="text-sm text-purple-100/90">
          Exit your liquid staking position and receive your ETH back.
        </p>
      </header>

      <div className="space-y-2">
        <div className="flex flex-col gap-1 text-xs text-purple-100/80 sm:flex-row sm:items-center sm:justify-between">
          <span>Amount</span>
          <span className="text-purple-100/70 sm:text-right">Available: {vethAvailableDisplay} vETH</span>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-sky-500/10 to-white/10 opacity-0 transition group-hover:opacity-100" />
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 sm:py-3.5">
            <input
              value={amount}
              onChange={(event) => handleInputChange(event.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/40 sm:text-2xl"
              inputMode="decimal"
            />
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              vETH
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePreset(preset)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/15"
            >
              {preset}%
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePreset(100)}
            className="rounded-full border border-sky-400/50 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-sky-300 hover:bg-sky-500/30"
          >
            Max
          </button>
        </div>
      </div>

      {/* Exchange-rate summary */}
      <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-blue-500/10 px-4 py-3 text-sm backdrop-blur-sm sm:px-5 sm:py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-purple-100/80">Estimated Output</span>
            <span className="font-semibold text-white">{estimatedEth} ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-100/80">Exchange Rate</span>
            <span className="font-mono text-xs text-purple-200">1 vETH ≈ 1 ETH</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2">
            <span className="text-purple-100/80">You've Earned (APY)</span>
            <span className="font-semibold text-emerald-400">~{MOCK_APY}%</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-purple-100/60">
          Instant redemption available. You will receive approximately 1 ETH for every 1 vETH.
        </p>
      </div>

      {(localError || error) && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/20 px-4 py-3 text-xs text-rose-100">
          {localError ?? (error?.message || 'Transaction failed')}
        </div>
      )}

      <button
        type="submit"
        disabled={disableAction}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_70px_-45px_rgba(59,130,246,0.85)] transition hover:scale-[1.01] hover:shadow-[0_25px_60px_-40px_rgba(14,165,233,0.85)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            {UI_MESSAGES.PROCESSING}
          </span>
        ) : needsApprove ? (
          'Approve vETH'
        ) : (
          UI_MESSAGES.REDEEM
        )}
      </button>
    </form>
  )
}

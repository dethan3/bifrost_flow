/**
 * EVM 版本的 RedeemCard
 * 使用 useRedeemEVM 和 useBalancesEVM
 */

import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useRedeemEVM } from '../hooks/useRedeemEVM'
import { useBalancesEVM } from '../hooks/useBalancesEVM'
import { UI_MESSAGES } from '../utils'

// EVM 上只支持即时赎回
// 未来可以根据实际协议支持情况添加更多模式

export const RedeemCard = () => {
  const { address: account } = useAccount()
  const { vethBalance } = useBalancesEVM()
  const { redeem, isLoading, error, needsApproval } = useRedeemEVM()

  const [amount, setAmount] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const vethAvailableDisplay = useMemo(() => {
    const formatted = formatEther(vethBalance)
    return Number(formatted).toFixed(4)
  }, [vethBalance])

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
      
      if (!isLoading) {
        setAmount('')
      }
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : 'Failed to submit redeem transaction'
      setLocalError(message)
    }
  }

  const estimatedEth = amount && Number(amount) > 0 ? amount : '0'
  const needsApprove = needsApproval(amount || '0', 'eth')
  const disableAction = !account || isLoading || !amount

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_65px_-45px_rgba(59,130,246,0.7)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.2),_transparent_60%)]" />
      <form className="relative space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Redeem</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Convert vDOT → DOT</h2>
          <p className="text-sm text-purple-100/90">
            Exit your liquid staking position. Choose instant liquidity or wait for the standard unlock period.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {REDEEM_MODES.map((item) => {
            const isActive = item.value === mode
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleModeSelect(item.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'border-sky-400/80 bg-sky-500/30 text-white shadow-[0_20px_45px_-35px_rgba(14,116,144,0.8)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-purple-100/80 sm:px-5 sm:py-4">
          {REDEEM_MODES.map((item) =>
            item.value === mode ? (
              <p key={item.value}>{item.description}</p>
            ) : null
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1 text-xs text-purple-100/80 sm:flex-row sm:items-center sm:justify-between">
            <span>Amount</span>
            <span className="text-purple-100/70 sm:text-right">Available: {vdotAvailableDisplay} vDOT</span>
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
                vDOT
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

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-purple-100/90 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between">
            <span>Estimated Output</span>
            <span className="font-semibold text-white">{estimatedDot} DOT</span>
          </div>
          <p className="mt-2 text-xs text-purple-100/70">
            Fees may apply for instant redemption. Standard redemptions unlock after the staking unbonding period.
          </p>
        </div>

        {(localError || error) && (
          <div className="rounded-2xl border border-rose-500/50 bg-rose-500/20 px-4 py-3 text-xs text-rose-100">
            {localError ?? error}
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
          ) : (
            UI_MESSAGES.REDEEM
          )}
        </button>
      </form>
    </section>
  )
}

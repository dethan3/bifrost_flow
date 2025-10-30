import { FormEvent, useMemo, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useBalance } from '../hooks/useBalance'
import { useMint } from '../hooks/useMint'
import { formatBalance, parseBalance, TOKEN_DECIMALS, UI_MESSAGES } from '../utils'

const QUICK_PRESETS = [25, 50, 75, 100] as const

export const MintCard = () => {
  const { account } = useWallet()
  const { balances } = useBalance()
  const { mint, isLoading, error } = useMint()

  const [amount, setAmount] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const dotAvailableRaw = balances?.dot.free ?? '0'
  const dotAvailableDisplay = useMemo(
    () => formatBalance(dotAvailableRaw, TOKEN_DECIMALS.DOT, 4),
    [dotAvailableRaw]
  )

  const handlePreset = (percentage: (typeof QUICK_PRESETS)[number]) => {
    if (!account) {
      setLocalError('Connect your wallet to mint vDOT')
      return
    }

    const raw = (BigInt(dotAvailableRaw) * BigInt(percentage)) / BigInt(100)
    const formatted = formatBalance(raw.toString(), TOKEN_DECIMALS.DOT, 4)
    setAmount(formatted)
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
      setLocalError('Connect your wallet to mint vDOT')
      return
    }

    if (!amount || Number(amount) === 0) {
      setLocalError('Enter an amount greater than 0')
      return
    }

    try {
      const rawAmount = parseBalance(amount, TOKEN_DECIMALS.DOT)
      const rawBigInt = BigInt(rawAmount)

      if (rawBigInt <= BigInt(0)) {
        setLocalError('Enter an amount greater than 0')
        return
      }

      if (rawBigInt > BigInt(dotAvailableRaw)) {
        setLocalError('Amount exceeds available DOT balance')
        return
      }

      setLocalError(null)
      await mint({ amount: rawAmount, tokenSymbol: 'DOT' })
      setAmount('')
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : 'Failed to submit mint transaction'
      setLocalError(message)
    }
  }

  const estimatedVdot = amount && Number(amount) > 0 ? amount : '0'
  const disableAction = !account || isLoading || !amount

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_65px_-45px_rgba(236,72,153,0.7)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.18),_transparent_60%)]" />
      <form className="relative space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Mint</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Convert DOT → vDOT</h2>
          <p className="text-sm text-purple-100/90">
            Stake your DOT and receive liquid vDOT to stay flexible while earning staking rewards.
          </p>
        </header>

        <div className="space-y-2">
          <div className="flex flex-col gap-1 text-xs text-purple-100/80 sm:flex-row sm:items-center sm:justify-between">
            <span>Amount</span>
            <span className="text-purple-100/70 sm:text-right">Available: {dotAvailableDisplay} DOT</span>
          </div>
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 via-purple-500/10 to-white/10 opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 sm:py-3.5">
              <input
                value={amount}
                onChange={(event) => handleInputChange(event.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-xl font-semibold text-white outline-none placeholder:text-white/40 sm:text-2xl"
                inputMode="decimal"
              />
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                DOT
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
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
              className="rounded-full border border-purple-400/50 bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-purple-300 hover:bg-purple-500/30"
            >
              Max
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-purple-100/90 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between">
            <span>Estimated Output</span>
            <span className="font-semibold text-white">{estimatedVdot} vDOT</span>
          </div>
          <p className="mt-2 text-xs text-purple-100/70">
            1 DOT mints approximately 1 vDOT. Final amount may vary slightly due to on-chain fees.
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
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_30px_70px_-45px_rgba(147,51,234,0.9)] transition hover:scale-[1.01] hover:shadow-[0_25px_60px_-40px_rgba(236,72,153,0.85)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
              {UI_MESSAGES.PROCESSING}
            </span>
          ) : (
            UI_MESSAGES.MINT
          )}
        </button>
      </form>
    </section>
  )
}

export const InfoCard = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_60%)]" />
      
      <div className="relative space-y-5">
        <header className="text-center">
          <h2 className="text-lg font-semibold text-white">Why Bifrost Flow?</h2>
          <p className="mt-1 text-sm text-purple-100/60">
            A production-grade cockpit that keeps liquid staking intuitive, transparent, and fast.
          </p>
        </header>

        <div className="space-y-3">
          {/* Feature 1 */}
          <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/5 to-transparent p-4 transition hover:border-purple-400/30">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-xl">
                💎
              </div>
              <div>
                <h3 className="font-semibold text-white">Seamless Wallet Onboarding</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  RainbowKit + WalletConnect support MetaMask, Coinbase, Rainbow, and more without extra setup.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-4 transition hover:border-emerald-400/30">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-xl">
                🛡️
              </div>
              <div>
                <h3 className="font-semibold text-white">Resilient Network Access</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  Automatic RPC failover keeps Bifrost telemetry online and surfaces endpoint health in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-sky-500/5 to-transparent p-4 transition hover:border-sky-400/30">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-xl">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-white">Actionable Portfolio Insights</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  Native ETH, vETH, and rewards forecasts refresh together so you can react without leaving the page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="rounded-lg border border-indigo-400/20 bg-indigo-500/5 px-4 py-3">
          <p className="text-xs text-indigo-200/80">
            <span className="font-semibold">💡 Pro Tip:</span> Use the mint/redeem presets to model new positions, then watch the dashboard update instantly after each transaction.
          </p>
        </div>
      </div>
    </section>
  )
}

export const InfoCard = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_60%)]" />
      
      <div className="relative space-y-5">
        <header>
          <h2 className="text-lg font-semibold text-white">Why Liquid Staking?</h2>
          <p className="mt-1 text-sm text-purple-100/60">
            Unlock the full potential of your assets
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
                <h3 className="font-semibold text-white">Maintain Liquidity</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  Your vETH tokens remain tradeable and usable in DeFi while earning staking rewards
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
                <h3 className="font-semibold text-white">Secure & Decentralized</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  Built on Bifrost's battle-tested infrastructure with multi-chain support
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
                <h3 className="font-semibold text-white">Instant Rewards</h3>
                <p className="mt-1 text-xs text-purple-100/70">
                  Start earning immediately with no lock-up periods or minimum requirements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="rounded-lg border border-indigo-400/20 bg-indigo-500/5 px-4 py-3">
          <p className="text-xs text-indigo-200/80">
            <span className="font-semibold">💡 Pro Tip:</span> You can redeem your vETH back to ETH anytime. The exchange rate reflects your accumulated staking rewards.
          </p>
        </div>
      </div>
    </section>
  )
}

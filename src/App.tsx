import { Header } from './components/Header'
import { BalanceCard } from './components/BalanceCard'
import { StakingPanel } from './components/StakingPanel'
import { EarningsCard } from './components/EarningsCard'
import { InfoCard } from './components/InfoCard'
import { TransactionToast } from './components/TransactionToast'

function App() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-500/40 blur-[180px]" />
        <div className="absolute bottom-[-30%] left-[-5%] h-[460px] w-[460px] rounded-full bg-indigo-500/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_45%)]" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        <Header />

        {/* Main content */}
        <div className="mt-8 space-y-6">
          {/* Primary dashboard row */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] xl:items-stretch">
            <div className="h-full">
              <StakingPanel />
            </div>
            <div className="grid h-full grid-cols-1 gap-6">
              <BalanceCard />
              <EarningsCard />
            </div>
          </div>

          {/* Secondary information row */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:[&>*]:h-full">
            <div className="xl:col-span-3">
              <InfoCard />
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-white/50 sm:mt-12 sm:text-sm">
          <p className="font-medium text-white/80">
            © {currentYear} Bifrost Flow. All rights reserved.
          </p>
        </footer>
      </main>

      <TransactionToast />
    </div>
  )
}

export default App

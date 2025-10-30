import { Header } from './components/Header'
import { BalanceCard } from './components/BalanceCard'
import { MintCard } from './components/MintCard'
import { RedeemCard } from './components/RedeemCard'
import { TransactionToast } from './components/TransactionToast'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-500/40 blur-[180px]" />
        <div className="absolute bottom-[-30%] left-[-5%] h-[460px] w-[460px] rounded-full bg-indigo-500/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_45%)]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 sm:px-10 sm:pb-16 sm:pt-10">
        <Header />
        <BalanceCard />
        <div className="grid gap-6 lg:grid-cols-2">
          <MintCard />
          <RedeemCard />
        </div>
        <footer className="mt-2 flex flex-col items-start gap-1 text-[0.7rem] text-white/50 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
          <span>Phase 4 · UI Layer</span>
          <span>Crafted for a seamless Bifrost liquid staking experience</span>
        </footer>
      </main>

      <TransactionToast />
    </div>
  )
}

export default App

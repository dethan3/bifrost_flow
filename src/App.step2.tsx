/**
 * 测试步骤 2 - 添加 BalanceCard
 */

import { Header } from './components/Header'
import { BalanceCard } from './components/BalanceCard'
import { TransactionToast } from './components/TransactionToast'

function AppStep2() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-500/40 blur-[180px]" />
        <div className="absolute bottom-[-30%] left-[-5%] h-[460px] w-[460px] rounded-full bg-indigo-500/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_45%)]" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8">
        <Header />
        
        <div className="mt-8">
          <h2 className="text-xl text-white mb-4">🧪 Test Step 2: BalanceCard</h2>
          <BalanceCard />
        </div>
      </main>

      <TransactionToast />
    </div>
  )
}

export default AppStep2

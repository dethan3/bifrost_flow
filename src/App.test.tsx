/**
 * 简化测试版本 - 用于排查卡顿问题
 * 逐步启用组件
 */

import { Header } from './components/Header'
import { TransactionToast } from './components/TransactionToast'

function AppTest() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* 背景效果 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 right-[-10%] h-[520px] w-[520px] rounded-full bg-purple-500/40 blur-[180px]" />
        <div className="absolute bottom-[-30%] left-[-5%] h-[460px] w-[460px] rounded-full bg-indigo-500/30 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_45%)]" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        {/* 头部 */}
        <Header />

        {/* 测试内容 */}
        <div className="mt-8 p-6 rounded-3xl border border-white/10 bg-white/5">
          <h2 className="text-2xl font-bold text-white mb-4">🧪 Test Mode</h2>
          <p className="text-purple-100">
            如果你能看到这个页面且不卡顿，说明基础组件没问题。
          </p>
          <p className="text-purple-100 mt-2">
            现在开始逐步启用其他组件...
          </p>
        </div>
      </main>

      <TransactionToast />
    </div>
  )
}

export default AppTest

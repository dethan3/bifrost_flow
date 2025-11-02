/**
 * EarningsCard - 收益追踪卡片
 * 显示简单的收益趋势图表和统计信息
 */

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBalancesEVM } from '../hooks/useBalancesEVM'

const MOCK_APY = 12.5 // TODO: Fetch from Bifrost API

// 生成过去7天的模拟收益数据（使用固定的波动值避免重新渲染）
const generateMockEarningsData = (vethAmount: number) => {
  const dailyRate = (MOCK_APY / 100) / 365
  // 使用固定的波动模式而不是随机值
  const fixedVariances = [0.02, -0.03, 0.05, -0.01, 0.04, -0.02, 0.03]
  return Array.from({ length: 7 }, (_, i) => {
    const day = i + 1
    const earnings = vethAmount * dailyRate * day
    return earnings * (1 + fixedVariances[i])
  })
}

export const EarningsCard = () => {
  const { address: account } = useAccount()
  const { vethBalance } = useBalancesEVM()

  const vethAmount = useMemo(() => {
    return Number(formatEther(vethBalance))
  }, [vethBalance])

  const earningsData = useMemo(() => {
    return generateMockEarningsData(vethAmount)
  }, [vethAmount])

  // 计算总收益（假设持有30天）
  const totalEarnings = useMemo(() => {
    const dailyRate = (MOCK_APY / 100) / 365
    return (vethAmount * dailyRate * 30).toFixed(4)
  }, [vethAmount])

  // 找出最大值用于归一化（使用 useMemo 避免重复计算）
  const maxEarning = useMemo(() => {
    return Math.max(...earningsData, 0.001)
  }, [earningsData])

  if (!account) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Earnings Tracker</h2>
        <p className="mt-2 text-sm text-purple-100/70">
          Connect your wallet to view earnings
        </p>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_60%)]" />
      
      <div className="relative space-y-5">
        {/* 头部 */}
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Earnings Tracker</h2>
          <div className="flex gap-2 text-[0.65rem] uppercase tracking-wider">
            <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/60">
              1D
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/60">
              1W
            </button>
            <button className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-2 py-1 text-white">
              1M
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/60">
              1Y
            </button>
          </div>
        </header>

        {/* 简单柱状图 */}
        <div className="h-32 sm:h-40">
          <div className="flex h-full items-end justify-between gap-1 sm:gap-2">
            {earningsData.map((earning, index) => {
              const heightPercent = (earning / maxEarning) * 100
              return (
                <div
                  key={index}
                  className="group relative flex-1"
                  style={{ height: '100%' }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-teal-400 opacity-80 transition-all group-hover:opacity-100"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/90 px-2 py-1 text-[0.65rem] text-white group-hover:block">
                    Day {index + 1}: {earning.toFixed(4)} ETH
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">Total Rewards</p>
            <p className="mt-1 text-xl font-bold text-emerald-400">{totalEarnings} ETH</p>
            <p className="text-[0.65rem] text-purple-200/60">
              ≈ ${(Number(totalEarnings) * 2000).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">Current APY</p>
            <p className="mt-1 text-xl font-bold text-white">{MOCK_APY}%</p>
            <p className="text-[0.65rem] text-emerald-300/70">
              {(MOCK_APY / 365).toFixed(3)}% daily
            </p>
          </div>
        </div>

        {/* 说明文本 */}
        <p className="text-[0.7rem] text-purple-100/50">
          📊 Estimated earnings based on current vETH balance and {MOCK_APY}% APY. 
          Actual rewards may vary.
        </p>
      </div>
    </section>
  )
}

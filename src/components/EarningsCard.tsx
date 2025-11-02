/**
 * EarningsCard - 收益追踪卡片
 * 显示核心的收益统计信息
 */

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useBalancesEVM } from '../hooks/useBalancesEVM'

const MOCK_APY = 12.5 // TODO: Fetch from Bifrost API

export const EarningsCard = () => {
  const { address: account } = useAccount()
  const { vethBalance } = useBalancesEVM()

  const vethAmount = useMemo(() => {
    return Number(formatEther(vethBalance))
  }, [vethBalance])

  // 当用户余额太小时，使用示例数据（1 ETH）
  const displayAmount = useMemo(() => {
    return vethAmount < 0.01 ? 1.0 : vethAmount
  }, [vethAmount])

  // 判断是否使用示例数据
  const isExampleData = vethAmount < 0.01

  // 计算总收益（假设持有30天）
  const totalEarnings = useMemo(() => {
    const dailyRate = (MOCK_APY / 100) / 365
    return (displayAmount * dailyRate * 30).toFixed(4)
  }, [displayAmount])


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
      
      <div className="relative space-y-4">
        {/* 头部 */}
        <header>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Rewards Overview</h2>
            {isExampleData && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-amber-300">
                Example
              </span>
            )}
          </div>
        </header>

        {/* 统计数据 - 单行紧凑布局 */}
        <div className="grid grid-cols-3 gap-3">
          {/* 30天预估收益 */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 text-center">
            <div className="mb-1.5 text-lg">💰</div>
            <p className="text-[0.6rem] uppercase tracking-wider text-white/50">30-Day</p>
            <p className="mt-0.5 text-sm font-bold text-emerald-400">{totalEarnings}</p>
            <p className="text-[0.55rem] text-purple-200/50">ETH</p>
          </div>

          {/* APY */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-3 text-center">
            <div className="mb-1.5 text-lg">🎯</div>
            <p className="text-[0.6rem] uppercase tracking-wider text-white/50">APY</p>
            <p className="mt-0.5 text-sm font-bold text-white">{MOCK_APY}%</p>
            <p className="text-[0.55rem] text-indigo-200/50">Annual</p>
          </div>

          {/* vETH 余额 */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 p-3 text-center">
            <div className="mb-1.5 text-lg">🔮</div>
            <p className="text-[0.6rem] uppercase tracking-wider text-white/50">Balance</p>
            <p className="mt-0.5 text-sm font-bold text-white">{displayAmount.toFixed(4)}</p>
            <p className="text-[0.55rem] text-fuchsia-200/50">vETH</p>
          </div>
        </div>

        {/* 说明文本 */}
        <p className="text-[0.7rem] text-purple-100/50">
          {isExampleData ? (
            <>
              💡 Showing example for 1 vETH. Stake ETH to see your actual rewards.
            </>
          ) : (
            <>
              📊 Based on your {vethAmount.toFixed(4)} vETH and {MOCK_APY}% APY.
            </>
          )}
        </p>
      </div>
    </section>
  )
}

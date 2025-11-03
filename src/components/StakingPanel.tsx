import { useState } from 'react'
import { MintForm } from './MintForm'
import { RedeemForm } from './RedeemForm'

type TabType = 'mint' | 'redeem'

export const StakingPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mint')

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_65px_-45px_rgba(168,85,247,0.7)]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.12),_transparent_60%)]" />
      
      <div className="relative">
        {/* Tabs header */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('mint')}
            className={`flex-1 px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'mint'
                ? 'border-b-2 border-purple-400 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Mint
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'redeem'
                ? 'border-b-2 border-sky-400 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Redeem
            </span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-9">
          {activeTab === 'mint' ? <MintForm /> : <RedeemForm />}
        </div>
      </div>
    </section>
  )
}

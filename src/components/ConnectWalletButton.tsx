/**
 * EVM 版本的钱包连接按钮
 * 使用 RainbowKit 的 ConnectButton 并自定义样式
 */

import { ConnectButton } from '@rainbow-me/rainbowkit'

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // 处理 SSR 和挂载状态
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="relative w-full sm:w-auto"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    type="button"
                    onClick={openConnectModal}
                    className="group flex w-full items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-fuchsia-500/80 via-purple-500/80 to-indigo-500/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_-15px_rgba(139,92,246,0.8)] backdrop-blur transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-15px_rgba(236,72,153,0.9)] focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:px-5"
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white/80" />
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/20 opacity-0 transition group-hover:opacity-100" />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-[0.95rem] leading-tight">Connect Wallet</span>
                      <span className="text-[0.65rem] font-normal text-white/70">
                        MetaMask, WalletConnect
                      </span>
                    </span>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="group flex w-full items-center gap-3 rounded-full border border-rose-500/50 bg-gradient-to-r from-rose-500/80 via-red-500/80 to-orange-500/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_-15px_rgba(239,68,68,0.8)] backdrop-blur transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-15px_rgba(239,68,68,0.9)] focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:px-5"
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <span className="text-sm font-semibold text-white">⚠️</span>
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-[0.95rem] leading-tight">Wrong Network</span>
                      <span className="text-[0.65rem] font-normal text-white/70">
                        Click to switch
                      </span>
                    </span>
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  {/* Chain Switcher Button */}
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10 sm:flex sm:items-center sm:gap-2"
                  >
                    {chain.hasIcon && (
                      <div className="h-4 w-4">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="h-4 w-4 rounded-full"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  {/* Account Button */}
                  <button
                    type="button"
                    onClick={openAccountModal}
                    className="group flex w-full items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-fuchsia-500/80 via-purple-500/80 to-indigo-500/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_-15px_rgba(139,92,246,0.8)] backdrop-blur transition hover:scale-[1.02] hover:shadow-[0_20px_45px_-15px_rgba(236,72,153,0.9)] focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:px-5"
                  >
                    <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <span className="text-sm font-semibold text-white">
                        {account.displayName?.substring(0, 2).toUpperCase() || account.address.substring(2, 4).toUpperCase()}
                      </span>
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/20 opacity-0 transition group-hover:opacity-100" />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-[0.95rem] leading-tight">{account.displayName}</span>
                      <span className="text-[0.65rem] font-normal text-white/70">
                        {account.displayBalance ? `${account.displayBalance}` : ''}
                      </span>
                    </span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

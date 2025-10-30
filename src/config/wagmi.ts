/**
 * Wagmi + RainbowKit 配置
 * 用于 EVM 链的钱包连接和区块链交互
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrumSepolia, baseSepolia, sepolia } from 'wagmi/chains'

// 从环境变量获取 WalletConnect Project ID
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

// 配置 Wagmi
export const wagmiConfig = getDefaultConfig({
  appName: 'Bifrost Flow',
  projectId,
  chains: [arbitrumSepolia, baseSepolia, sepolia],
  ssr: false, // Vite 不需要 SSR
})

// 导出链配置供其他地方使用
export const supportedChains = [arbitrumSepolia, baseSepolia, sepolia]
export const defaultChain = arbitrumSepolia

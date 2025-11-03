/**
 * Wagmi + RainbowKit 配置
 * 用于 EVM 链的钱包连接和区块链交互
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { arbitrumSepolia, baseSepolia, sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim()

if (!projectId) {
  // RainbowKit 会在运行时抛错，此处提早提示以便开发阶段定位
  // eslint-disable-next-line no-console
  console.warn('[wagmiConfig] Missing VITE_WALLETCONNECT_PROJECT_ID; RainbowKit connect modal will be disabled.')
}

const chains = [arbitrumSepolia, baseSepolia, sepolia] as const

// 允许通过环境变量覆盖默认 RPC，未设置时 fallback 到 RainbowKit 内置公共节点
const transports = {
  [arbitrumSepolia.id]: http(import.meta.env.VITE_RPC_URL_ARBITRUM_SEPOLIA),
  [baseSepolia.id]: http(import.meta.env.VITE_RPC_URL_BASE_SEPOLIA),
  [sepolia.id]: http(import.meta.env.VITE_RPC_URL_SEPOLIA),
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Bifrost Flow',
  // 若本地缺失 ID，则退回 RainbowKit 提供的公开示例，至少能保证开发阶段可用
  projectId: projectId || '21fef48091f12692cad574a6f7753643',
  chains,
  transports,
  ssr: false, // Vite 不需要 SSR
  
  // 完全禁用持久化和自动重连 - 避免刷新后状态冲突
  autoConnect: false,
  
  // @ts-expect-error - 使用内部配置禁用持久化
  storage: null, // 禁用持久化存储
})

export const supportedChains = chains
export const defaultChain = arbitrumSepolia

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { arbitrumSepolia, baseSepolia, sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim()

if (!projectId) {
  // Surface the RainbowKit runtime error early so it is easier to debug during development
  // eslint-disable-next-line no-console
  console.warn('[wagmiConfig] Missing VITE_WALLETCONNECT_PROJECT_ID; RainbowKit connect modal will be disabled.')
}

const chains = [arbitrumSepolia, baseSepolia, sepolia] as const

// Allow overriding default RPC URLs via environment variables, otherwise fallback to RainbowKit defaults
const transports = {
  [arbitrumSepolia.id]: http(import.meta.env.VITE_RPC_URL_ARBITRUM_SEPOLIA),
  [baseSepolia.id]: http(import.meta.env.VITE_RPC_URL_BASE_SEPOLIA),
  [sepolia.id]: http(import.meta.env.VITE_RPC_URL_SEPOLIA),
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Bifrost Flow',
  // Fallback to RainbowKit's public example ID when the local value is missing to keep development unblocked
  projectId: projectId || '21fef48091f12692cad574a6f7753643',
  chains,
  transports,
  ssr: false, // Vite does not require SSR
})

export const supportedChains = chains
export const defaultChain = arbitrumSepolia


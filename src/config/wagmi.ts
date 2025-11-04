 import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { arbitrumSepolia, sepolia } from 'wagmi/chains'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim()

if (!projectId) {
  throw new Error('[wagmiConfig] Missing VITE_WALLETCONNECT_PROJECT_ID. Generate one at https://cloud.walletconnect.com/ and add it to your .env.local file.')
}

const chains = [arbitrumSepolia, sepolia] as const

// Allow overriding default RPC URLs via environment variables, otherwise fallback to RainbowKit defaults
const transports = {
  [arbitrumSepolia.id]: http(import.meta.env.VITE_RPC_URL_ARBITRUM_SEPOLIA),
  [sepolia.id]: http(import.meta.env.VITE_RPC_URL_SEPOLIA),
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Bifrost Flow',
  projectId,
  chains,
  transports,
  ssr: false, // Vite does not require SSR
})

export const supportedChains = chains
export const defaultChain = arbitrumSepolia

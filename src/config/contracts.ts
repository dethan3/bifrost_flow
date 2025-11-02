/**
 * L2Slpx Contract Address Configuration
 * Supported Testnets: Arbitrum Sepolia, Base Sepolia
 */

import type { Address } from 'viem'

export const L2SLPX_ADDRESSES: Record<number, Address> = {
  // Arbitrum Sepolia
  421614: '0x62CA64454046BbC18e35066A6350Acb0378EB3c2',
  // Base Sepolia
  84532: '0x262e52beD191a441CBD28dB151A11D7c41384F72',
  // Sepolia
  11155111: '0x262e52beD191a441CBD28dB151A11D7c41384F72',
}

/**
 * Token Type Definition
 */
export interface Token {
  name: string
  symbol: string
  address: Address
  decimals: number
  chainId: number
}

/**
 * Token Configuration - Arbitrum Sepolia
 * Note: Currently only ETH/vETH are deployed on Arbitrum Sepolia testnet
 * DOT/vDOT are only available on mainnets (Arbitrum One, Base, Optimism, BNB Chain)
 */
export const TOKENS_ARBITRUM_SEPOLIA: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
    decimals: 18,
    chainId: 421614,
  },
  {
    name: 'Voucher ETH',
    symbol: 'vETH',
    address: '0x0e011f93777b00f48b881b1cabc5f0a6395bdc02', // ✅ Verified (2025-11-02)
    decimals: 18,
    chainId: 421614,
  },
  // ⚠️ The following tokens are not deployed on Arbitrum Sepolia testnet, commented out
  // Verification date: 2025-11-02
  // To use DOT/vDOT, please switch to Arbitrum One mainnet
  // DOT mainnet address: 0x8d010bf9C26881788b4e6bf5Fd1bdC358c8F90b8
  // vDOT mainnet address: 0xBC33B4D48f76d17A1800aFcB730e8a6AAada7Fe5
  // {
  //   name: 'Polkadot',
  //   symbol: 'DOT',
  //   address: '0x4B16E254E7848e0826eBDd3049474fD9E70A244c', // ❌ Not verified - Not a contract address
  //   decimals: 18,
  //   chainId: 421614,
  // },
  // {
  //   name: 'Voucher DOT',
  //   symbol: 'vDOT',
  //   address: '0x8bFA30329F2A7A7b72fa4A76FdcE8aC92284bb94', // ❌ Not verified - Not a contract address
  //   decimals: 18,
  //   chainId: 421614,
  // },
]

/**
 * Token Configuration - Base Sepolia
 * Note: Currently only ETH/vETH are deployed on Base Sepolia testnet
 * DOT/vDOT are only available on mainnets (Arbitrum One, Base, Optimism, BNB Chain)
 */
export const TOKENS_BASE_SEPOLIA: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
    decimals: 18,
    chainId: 84532,
  },
  {
    name: 'Voucher ETH',
    symbol: 'vETH',
    address: '0x0e011f93777b00f48b881b1cabc5f0a6395bdc02', // ⚠️ To be verified (using same address as Arbitrum Sepolia)
    decimals: 18,
    chainId: 84532,
  },
  // ⚠️ The following tokens are not deployed on Base Sepolia testnet, commented out
  // Verification date: 2025-11-02
  // To use DOT/vDOT, please switch to Base mainnet
  // {
  //   name: 'Polkadot',
  //   symbol: 'DOT',
  //   address: '0x4B16E254E7848e0826eBDd3049474fD9E70A244c', // ❌ Not verified - Not a contract address
  //   decimals: 18,
  //   chainId: 84532,
  // },
  // {
  //   name: 'Voucher DOT',
  //   symbol: 'vDOT',
  //   address: '0x8bFA30329F2A7A7b72fa4A76FdcE8aC92284bb94', // ❌ Not verified - Not a contract address
  //   decimals: 18,
  //   chainId: 84532,
  // },
]

/**
 * Get token list for specified chain
 */
export function getTokensByChainId(chainId: number): Token[] {
  switch (chainId) {
    case 421614:
      return TOKENS_ARBITRUM_SEPOLIA
    case 84532:
      return TOKENS_BASE_SEPOLIA
    default:
      return TOKENS_ARBITRUM_SEPOLIA
  }
}

/**
 * Get L2Slpx contract address for specified chain
 */
export function getL2SlpxAddress(chainId: number): Address {
  return L2SLPX_ADDRESSES[chainId] || L2SLPX_ADDRESSES[421614]
}

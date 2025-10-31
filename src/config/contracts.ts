/**
 * L2Slpx 合约地址配置
 * 支持的测试网：Arbitrum Sepolia, Base Sepolia
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
 * Token 类型定义
 */
export interface Token {
  name: string
  symbol: string
  address: Address
  decimals: number
  chainId: number
}

/**
 * 代币配置 - Arbitrum Sepolia
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
    name: 'Polkadot',
    symbol: 'DOT',
    address: '0x4B16E254E7848e0826eBDd3049474fD9E70A244c',
    decimals: 18,
    chainId: 421614,
  },
  {
    name: 'Voucher ETH',
    symbol: 'vETH',
    address: '0x0e011f93777b00f48b881b1cabc5f0a6395bdc02',
    decimals: 18,
    chainId: 421614,
  },
  {
    name: 'Voucher DOT',
    symbol: 'vDOT',
    address: '0x8bFA30329F2A7A7b72fa4A76FdcE8aC92284bb94',
    decimals: 18,
    chainId: 421614,
  },
]

/**
 * 代币配置 - Base Sepolia
 */
export const TOKENS_BASE_SEPOLIA: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    decimals: 18,
    chainId: 84532,
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    address: '0x4B16E254E7848e0826eBDd3049474fD9E70A244c',
    decimals: 18,
    chainId: 84532,
  },
  {
    name: 'Voucher ETH',
    symbol: 'vETH',
    address: '0x0e011f93777b00f48b881b1cabc5f0a6395bdc02',
    decimals: 18,
    chainId: 84532,
  },
  {
    name: 'Voucher DOT',
    symbol: 'vDOT',
    address: '0x8bFA30329F2A7A7b72fa4A76FdcE8aC92284bb94',
    decimals: 18,
    chainId: 84532,
  },
]

/**
 * 获取指定链的代币列表
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
 * 获取指定链的 L2Slpx 合约地址
 */
export function getL2SlpxAddress(chainId: number): Address {
  return L2SLPX_ADDRESSES[chainId] || L2SLPX_ADDRESSES[421614]
}

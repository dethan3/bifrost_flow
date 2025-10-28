/**
 * Shorten wallet address for display
 * @param address - Full wallet address
 * @param prefixLength - Number of characters to show at start (default 6)
 * @param suffixLength - Number of characters to show at end (default 4)
 * @returns Shortened address (e.g., "0x1234...5678")
 */
export const formatAddress = (
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (!address) return ''
  
  if (address.length <= prefixLength + suffixLength) {
    return address
  }
  
  const prefix = address.slice(0, prefixLength)
  const suffix = address.slice(-suffixLength)
  
  return `${prefix}...${suffix}`
}

/**
 * Format address for Substrate chains (keeps 0x if present, or handles SS58)
 * @param address - Full wallet address
 * @returns Shortened address
 */
export const formatSubstrateAddress = (address: string): string => {
  if (!address) return ''
  
  // For SS58 addresses (longer), show more characters
  if (address.length > 40) {
    return formatAddress(address, 8, 6)
  }
  
  // For hex addresses
  return formatAddress(address, 6, 4)
}

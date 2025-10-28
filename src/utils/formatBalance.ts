import { TOKEN_DECIMALS } from './constants'

/**
 * Format balance from chain raw value to human-readable format
 * @param balance - Raw balance string from chain
 * @param decimals - Token decimals (default 10 for DOT/vDOT)
 * @param displayDecimals - Number of decimals to display (default 4)
 * @returns Formatted balance string
 */
export const formatBalance = (
  balance: string | bigint,
  decimals: number = TOKEN_DECIMALS.DOT,
  displayDecimals: number = 4
): string => {
  try {
    const balanceBigInt = typeof balance === 'string' ? BigInt(balance) : balance
    
    // Convert to decimal
    const divisor = BigInt(10 ** decimals)
    const integerPart = balanceBigInt / divisor
    const fractionalPart = balanceBigInt % divisor
    
    // Format fractional part with proper padding
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
    const truncatedFractional = fractionalStr.slice(0, displayDecimals)
    
    // Remove trailing zeros
    const trimmedFractional = truncatedFractional.replace(/0+$/, '')
    
    if (trimmedFractional.length === 0) {
      return integerPart.toString()
    }
    
    return `${integerPart}.${trimmedFractional}`
  } catch (error) {
    console.error('Error formatting balance:', error)
    return '0'
  }
}

/**
 * Parse human-readable amount to chain raw value
 * @param amount - Human-readable amount string (e.g., "1.5")
 * @param decimals - Token decimals (default 10 for DOT/vDOT)
 * @returns Raw balance string for chain
 */
export const parseBalance = (
  amount: string,
  decimals: number = TOKEN_DECIMALS.DOT
): string => {
  try {
    // Remove any non-numeric characters except decimal point
    const cleanAmount = amount.replace(/[^\d.]/g, '')
    
    // Split into integer and fractional parts
    const [integerPart = '0', fractionalPart = ''] = cleanAmount.split('.')
    
    // Pad or truncate fractional part to match decimals
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals)
    
    // Combine and convert to BigInt
    const rawValue = BigInt(integerPart + paddedFractional)
    
    return rawValue.toString()
  } catch (error) {
    console.error('Error parsing balance:', error)
    return '0'
  }
}

/**
 * Format balance with token symbol
 * @param balance - Raw balance string from chain
 * @param symbol - Token symbol (e.g., "DOT", "vDOT")
 * @param decimals - Token decimals
 * @returns Formatted string with symbol (e.g., "1.5000 DOT")
 */
export const formatBalanceWithSymbol = (
  balance: string | bigint,
  symbol: string,
  decimals: number = TOKEN_DECIMALS.DOT
): string => {
  const formatted = formatBalance(balance, decimals)
  return `${formatted} ${symbol}`
}

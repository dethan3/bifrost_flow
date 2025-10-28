// Bifrost Network Configuration
export const BIFROST_NETWORK = {
  name: 'Bifrost Polkadot',
  rpcUrls: [
    import.meta.env.VITE_BIFROST_RPC ?? 'wss://hk.p.bifrost-rpc.liebi.com/ws',
    'wss://us.bifrost-rpc.liebi.com/ws',
    'wss://eu.bifrost-polkadot-rpc.liebi.com/ws',
    'wss://bifrost.public.curie.radiumblock.co/ws',
  ],
  chainId: 'bifrost-polkadot',
} as const

// Token Configuration
export const TOKENS = {
  DOT: 'DOT',
  VDOT: 'vDOT',
} as const

// UI Messages
export const UI_MESSAGES = {
  // Wallet
  CONNECT_WALLET: 'Connect Wallet',
  DISCONNECT: 'Disconnect',
  CONNECTING: 'Connecting...',
  WALLET_CONNECTED: 'Wallet Connected',
  NO_WALLET: 'No Polkadot Extension Found',
  
  // Actions
  MINT: 'Mint vDOT',
  REDEEM: 'Redeem',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  
  // Status
  PROCESSING: 'Processing...',
  SUCCESS: 'Success!',
  FAILED: 'Transaction Failed',
  
  // Labels
  BALANCE: 'Balance',
  AVAILABLE: 'Available',
  STAKED: 'Staked',
  REWARDS: 'Rewards',
  AMOUNT: 'Amount',
  
  // Redeem Options
  INSTANT_REDEEM: 'Instant Redeem',
  INSTANT_REDEEM_DESC: 'Get DOT immediately with a small fee',
  DELAYED_REDEEM: 'Standard Redeem',
  DELAYED_REDEEM_DESC: 'Wait ~28 days, no fee',
} as const

// Decimal Precision
export const TOKEN_DECIMALS = {
  DOT: 10,
  VDOT: 10,
} as const

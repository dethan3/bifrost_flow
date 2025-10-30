/**
 * L2Slpx 合约 ABI
 * 从 bifrost-dev-kit 复制
 */

export const l2SlpxAbi = [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ETHTransferFailed", type: "error" },
  { inputs: [], name: "InsufficientApproval", type: "error" },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InsufficientVTokenBalance", type: "error" },
  { inputs: [], name: "InvalidMinOrderAmount", type: "error" },
  { inputs: [], name: "InvalidOperation", type: "error" },
  { inputs: [], name: "InvalidOrderAmount", type: "error" },
  { inputs: [], name: "InvalidTokenAddress", type: "error" },
  { inputs: [], name: "InvalidTokenConversionRate", type: "error" },
  { inputs: [], name: "InvalidTokenFee", type: "error" },
  { inputs: [], name: "InvalidVTokenAddress", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum L2Slpx.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "remark",
        type: "string",
      },
    ],
    name: "CreateOrder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "addressToTokenConversionInfo",
    outputs: [
      {
        internalType: "enum L2Slpx.Operation",
        name: "operation",
        type: "uint8",
      },
      { internalType: "uint256", name: "minOrderAmount", type: "uint256" },
      { internalType: "uint256", name: "tokenConversionRate", type: "uint256" },
      { internalType: "uint256", name: "orderFee", type: "uint256" },
      { internalType: "address", name: "outputTokenAddress", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "checkSupportToken",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      {
        internalType: "enum L2Slpx.Operation",
        name: "operation",
        type: "uint8",
      },
      { internalType: "string", name: "remark", type: "string" },
    ],
    name: "createOrder",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "getTokenConversionInfo",
    outputs: [
      {
        components: [
          {
            internalType: "enum L2Slpx.Operation",
            name: "operation",
            type: "uint8",
          },
          { internalType: "uint256", name: "minOrderAmount", type: "uint256" },
          {
            internalType: "uint256",
            name: "tokenConversionRate",
            type: "uint256",
          },
          { internalType: "uint256", name: "orderFee", type: "uint256" },
          {
            internalType: "address",
            name: "outputTokenAddress",
            type: "address",
          },
        ],
        internalType: "struct L2Slpx.TokenConversionInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "removeTokenConversionInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      {
        internalType: "enum L2Slpx.Operation",
        name: "operation",
        type: "uint8",
      },
      { internalType: "uint256", name: "minOrderAmount", type: "uint256" },
      { internalType: "uint256", name: "tokenConversionRate", type: "uint256" },
      { internalType: "uint256", name: "orderFee", type: "uint256" },
      { internalType: "address", name: "outputTokenAddress", type: "address" },
    ],
    name: "setTokenConversionInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

/**
 * ERC20 标准 ABI（用于查询余额和授权）
 */
export const erc20Abi = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

# EVM 迁移指南

本文档指导如何将现有组件从 Polkadot/Substrate 迁移到 EVM。

## ✅ 已完成

### 1. 依赖安装
- ✅ wagmi v2.16.9
- ✅ viem v2.x  
- ✅ @rainbow-me/rainbowkit v2.2.5
- ✅ slpx-sdk v0.0.16
- ✅ @tanstack/react-query v5.76.1

### 2. 配置文件
- ✅ `src/config/wagmi.ts` - Wagmi 配置
- ✅ `src/config/contracts.ts` - 合约地址和代币配置
- ✅ `src/config/abis.ts` - 合约 ABI
- ✅ `.env.example` - 环境变量示例

### 3. 主入口
- ✅ `src/main.tsx` - 添加 WagmiProvider, QueryClientProvider, RainbowKitProvider

### 4. EVM Hooks
- ✅ `src/hooks/useMintEVM.ts` - Mint 功能
- ✅ `src/hooks/useRedeemEVM.ts` - Redeem 功能  
- ✅ `src/hooks/useBalancesEVM.ts` - 余额查询

---

## 🔄 待迁移组件

### 组件迁移对照表

| 原组件 | 使用的 Hook | 新 Hook | 状态 |
|--------|------------|---------|------|
| `ConnectWalletButton.tsx` | `useWallet` | RainbowKit 的 `ConnectButton` | ⏳ 待迁移 |
| `MintCard.tsx` | `useMint` | `useMintEVM` | ⏳ 待迁移 |
| `RedeemCard.tsx` | `useRedeem` | `useRedeemEVM` | ⏳ 待迁移 |
| `BalanceCard.tsx` | `useBalance` | `useBalancesEVM` | ⏳ 待迁移 |

---

## 📝 组件迁移步骤

### 1. 更新 ConnectWalletButton

**原代码（Polkadot）**:
```tsx
import { useWallet } from '../hooks/useWallet'

export function ConnectWalletButton() {
  const { account, connect, disconnect } = useWallet()
  // ...
}
```

**新代码（EVM）**:
```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function ConnectWalletButton() {
  return <ConnectButton />
}
```

> RainbowKit 提供了完整的钱包连接 UI，不需要自己实现！

---

### 2. 更新 MintCard

**原代码关键部分**:
```tsx
import { useMint } from '../hooks/useMint'

const { mint, isLoading } = useMint()

const handleMint = async () => {
  await mint({ amount: inputAmount, tokenSymbol: 'DOT' })
}
```

**新代码**:
```tsx
import { useMintEVM } from '../hooks/useMintEVM'
import { formatEther } from 'viem'

const { mint, isLoading, isConfirming, isConfirmed, hash } = useMintEVM()

const handleMint = async () => {
  await mint({ 
    amount: inputAmount,
    asset: selectedToken === 'vETH' ? 'eth' : 'dot'
  })
}

// 显示交易状态
{isConfirming && <p>等待确认...</p>}
{isConfirmed && <p>交易成功！Hash: {hash}</p>}
```

**关键变化**:
- 不再需要 `tokenSymbol`，改为 `asset: 'eth' | 'dot'`
- 可以直接访问 `hash`, `isConfirming`, `isConfirmed`
- amount 仍然是字符串格式，如 "1.5"

---

### 3. 更新 RedeemCard

**原代码关键部分**:
```tsx
import { useRedeem } from '../hooks/useRedeem'

const { redeem, isLoading } = useRedeem()

const handleRedeem = async () => {
  await redeem({ amount: inputAmount, tokenSymbol: 'VDOT' })
}
```

**新代码**:
```tsx
import { useRedeemEVM } from '../hooks/useRedeemEVM'

const { 
  redeem, 
  isLoading, 
  isConfirming, 
  isConfirmed, 
  hash,
  needsApproval 
} = useRedeemEVM()

const handleRedeem = async () => {
  const asset = selectedToken === 'vETH' ? 'eth' : 'dot'
  
  // 检查是否需要授权
  if (needsApproval(inputAmount, asset)) {
    // 第一次调用会执行授权
    await redeem({ amount: inputAmount, asset })
    // 需要等待授权完成后再次调用
  } else {
    // 已授权，直接 redeem
    await redeem({ amount: inputAmount, asset })
  }
}

// 按钮文字
const buttonText = needsApproval(inputAmount, asset) ? 'Approve' : 'Redeem'
```

**关键变化**:
- Redeem 需要先 approve vToken
- `needsApproval` 函数帮助判断是否需要授权
- 可能需要两次交易：approve + redeem

---

### 4. 更新 BalanceCard

**原代码关键部分**:
```tsx
import { useBalance } from '../hooks/useBalance'

const { 
  nativeBalance, 
  dotBalance, 
  vdotBalance,
  isLoading 
} = useBalance()

<p>DOT: {dotBalance}</p>
<p>vDOT: {vdotBalance}</p>
```

**新代码**:
```tsx
import { useBalancesEVM } from '../hooks/useBalancesEVM'
import { formatEther } from 'viem'

const { 
  nativeBalance,
  dotBalance,
  vethBalance,
  vdotBalance,
  isLoading,
  refetchAll
} = useBalancesEVM()

<p>ETH: {formatEther(nativeBalance)}</p>
<p>DOT: {formatEther(dotBalance)}</p>
<p>vETH: {formatEther(vethBalance)}</p>
<p>vDOT: {formatEther(vdotBalance)}</p>

<button onClick={refetchAll}>刷新余额</button>
```

**关键变化**:
- 余额是 `bigint` 类型，需要用 `formatEther` 格式化
- 新增 `vethBalance` (原来没有)
- 使用 `refetchAll` 刷新所有余额

---

## 🔧 工具函数

### 格式化余额

```tsx
import { formatEther } from 'viem'

// bigint → 字符串
const formatted = formatEther(BigInt(1500000000000000000)) // "1.5"

// 限制小数位数
const display = Number(formatEther(balance)).toFixed(6)
```

### 解析输入

```tsx
import { parseEther } from 'viem'

// 字符串 → bigint
const wei = parseEther("1.5") // 1500000000000000000n
```

---

## 🌐 网络切换

使用 RainbowKit 的网络切换器：

```tsx
import { useChainId, useSwitchChain } from 'wagmi'

function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  return (
    <div>
      <p>当前链: {chainId === 421614 ? 'Arbitrum Sepolia' : 'Base Sepolia'}</p>
      <button onClick={() => switchChain({ chainId: 421614 })}>
        切换到 Arbitrum Sepolia
      </button>
    </div>
  )
}
```

---

## ⚙️ 环境变量

创建 `.env` 文件：

```bash
# WalletConnect Project ID (必需)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# 获取方式：https://cloud.walletconnect.com/
```

---

## 🚀 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

---

## 📚 参考资源

- [Wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Viem 文档](https://viem.sh/)
- [slpx-sdk](https://www.npmjs.com/package/slpx-sdk)

---

## ⚠️ 常见问题

### Q: RainbowKit 显示空白？
A: 确保设置了 `VITE_WALLETCONNECT_PROJECT_ID` 环境变量

### Q: 交易失败？
A: 检查：
1. 是否连接了正确的网络（Arbitrum/Base Sepolia）
2. 是否有足够的 Gas 费用
3. ERC20 是否已 approve

### Q: 余额显示为 0？
A: 检查：
1. 合约地址是否正确
2. 是否在正确的链上
3. 使用 `refetchAll()` 手动刷新

---

## ✨ 下一步

1. 按照上述指南迁移各个组件
2. 测试 Mint 和 Redeem 功能
3. 获取测试网代币：
   - [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
   - [Base Sepolia Faucet](https://docs.base.org/docs/tools/network-faucets)
4. 部署到生产环境

---

需要帮助？查看 `bifrost-ui-kit` 的完整示例！

# 🚀 EVM 版本快速启动指南

## ✅ 迁移已完成！

所有组件已成功从 Polkadot 迁移到 EVM：

- ✅ **ConnectWalletButton** - 使用 RainbowKit
- ✅ **MintCard** - ETH → vETH
- ✅ **RedeemCard** - vETH → ETH (支持自动 approve)
- ✅ **BalanceCard** - 显示 ETH 和 vETH 余额

---

## 📋 测试前准备

### 1. 设置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env`，添加你的 WalletConnect Project ID：

```bash
VITE_WALLETCONNECT_PROJECT_ID=你的项目ID
```

**获取 Project ID**：
1. 访问 https://cloud.walletconnect.com/
2. 注册或登录
3. 创建新项目
4. 复制 Project ID

---

### 2. 安装 MetaMask 钱包

如果还没有安装：
- Chrome: https://metamask.io/download/
- Firefox/Brave: 在扩展商店搜索 "MetaMask"

---

### 3. 添加测试网到 MetaMask

#### 方法A：自动添加（推荐）
启动应用后，RainbowKit 会自动提示添加网络

#### 方法B：手动添加

**Arbitrum Sepolia**
- 网络名称: Arbitrum Sepolia
- RPC URL: https://sepolia-rollup.arbitrum.io/rpc
- Chain ID: 421614
- 货币符号: ETH
- 区块浏览器: https://sepolia.arbiscan.io

**Base Sepolia**
- 网络名称: Base Sepolia
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- 货币符号: ETH
- 区块浏览器: https://sepolia.basescan.org

---

### 4. 获取测试网 ETH

你需要测试网 ETH 来支付 Gas 和测试 Mint 功能：

**Arbitrum Sepolia Faucet**
- https://faucet.quicknode.com/arbitrum/sepolia
- https://www.alchemy.com/faucets/arbitrum-sepolia

**Base Sepolia Faucet**
- https://docs.base.org/docs/tools/network-faucets
- https://www.coinbase.com/faucets/base-sepolia-faucet

> 💡 提示：通常需要先在 Sepolia 主测试网获取 ETH，然后通过桥接到 L2

---

## 🎮 开始测试

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

---

## 🧪 测试流程

### 1️⃣ 连接钱包
- 点击右上角 "Connect Wallet" 按钮
- 选择 MetaMask
- 授权连接
- 确认你在 Arbitrum Sepolia 或 Base Sepolia 网络

### 2️⃣ 查看余额
- 连接后自动显示 ETH 和 vETH 余额
- 点击 "Refresh" 按钮刷新余额

### 3️⃣ Mint vETH
1. 在 **Mint** 卡片中输入 ETH 数量（例如 0.01）
2. 或点击预设按钮（25%, 50%, 75%, Max）
3. 点击 "Mint" 按钮
4. 在 MetaMask 中确认交易
5. 等待交易确认
6. 刷新余额查看新的 vETH

### 4️⃣ Redeem ETH
1. 在 **Redeem** 卡片中输入 vETH 数量
2. **首次 Redeem**：点击 "Approve vETH" 授权合约使用你的 vETH
3. 确认授权交易
4. 再次点击按钮，此时显示 "Redeem"
5. 确认 Redeem 交易
6. 等待交易完成，余额会自动更新

---

## 🔍 测试检查清单

- [ ] 钱包连接成功
- [ ] 余额显示正确
- [ ] 可以切换网络（Arbitrum Sepolia ↔ Base Sepolia）
- [ ] Mint 功能正常
  - [ ] 预设按钮工作
  - [ ] 自定义输入工作
  - [ ] 交易成功并余额更新
- [ ] Redeem 功能正常
  - [ ] Approve 流程正常
  - [ ] Redeem 交易成功
  - [ ] 余额正确更新
- [ ] 刷新按钮工作
- [ ] 错误提示清晰（余额不足、未连接等）

---

## 🐛 常见问题

### Q: 点击 "Connect Wallet" 没有反应？
A: 检查 `.env` 文件中的 `VITE_WALLETCONNECT_PROJECT_ID` 是否设置

### Q: 显示 "Wrong Network"？
A: 点击按钮切换到 Arbitrum Sepolia 或 Base Sepolia

### Q: Mint 交易失败？
A: 检查：
1. 是否有足够的 ETH 支付 Gas
2. 输入的金额是否小于余额
3. 网络是否拥堵（等待后重试）

### Q: Redeem 需要两次交易？
A: 是的！第一次是 Approve vETH，第二次才是真正的 Redeem

### Q: 余额显示为 0？
A: 点击 "Refresh" 按钮，或检查网络连接

### Q: 如何查看交易详情？
A: 
- Arbitrum Sepolia: https://sepolia.arbiscan.io
- Base Sepolia: https://sepolia.basescan.org
- 在 MetaMask 中点击交易可直接跳转

---

## 📊 合约地址

### L2Slpx 合约
- **Arbitrum Sepolia**: `0x62CA64454046BbC18e35066A6350Acb0378EB3c2`
- **Base Sepolia**: `0x262e52beD191a441CBD28dB151A11D7c41384F72`

### vETH Token
- **Arbitrum Sepolia**: `0x6e0f9f2d25CC586965cBcF7017Ff89836ddeF9CC`
- **Base Sepolia**: `0x6e0f9f2d25CC586965cBcF7017Ff89836ddeF9CC`

---

## 🎨 UI 特性

- ✨ 保持原有的精美渐变设计
- 🌈 RainbowKit 集成的钱包连接
- 📱 响应式设计，移动端友好
- ⚡ 实时余额更新
- 🔄 智能的 Approve 流程提示

---

## 🔧 开发提示

### 查看合约交互
```bash
# 开发者工具控制台会显示：
# - slpx-sdk 生成的交易参数
# - 合约调用详情
# - 错误信息
```

### 调试 Hooks
```tsx
// 在组件中添加
console.log('Mint state:', { isLoading, isConfirming, isConfirmed, hash })
```

### 测试不同链
切换网络后刷新页面，确保 Wagmi 正确识别新网络

---

## 📚 相关文档

- [EVM 迁移指南](./EVM_MIGRATION_GUIDE.md) - 详细的组件迁移文档
- [Bifrost UI Kit 分析](./BIFROST_UI_KIT_ANALYSIS.md) - 原始技术分析
- [Wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [slpx-sdk](https://www.npmjs.com/package/slpx-sdk)

---

## 🎉 下一步

测试完成后，你可以：

1. **部署到测试网**
   ```bash
   pnpm build
   # 部署 dist 目录到 Vercel/Netlify
   ```

2. **添加更多功能**
   - 交易历史记录
   - 价格预言机集成
   - 多资产支持（DOT, GLMR 等）
   - APY 显示

3. **集成到主网**
   - 更新合约地址为主网地址
   - 配置主网 RPC
   - 添加安全审计

---

**需要帮助？** 查看控制台日志或在 GitHub 提 issue 🚀

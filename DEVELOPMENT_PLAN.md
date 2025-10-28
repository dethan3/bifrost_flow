# Bifrost Flow - Development Plan

## 技术架构设计

### 1. 架构分层

```
┌─────────────────────────────────────┐
│         App.tsx (Main)              │
│  - 整合所有模块                      │
│  - 全局布局                          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Components (UI Layer)          │
│  - Header (钱包连接状态)             │
│  - BalanceCard (资产展示)            │
│  - MintCard (质押操作)               │
│  - RedeemCard (赎回操作)             │
│  - TransactionToast (交易反馈)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Hooks (Logic Layer)           │
│  - useWallet (钱包连接)  ✅ 已完成    │
│  - useBifrost (链交互)               │
│  - useBalance (余额查询)             │
│  - useMint (质押交易)                │
│  - useRedeem (赎回交易)              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Store (State Layer)            │
│  - Zustand Global State             │
│    - account (钱包账户)              │
│    - balances (用户余额)             │
│    - txStatus (交易状态)             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   External APIs (Data Layer)        │
│  - @polkadot/api (Bifrost 链)       │
│  - @polkadot/extension-dapp (钱包)  │
└─────────────────────────────────────┘
```

---

## 2. 文件结构规划

### 需要创建的文件列表

#### Hooks (src/hooks/)
- [x] `useWallet.ts` - 钱包连接、断开、切换账户
- [ ] `useBifrost.ts` - 初始化 Bifrost API 连接
- [ ] `useBalance.ts` - 查询 DOT/vDOT 余额
- [ ] `useMint.ts` - 执行质押交易（DOT → vDOT）
- [ ] `useRedeem.ts` - 执行赎回交易（vDOT → DOT）

#### Components (src/components/)
- [ ] `Header.tsx` - 顶部导航栏，显示连接钱包按钮和账户信息
- [ ] `BalanceCard.tsx` - 显示 DOT 和 vDOT 余额
- [ ] `MintCard.tsx` - 质押操作界面（输入框 + 确认按钮）
- [ ] `RedeemCard.tsx` - 赎回操作界面（输入框 + 即时/延迟选择）
- [ ] `TransactionToast.tsx` - 交易状态通知（处理中/成功/失败）
- [ ] `ConnectWalletButton.tsx` - 可复用的连接钱包按钮

#### Utils (src/utils/)
- [ ] `formatBalance.ts` - 格式化代币余额（处理精度）
- [ ] `formatAddress.ts` - 格式化钱包地址（缩短显示）

#### Store (src/store/)
- [x] `index.ts` - 已有基础状态，需要扩展

---

## 3. 详细开发步骤

### Phase 1: 核心基础设施 (Foundation)

**目标**: 建立与 Bifrost 链的连接和基础工具

#### Step 1.1: 创建 `useBifrost.ts`
**职责**: 
- 初始化并维护 Bifrost API 实例
- 提供 API 实例给其他 hooks 使用
- 处理连接状态和错误

**输入**: RPC URL (from constants)
**输出**: 
```typescript
{
  api: ApiPromise | null,
  isConnected: boolean,
  isLoading: boolean,
  error: string | null
}
```

#### Step 1.2: 扩展 Zustand Store
**新增状态**:
```typescript
{
  balances: UserBalances | null,
  txStatus: TransactionStatus,
  setBalances: (balances: UserBalances) => void,
  setTxStatus: (status: TransactionStatus) => void,
}
```

#### Step 1.3: 创建工具函数
- `formatBalance(amount: string, decimals: number): string` - 格式化余额显示
- `formatAddress(address: string): string` - 地址缩短 (0x1234...5678)

---

### Phase 2: 数据查询层 (Data Layer)

**目标**: 实现余额查询功能

#### Step 2.1: 创建 `useBalance.ts`
**职责**:
- 订阅链上余额变化
- 自动刷新余额
- 格式化余额数据

**依赖**: `useBifrost`, `useWallet`
**输出**:
```typescript
{
  balances: UserBalances | null,
  isLoading: boolean,
  refetch: () => void
}
```

**实现要点**:
- 监听账户变化，自动重新订阅
- 同时查询 DOT 和 vDOT 余额
- 处理链未连接的情况

---

### Phase 3: 交易功能层 (Transaction Layer)

**目标**: 实现质押和赎回交易

#### Step 3.1: 创建 `useMint.ts`
**职责**:
- 构建质押交易
- 调用钱包签名
- 提交交易到链
- 更新交易状态

**输入**: `MintParams { amount: string, tokenSymbol: 'DOT' }`
**输出**:
```typescript
{
  mint: (params: MintParams) => Promise<void>,
  isLoading: boolean,
  error: string | null
}
```

#### Step 3.2: 创建 `useRedeem.ts`
**职责**:
- 支持即时赎回和标准赎回两种模式
- 构建赎回交易
- 处理签名和提交

**输入**: `RedeemParams { amount: string, isInstant: boolean }`
**输出**:
```typescript
{
  redeem: (params: RedeemParams) => Promise<void>,
  isLoading: boolean,
  error: string | null
}
```

---

### Phase 4: UI 组件层 (UI Layer)

**目标**: 构建用户界面

#### Step 4.1: 创建基础组件
1. **ConnectWalletButton.tsx**
   - 显示"Connect Wallet"或账户地址
   - 点击连接/断开钱包
   
2. **Header.tsx**
   - 顶部导航
   - 包含 Logo 和 ConnectWalletButton
   
3. **TransactionToast.tsx**
   - 显示交易状态（Pending/Success/Error）
   - 自动消失或手动关闭

#### Step 4.2: 创建功能组件
4. **BalanceCard.tsx**
   - 显示 DOT Available / vDOT Staked
   - 使用 `useBalance` hook
   - 实时更新

5. **MintCard.tsx**
   - 输入框：输入质押数量
   - 显示预计获得的 vDOT 数量
   - "Mint vDOT" 按钮
   - 使用 `useMint` hook

6. **RedeemCard.tsx**
   - 输入框：输入赎回数量
   - 两个选项卡：Instant / Standard
   - 显示每种方式的说明
   - "Redeem" 按钮
   - 使用 `useRedeem` hook

---

### Phase 5: 整合与优化 (Integration)

#### Step 5.1: 整合到 App.tsx
- 布局设计：Header + 主内容区
- 主内容区：BalanceCard + MintCard + RedeemCard
- 添加 TransactionToast
- 响应式布局（移动端适配）

#### Step 5.2: 样式优化
- 使用 Tailwind 实现现代化 UI
- 渐变背景
- 卡片阴影和毛玻璃效果
- 按钮悬停效果

#### Step 5.3: 错误处理
- 网络错误提示
- 交易失败反馈
- 余额不足提示

---

## 4. 开发优先级

### P0 (必须完成)
1. ✅ useWallet - 钱包连接
2. useBifrost - API 初始化
3. useBalance - 余额查询
4. useMint - 质押功能
5. useRedeem - 赎回功能（至少支持标准赎回）
6. Header + BalanceCard + MintCard + RedeemCard - 核心 UI

### P1 (如果时间允许)
7. 即时赎回功能完善
8. TransactionToast - 交易状态反馈
9. 价值估算（USD 显示）
10. 收益追踪器

---

## 5. 技术细节注意事项

### Bifrost vToken Minting
- 使用 `vtokenMinting.mint()` extrinsic
- 参数：token_id (DOT), amount
- 比例：1:1 (1 DOT → 1 vDOT，会随时间增值)

### Bifrost Redeem
- **标准赎回**: `vtokenMinting.redeem()` - 需要等待解绑期
- **即时赎回**: `vtokenMinting.redeemInstant()` - 需要支付手续费

### 余额查询
- DOT: `system.account()` 查询 native token
- vDOT: `tokens.accounts()` 查询 vToken (token_id 需要查询)

---

## 6. 当前状态

- [x] 项目初始化
- [x] 依赖安装
- [x] 类型定义和常量（英文）
- [x] useWallet Hook
- [ ] useBifrost Hook ← **下一步**
- [ ] 其他 hooks
- [ ] UI 组件
- [ ] 整合

---

## 7. 下一步行动

**立即执行**:
1. 基于 `bifrost-dev-kit` 示例梳理 `useMint`/`useRedeem` 的交易调用流程（签名、发送、状态追踪）
2. 设计交易状态提示（Toast/Modal）并与 `txStatus` 状态打通
3. 拆分 `TestDashboard` 为计划中的 UI 组件（Header、BalanceCard、MintCard、RedeemCard 等），为 Phase 4 做准备

**然后**:
4. 接入收益/估值等增强型数据源（REST/SubQuery），完善资产概览
5. 引入轻节点或私有 RPC 的配置选项，增强生产环境可用性
6. 完成整合与样式优化，准备演示版本

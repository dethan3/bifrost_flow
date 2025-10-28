# Phase 1 Testing Checklist

## 测试环境准备

### 必需条件
- [ ] 安装 Polkadot.js Extension (Chrome/Firefox)
  - 下载地址: https://polkadot.js.org/extension/
- [ ] 在扩展中创建或导入测试账户
- [ ] 确保有少量 DOT 用于测试（或使用 Bifrost 测试网）

---

## 功能测试清单

### 1. API 连接测试 ✅
**预期行为**:
- [x] 页面加载时自动连接 Bifrost Polkadot RPC
- [x] "Bifrost Network Status" 卡片显示 "✅ Connected"
- [x] 如果连接失败，显示错误信息

**测试步骤**:
1. 打开页面
2. 检查 "🔗 Bifrost Network Status" 部分
3. 确认状态为 "Connected" (绿色)

**当前状态**: 
- RPC URL: `wss://bifrost-polkadot.api.onfinality.io/public-ws`
- 使用 OnFinality 公共节点

---

### 2. 钱包连接测试 🔄
**预期行为**:
- [ ] 点击 "Connect Wallet" 按钮
- [ ] Polkadot.js 扩展弹出授权请求
- [ ] 授权后显示钱包地址（缩短格式）
- [ ] 显示账户名称（如果有）
- [ ] "Disconnect" 按钮可用

**测试步骤**:
1. 确保已安装 Polkadot.js Extension
2. 点击 "Connect Wallet" 按钮
3. 在弹出窗口中选择账户并授权
4. 验证地址显示正确（格式：`123abc...xyz789`）
5. 验证账户名称显示（如果设置了）
6. 点击 "Disconnect" 按钮验证断开功能

**可能的问题**:
- ❌ "No Polkadot extension found" → 需要安装扩展
- ❌ "No accounts found" → 需要在扩展中创建账户

---

### 3. 余额查询测试 🔄
**预期行为**:
- [ ] 连接钱包后自动查询余额
- [ ] 显示 DOT 余额（Available, Reserved, Total）
- [ ] 显示 vDOT 余额（Available, Reserved, Total）
- [ ] 余额实时更新（当发生转账时）

**测试步骤**:
1. 连接钱包后等待余额加载
2. 检查 "💰 Balances" 卡片
3. 验证 DOT 余额显示
4. 验证 vDOT 余额显示
5. 检查数字格式是否正确（小数点后 4 位）

**预期结果**:
- DOT: 显示原生代币余额
- vDOT: 如果未质押过，显示 "0.0000 vDOT"

---

## 控制台检查

### 打开浏览器开发者工具 (F12)

**检查项**:
1. **Network 标签**:
   - [ ] WebSocket 连接到 Bifrost RPC
   - [ ] 连接状态: "101 Switching Protocols" (成功)

2. **Console 标签**:
   - [ ] 无红色错误信息
   - [ ] 可能有正常的日志输出
   - [ ] 检查是否有 API 连接成功的日志

---

## 已知问题和限制

### 当前限制
1. **测试网 vs 主网**:
   - 当前连接到 Bifrost Polkadot 主网
   - 需要真实的 DOT 代币进行测试
   - 如需测试网，需要切换 RPC URL

2. **余额显示**:
   - vDOT 余额查询使用 `{ VToken: 'DOT' }` token ID
   - 如果链上 token ID 格式不同，可能显示 0

3. **性能**:
   - 使用公共 RPC 节点，可能有速率限制
   - 建议使用自己的节点或付费 API key

---

## 调试指南

### 如果 API 无法连接
1. 检查网络连接
2. 尝试访问: https://polkadot.js.org/apps/?rpc=wss://bifrost-polkadot.api.onfinality.io/public-ws
3. 如果官方页面也无法连接，说明节点问题

### 如果钱包无法连接
1. 确认已安装 Polkadot.js Extension
2. 检查扩展是否已启用
3. 刷新页面重试
4. 检查浏览器控制台错误信息

### 如果余额显示为 0 但实际有余额
1. 检查连接的是否是正确的网络
2. 检查账户地址是否正确
3. 刷新页面重新查询
4. 检查控制台是否有错误

---

## 测试完成标准

### Phase 1 功能验收
- [ ] ✅ Bifrost API 成功连接
- [ ] ✅ 钱包连接/断开正常
- [ ] ✅ 地址格式化显示正确
- [ ] ✅ DOT 余额查询成功
- [ ] ✅ vDOT 余额查询成功（有质押时）
- [ ] ✅ 余额实时更新（订阅功能）
- [ ] ✅ 错误处理正常显示

### 通过标准
所有核心功能（API、钱包、余额）至少能正常工作，无致命错误。

---

## 下一步

测试通过后，继续开发：
- **Phase 2**: 交易功能层（useMint, useRedeem）
- **Phase 3**: 完整 UI 组件
- **Phase 4**: 交易功能测试

测试失败则回到代码修复 bug。

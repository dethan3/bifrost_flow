import { useWallet } from '../hooks/useWallet'
import { useBifrost } from '../hooks/useBifrost'
import { useBalance } from '../hooks/useBalance'
import { formatBalance, formatSubstrateAddress } from '../utils'
import { UI_MESSAGES } from '../utils/constants'

export const TestDashboard = () => {
  const { account, isConnecting, error: walletError, connectWallet, disconnectWallet } = useWallet()
  const {
    isConnected,
    isConnecting: apiConnecting,
    error: apiError,
    endpoint: apiEndpoint,
  } = useBifrost()
  const { balances, isLoading: balancesLoading } = useBalance()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bifrost Flow</h1>
          <p className="text-gray-300">Phase 1 Functionality Test</p>
        </div>

        {/* API Status Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">🔗 Bifrost Network Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Connection:</span>
              <span className={`font-medium ${isConnected ? 'text-green-400' : apiConnecting ? 'text-yellow-400' : 'text-red-400'}`}>
                {isConnected ? '✅ Connected' : apiConnecting ? '⏳ Connecting...' : '❌ Disconnected'}
              </span>
            </div>
            {apiEndpoint && (
              <div className="flex items-center justify-between text-sm text-purple-200">
                <span>RPC Endpoint:</span>
                <span className="font-mono">{apiEndpoint}</span>
              </div>
            )}
            {apiError && (
              <div className="text-red-400 text-sm mt-2 p-2 bg-red-500/10 rounded">
                Error: {apiError}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">👛 Wallet</h2>
          
          {!account ? (
            <div className="space-y-3">
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isConnecting ? UI_MESSAGES.CONNECTING : UI_MESSAGES.CONNECT_WALLET}
              </button>
              {walletError && (
                <div className="text-red-400 text-sm p-2 bg-red-500/10 rounded">
                  {walletError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Account:</span>
                <span className="text-white font-mono">
                  {formatSubstrateAddress(account.address)}
                </span>
              </div>
              {account.name && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Name:</span>
                  <span className="text-white">{account.name}</span>
                </div>
              )}
              <button
                onClick={disconnectWallet}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {UI_MESSAGES.DISCONNECT}
              </button>
            </div>
          )}
        </div>

        {/* Balances Card */}
        {account && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">💰 Balances</h2>
            
            {balancesLoading ? (
              <div className="text-gray-300 text-center py-4">
                Loading balances...
              </div>
            ) : balances ? (
              <div className="space-y-4">
                {/* DOT Balance */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium text-white">DOT</span>
                    <span className="text-xs text-gray-400">Native Token</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available:</span>
                      <span className="text-white font-mono">
                        {formatBalance(balances.dot.free)} DOT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Reserved:</span>
                      <span className="text-gray-400 font-mono">
                        {formatBalance(balances.dot.reserved)} DOT
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-gray-300 font-medium">Total:</span>
                      <span className="text-white font-mono font-medium">
                        {formatBalance(balances.dot.total)} DOT
                      </span>
                    </div>
                  </div>
                </div>

                {/* vDOT Balance */}
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium text-white">vDOT</span>
                    <span className="text-xs text-purple-300">Liquid Staking Token</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available:</span>
                      <span className="text-white font-mono">
                        {formatBalance(balances.vdot.free)} vDOT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Reserved:</span>
                      <span className="text-gray-400 font-mono">
                        {formatBalance(balances.vdot.reserved)} vDOT
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-500/20">
                      <span className="text-gray-300 font-medium">Total:</span>
                      <span className="text-purple-300 font-mono font-medium">
                        {formatBalance(balances.vdot.total)} vDOT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                No balance data available
              </div>
            )}
          </div>
        )}

        {/* Status Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>Phase 1: Core Infrastructure Testing</p>
          <p className="mt-1">✅ API Connection • ✅ Wallet Integration • ✅ Balance Queries</p>
        </div>
      </div>
    </div>
  )
}

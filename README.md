# Bifrost Flow

High-fidelity demo of a liquid-staking cockpit for the Bifrost ecosystem on Polkadot.

## Overview

Bifrost Flow reimagines the liquid staking journey with a cinematic interface and guided flows. The project aims to reduce the learning curve for Web3 newcomers while showcasing how vDOT minting and redemption can feel effortless.

### Why it matters
- **Onboarding first** – the layout focuses on the connect → stake → manage loop with minimal distractions.
- **Production-ready primitives** – hooks, store, and connection manager mirror how a full app would integrate with Bifrost APIs and Polkadot extensions.
- **Design-forward** – gradients, glassmorphism, and responsive cards set the tone for a flagship experience.

## Feature Highlights
- Connect to any Substrate-compatible wallet via `@polkadot/extension-dapp`.
- Live network health pill driven by a resilient RPC connection manager with automatic endpoint failover.
- Portfolio dashboard for DOT and vDOT balances, wired to on-chain subscriptions.
- Guided mint (DOT → vDOT) and redeem (vDOT → DOT) flows with quick presets, validation, and animated feedback.
- Transaction toast system powered by the global store to surface pending/success/error states and hashes.

## Tech Stack
- **Framework** – React 19, Vite 7, TypeScript 5.9
- **Styling** – Tailwind CSS with custom glassmorphism and gradient utilities
- **State** – Zustand store for wallet, API, balance, and transaction status
- **Polkadot SDK** – `@polkadot/api` for chain calls, `@polkadot/extension-dapp` for signer access
- **Tooling** – pnpm, ESLint (flat config), PostCSS, Tailwind IntelliSense-friendly structure


## Getting Started

### Prerequisites
- Node.js ≥ 18 (LTS recommended)
- pnpm ≥ 9
- A Chromium/Firefox browser with the Polkadot.js extension for end-to-end testing

### Installation & scripts

```bash
pnpm install         # Install dependencies
pnpm dev             # Launch Vite dev server
pnpm lint            # Run ESLint
pnpm build           # Type-check + production build
pnpm preview         # Serve the production bundle
```

### Environment configuration
- The connection manager rotates across public Bifrost RPC endpoints by default.
- Switch between environments by setting `VITE_BIFROST_NETWORK` to `mainnet` (default) or `testnet` (Rococo).
- To pin a custom endpoint (private node or staging cluster), add `VITE_BIFROST_RPC` to `.env`:

  ```bash
  VITE_BIFROST_NETWORK=testnet
  VITE_BIFROST_RPC=wss://your-bifrost-endpoint/ws
  ```

  Remove `VITE_BIFROST_RPC` to fall back to the bundled round-robin list.

## Testing Notes
- The flows rely on live chain data. Westend or Bifrost testnets are ideal for rehearsing the mint/redeem lifecycle without risking real DOT. On mainnet you must keep ≥1 DOT as the existential deposit while covering transaction fees.
- Testnet quick start:
  1. Create a `.env` file with `VITE_BIFROST_NETWORK=testnet` and optionally override `VITE_BIFROST_RPC`.
  2. Restart `pnpm dev` so Vite picks up the new environment variables.
  3. Switch your Polkadot.js extension to Rococo and request test assets from a Bifrost faucet or the Westend/Rococo faucet channels.
  4. Connect the wallet and walk through mint/redeem to validate the full staking loop.

## Roadmap Ideas
- Adaptive layout optimizations for smaller screens
- Toast-to-history escalation (persist recent transactions)
- USD valuation overlays via price oracles
- Deeper analytics (reward accumulation, APY insights)

## License

MIT

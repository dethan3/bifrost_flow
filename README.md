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
- To pin a custom endpoint (e.g., private node or testing network), create a `.env` file and set:

  ```bash
  VITE_BIFROST_RPC=wss://your-bifrost-endpoint/ws
  ```

  Removing the variable restores the round-robin strategy.

## Testing Notes
- The flows rely on live chain data. Consult `TESTING_CHECKLIST.md` for recommended manual scenarios.
- Westend or Bifrost testnets are ideal for rehearsing the mint/redeem lifecycle without risking real DOT. On mainnet you must keep ≥1 DOT as the existential deposit while covering transaction fees.

## Roadmap Ideas
- Adaptive layout optimizations for smaller screens
- Toast-to-history escalation (persist recent transactions)
- USD valuation overlays via price oracles
- Deeper analytics (reward accumulation, APY insights)

## License

MIT

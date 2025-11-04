# Bifrost Flow

Immersive, production-ready reference implementation of Bifrost’s liquid staking experience across EVM testnets and the Bifrost Polkadot network.

## Table of Contents
- [Bifrost Flow](#bifrost-flow)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
  - [Configuration](#configuration)
  - [Available Scripts](#available-scripts)
  - [Project Structure](#project-structure)
  - [Testing Notes](#testing-notes)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

Bifrost Flow demonstrates how staking UX can stay cinematic while remaining production-focused. The app connects to RainbowKit-enabled EVM wallets, orchestrates vETH mint/redeem flows through `slpx-sdk`, and continuously monitors the Bifrost Polkadot network via a resilient RPC manager. The result is a single-page cockpit that keeps newcomers oriented without sacrificing the needs of power users.

## Key Features

- **Wallet onboarding that just works** – RainbowKit + WalletConnect power a custom connect button with MetaMask, Rainbow, Coinbase (via WalletConnect), and more.
- **Multi-testnet support out of the box** – Ships with Arbitrum Sepolia and Ethereum Sepolia chains, plus per-chain RPC overrides for demos or private infra.
- **Guided staking flows** – Mint (ETH → vETH) and redeem (vETH → ETH) panels reuse shared validation, quick-percentage presets, exchange-rate previews, and success toasts.
- **Real-time portfolio insights** – Balance cards stream native ETH, vETH, and estimated rewards with a single refresh that refetches native and ERC-20 contracts.
- **Polkadot telemetry integration** – A connection manager rotates through curated Bifrost RPC endpoints, exposing connection state, endpoint, and errors through the app store.
- **Robust state layer** – Zustand keeps wallet, API, balances, and transaction status in sync, while TanStack Query handles contract reads with smart caching.
- **Design-forward UI kit** – Tailwind CSS, glassmorphism, and gradient utilities give the experience a showroom finish without locking developers into a design system.

## Architecture

- **UI & Routing** – React 19 + Vite 7 single page app backed by TypeScript strict typing and atomic components.
- **Wallet & Chain Access** – Wagmi + RainbowKit for EVM connectivity, `slpx-sdk` for contract parameter generation, and `viem` utilities for formatting.
- **Substrate Connectivity** – `@polkadot/api` and a custom `BifrostConnectionManager` provide automatic failover and reconnection logic for RPC endpoints.
- **State & Data** – Zustand global store for session state, TanStack Query (`@tanstack/react-query`) for asynchronous caching, and dedicated hooks for mint, redeem, balances, and network telemetry.
- **Styling** – Tailwind CSS with project-specific layers, responsive layout tokens, and thoughtful motion states.
- **Tooling & Quality** – pnpm workbench, ESLint flat config, and TypeScript project references keep the project linted and type-safe.

## Getting Started

### Prerequisites
- Node.js ≥ 18 (LTS recommended)
- pnpm ≥ 9
- Recommended: a Chromium/Firefox browser with an injected EVM wallet (MetaMask, Coinbase, etc.)

### Quick Start
```bash
pnpm install
pnpm dev
```

Visit `http://localhost:5173` and connect an EVM wallet through the custom RainbowKit button.

> ℹ️ Copy `.env.example` to `.env.local`, then add your WalletConnect Project ID before starting the dev server.

## Configuration

| Variable | Purpose | Default/Notes |
| --- | --- | --- |
| `VITE_APP_NAME` | App name shared with wallet prompts | `"Bifrost Flow"` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect v2 project identifier used by RainbowKit | Required. Generate one at WalletConnect Cloud and place it in `.env.local`. |
| `VITE_RPC_URL_ARBITRUM_SEPOLIA` | Optional custom RPC endpoint for Arbitrum Sepolia | Defaults to RainbowKit public RPC when unset |
| `VITE_RPC_URL_SEPOLIA` | Optional custom RPC endpoint for Ethereum Sepolia | Defaults to RainbowKit public RPC when unset |
| `VITE_BIFROST_NETWORK` | Selects `mainnet` (Polkadot) or `testnet` (Rococo) for Substrate telemetry | `mainnet` |
| `VITE_BIFROST_RPC` | Overrides the first Bifrost RPC endpoint in the rotation | Optional |

Additional environment variables can be placed in `.env`, `.env.local`, or direct shell exports. Restart `pnpm dev` after changing values so Vite reloads them.

## Available Scripts

```bash
pnpm dev       # Launch the Vite dev server with hot module reload
pnpm build     # Type-check and produce a production bundle
pnpm preview   # Serve the build output locally for smoke tests
pnpm lint      # Run ESLint across the codebase
```

## Project Structure

```
src/
  components/        # Presentational and container components (forms, cards, header, toasts)
  config/            # Chain definitions, ABIs, RainbowKit/wagmi configuration
  hooks/             # Business logic hooks for balances, mint, redeem, and network connectivity
  services/          # Bifrost RPC connection manager with failover and reconnection logic
  store/             # Zustand global store definitions
  utils/             # Constants, helper enums, and shared UI messages
  main.tsx           # Application bootstrap (React, RainbowKit, Wagmi, React Query)
  App.tsx            # Root layout and primary sections
```

## Testing Notes

- **EVM testnets** – Minting and redeeming rely on `slpx-sdk` and are configured for Arbitrum Sepolia and Ethereum Sepolia test contracts. Fund your wallet with faucet ETH before running a flow.
- **Substrate telemetry** – The dashboard status pill surfaces connection state from the Bifrost RPC manager. Switch between mainnet and Rococo by updating `VITE_BIFROST_NETWORK`.
- **Verifying flows**:
  1. Start `pnpm dev` with a valid WalletConnect project ID.
  2. Connect your wallet and ensure the chain matches one of the supported testnets.
  3. Use the mint panel presets or manual input to submit a transaction, then observe status toasts and refreshed balances.
  4. Switch to the redeem tab and validate allowance + redemption execution.

## Contributing

Issues and pull requests are welcome. When opening a PR:
- Keep UI changes responsive and audit them across light/dark backgrounds.
- Include context on which network(s) were used for manual verification.
- Run `pnpm lint` and, if relevant, explain any deviations or skipped tests.

## License

MIT

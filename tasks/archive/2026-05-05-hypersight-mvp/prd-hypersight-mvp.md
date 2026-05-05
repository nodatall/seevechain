# Hypersight MVP PRD

## Plain-Language Summary

Hypersight will show live Hyperliquid public trades. It will not trade, sign messages, use private keys, or show private wallet activity.

The app should keep the existing real-time visualizer shape where it helps: a Node server, Socket.IO updates, Postgres storage, and a browser UI that moves as market activity arrives.

The first version is done when BTC, ETH, SOL, and HYPE trades stream into the database, update the screen without refresh, and replace all visible VeChain wording with Hyperliquid market language. Stats are based on trades Hypersight has observed and stored; the UI must show that coverage clearly until a full 24 hours has been collected.

## Target User / Audience

The target user is a public-market observer who wants a live, visual view of Hyperliquid trade flow across a small default set of markets. They are not trying to connect a wallet, place orders, or manage account-private trading data.

## Problem Statement

The cloned app is a VeChain blockchain visualizer. Its product concepts are blocks, clauses, contracts, VTHO burn, and blockchain transaction details. Hypersight needs to reuse the useful real-time shell while changing the product to a Hyperliquid public trade visualizer.

## Current-State / Product Diagnosis

The current UI and server speak VeChain throughout the visible experience. The app starts from block processing, contract ranking, daily burn charts, VeChain asset labels, blockchain explorer links, and a visitor cookie named for SeeVeChain. Those concepts do not map cleanly to Hyperliquid trades and should be replaced or bypassed instead of preserved as renamed internals.

The useful existing product shell is the live visualizer pattern: a server receives data, stores/cache-processes it, pushes Socket.IO events, and the client animates recent activity.

## Product Goal

Build Hypersight as an MVP real-time Hyperliquid public trade visualizer.

## Success Criteria

- The app starts locally as Hypersight.
- The server connects to Hyperliquid mainnet WebSocket public market data.
- The server subscribes to BTC, ETH, SOL, and HYPE trades by default.
- Public trades persist without duplicate primary-key errors.
- The frontend updates live without page refresh.
- The UI shows latest trades and top markets by observed stored-window notional volume, with clear coverage metadata and gap status so it never implies complete external 24-hour coverage when the app was offline.
- Visible UI contains no VeChain, VET, VTHO, block, clause, gas, burn, contract-ranking, origin, delegator, or reverted transaction terminology.
- The codebase does not contain private-key, signing, order placement, wallet-private trading, or authenticated exchange-action behavior.

## Explicit Non-Goals

- No order placement.
- No private keys.
- No signing.
- No authenticated Hyperliquid exchange actions.
- No wallet-private fills or account streams in the MVP.
- No order book, candle, funding, or wallet read-only features in the first pass.
- No dependency on HyperTracker or `HYPERTRACKER_API_TOKEN` for MVP behavior.
- No historical backfill requirement beyond retaining recent trades that arrive while the app is running.

## User Stories or Primary User Outcomes

- As a market observer, I can open Hypersight and see current Hyperliquid trade activity for BTC, ETH, SOL, and HYPE.
- As a market observer, I can see which configured markets are most active by observed stored-window volume and trade count.
- As a market observer, I can inspect a live trade tape with coin, normalized buy/sell side, price, size, notional, and time.
- As a market observer, I can switch the visual focus between configured coins without changing the public-data subscription model.
- As an operator, I can configure the default coins and retention period through environment variables.

## Functional Requirements

- FR-001: The app must be named and branded Hypersight in package metadata, docs, and visible UI.
- FR-002: The server must connect to `wss://api.hyperliquid.xyz/ws` unless `HYPERLIQUID_WS_URL` overrides it.
- FR-003: The server must subscribe to public trades for configured coins, defaulting to `BTC,ETH,SOL,HYPE`.
- FR-004: The server must use one WebSocket connection for all configured trade subscriptions.
- FR-005: Incoming Hyperliquid trades must normalize into a stable internal trade shape with coin, tid, timeMs, normalized side, raw side, price, size, notional, hash, internal-only buyer/seller values derived from `users`, and raw payload.
- FR-006: Recent trades must persist in Postgres with duplicate protection based on coin, timeMs, and tid.
- FR-007: The server must compute and expose observed rolling market stats for up-to-24h notional volume, trade count, buy notional, sell notional, imbalance, latest price, recent trades, and stats coverage age/window metadata.
- FR-008: The server must emit live normalized trade batches through Socket.IO as `serverSendTrades`.
- FR-009: The server must emit market stats through Socket.IO as `serverSendMarketStats`.
- FR-009a: The server must emit current ingestion status through Socket.IO as `serverSendConnectionStatus`.
- FR-010: The server must provide API endpoints for health, markets, recent trades, and market stats.
- FR-010a: Configured coins must be visible through `/api/markets` and the coin selector on a fresh database.
- FR-011: The frontend must show live trade activity, a trade tape, a market stats panel, top markets, and a coin selector.
- FR-012: The frontend must map trade side and notional into visible motion or emphasis without claiming to show wallet-private behavior.
- FR-013: The app must avoid all trading, signing, private-key, order-placement, and authenticated exchange-action flows.
- FR-014: The README and env example must document Hypersight setup, env vars, local database setup, and troubleshooting.

## Acceptance Criteria

- AC-001 maps to FR-001: `package.json`, README, page metadata, and visible UI use Hypersight naming.
- AC-002 maps to FR-002 through FR-004: starting the app opens one Hyperliquid WebSocket and subscribes to all configured default coins.
- AC-003 maps to FR-005 and FR-006: a sample trade payload normalizes correctly, persists internal buyer/seller fields only server-side, and inserts without duplicate primary-key crashes when replayed.
- AC-004 maps to FR-007 through FR-010a: `/api/health`, `/api/markets`, `/api/trades`, and `/api/market_stats` return useful JSON from the new public-market model, including observed-window coverage and gap metadata for stats and default markets on a fresh database.
- AC-005 maps to FR-008 through FR-009a: a connected frontend receives `serverSendTrades`, `serverSendMarketStats`, and `serverSendConnectionStatus` without refresh.
- AC-006 maps to FR-011 and FR-012: the first screen shows live activity, top markets, stats, and the latest trades using market terminology.
- AC-007 maps to FR-013: code search finds no private-key, signing, or order-placement path added by the MVP.
- AC-008 maps to FR-014: README setup works for a local Postgres database named `hypersight`.

## Product Rules / UX Rules / Content Rules

- Replace "latest block" with "latest trade batch" or "live market activity."
- Replace "top contracts" with "top markets."
- Replace "daily burn stats" with observed rolling volume, trade count, buy/sell notional, imbalance, and coverage age/window labels.
- Use public market data language only.
- Do not show wallet connection, wallet address entry, private fills, orders, or account controls in the MVP.
- Do not render buyer, seller, or `users` addresses in the UI.
- Do not include buyer, seller, or `users` values in public REST or Socket.IO response payloads; those values are internal persistence/raw-ingestion data only.
- Display and stats should treat Hyperliquid raw side `B` as buy/bid-aggressor and raw side `A` as sell/ask-aggressor.
- Keep the app first screen as the usable visualization, not a marketing landing page.
- Preserve the lively visualization feel, but make it about trade flow rather than blockchain transaction inspection.

## Constraints and Defaults

- Default product name: Hypersight.
- Default database name: `hypersight`.
- Default coins: `BTC,ETH,SOL,HYPE`.
- Configured coins are the MVP source of truth for market availability; the database may store display/enabled metadata but must be reconciled from config on startup or migration.
- Default trade retention: 48 hours.
- Default server port: 1337.
- HyperTracker token may exist in `.env`, but MVP behavior must not depend on it or expose it to the client.
- Hyperliquid WebSocket limits must be respected by using one connection and bounded subscription sends.
- The first pass may preserve old VeChain tables if removing them creates migration risk, but runtime and visible UI should use the new Hyperliquid tables and flows.
- Public stats labels must not imply a complete external 24h market-data source when Hypersight has not stored 24 hours of observed trades or when feed status events show known downtime/stale gaps.

## Success Metrics / Guardrails

- Trades keep arriving after temporary WebSocket disconnects and reconnects.
- Duplicate trade messages do not crash persistence.
- Market stats refresh from the database, agree with recent stored trades, and disclose the observed coverage window.
- The UI remains useful with no trades yet by showing empty states and connection status.
- Search confirms no visible VeChain terminology remains in the client-rendered experience.
- Search confirms no private trading behavior was introduced.
- Search and bundle checks confirm server-only env values such as `HYPERTRACKER_API_TOKEN` are not exposed to the client.

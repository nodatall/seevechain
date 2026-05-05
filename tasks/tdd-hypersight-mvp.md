# Hypersight MVP TDD

## Plain-Language Summary

Hypersight will listen to public Hyperliquid trades and save them. The server will clean each trade into one common shape before sending it to the browser.

Postgres will store recent trades, feed status events, and cached market stats. Socket.IO will keep the browser updated as new trade batches arrive. Market stats are based on the stored trades Hypersight has observed, so the payload and UI must show coverage age/window and known gap metadata instead of implying complete external market coverage.

The work is a public-data cutover. It must not add wallets, private keys, signing, account-private data, or exchange actions.

## Technical Summary

The app will keep the Express, Socket.IO, db-migrate, pg-promise, and Webpack/Preact shell initially. It will replace the VeChain runtime path with a Hyperliquid WebSocket service, Hyperliquid trade persistence commands, market-stat cache processing, new API actions/routes, and a redesigned client state/rendering flow.

The repo currently targets Node 12.16.3 and includes `node-sass@4`, VeChain Connex dependencies, `thor-devkit`, and VeChain block processors. The MVP should move package metadata and local scripts to modern Node LTS behavior, remove VeChain-only dependencies when no longer referenced, and use `ws` for the public WebSocket client. If the existing frontend stack breaks under modern Node, the first implementation choice should be the smallest dependency cleanup that restores local install/build rather than a full framework rewrite.

## Scope Alignment to PRD

This design supports FR-001 through FR-014 by replacing the source data, persistence model, server events, API actions, and visible UI vocabulary. It intentionally excludes order books, candles, wallet fills, funding, user-specific streams, HyperTracker enrichment, authenticated APIs, order placement, signing, and private-key handling.

## Current Technical Diagnosis

The current server entrypoint is `scripts/start`, which imports `subscribeToVechainBlocks` from `server/lib/connex` and starts `server/app`. `server/app.js` creates Express and Socket.IO, serves `client/dist`, mounts `server/routes.js`, and schedules an old production cleanup command for blocks. `server/routes.js` records SeeVeChain visitors, exposes visitor analytics, serves the frontend catch-all, and handles `clientAskForLatest` by emitting `serverSendLatest` and `serverSendTopContracts`.

The current server commands are block/transaction oriented: `processLatestBlock`, `processTopContracts`, `saveBlock`, `saveTransaction`, `saveDailyStats`, and `saveCache`. Existing queries are cache/analytics oriented. Existing migrations create `blocks`, `transactions`, `clauses`, `daily_stats`, `unique_visitors`, and `caches`.

The current frontend main flow is in `client/Main.js` and `client/components/Visualizer`. It receives old Socket.IO events, stores `currentBlock`, renders block number, transaction components, top contracts charts, burn charts, and PageModal routes for burn/contract pages. The asset and helper surface contains VeChain-specific known-address and contract-grouping logic.

Validation surface: `package.json` has `test` as a failing placeholder, `build`, `build:dev`, `start`, `start:dev`, and `db:migrate`. There is an ESLint config but no working lint script. There is a Mocha test dependency and one example spec under `server/test`, but no useful test command. The plan must add basic test coverage and a runnable test script before relying on tests as final evidence.

## Architecture / Approach

Runtime flow:

1. `scripts/start` loads `server/app`, starts the HTTP server, and starts the Hyperliquid public trade service.
2. `server/services/hyperliquidWs.js` owns one WebSocket connection, configured coins, subscribe messages, message parsing, normalization, reconnect, and resubscribe. It emits trade events and status/gap events; it does not write directly to Postgres.
3. On normalized `trades` events, the server calls `saveTrades`, updates market stats on a bounded cadence, and emits `serverSendTrades` to Socket.IO clients.
4. On feed connection, disconnect, stale, reconnect, and known gap events, the app/command layer persists lightweight feed status events and emits `serverSendConnectionStatus`.
5. Market stats come from Postgres through `processMarketStats`, are cached under `marketStats`, and are emitted through `serverSendMarketStats` with observed-window coverage and known-gap metadata.
6. New actions read latest trades, markets, and cached stats for Socket.IO bootstrap and REST API endpoints.
7. The client owns live rendering state: selected coin, enabled coins, live trades, market stats, and connection status.

The Hyperliquid service should be event-emitter based so app startup, tests, and future processors can subscribe without coupling directly to WebSocket internals.

## System Boundaries / Source of Truth

- Hyperliquid public WebSocket is the source of truth for incoming live public trades.
- Postgres `trades` is the source of truth for persisted recent trade history and rolling stat queries.
- Postgres `feed_status_events` is the source of truth for known connection sessions, stale periods, disconnects, reconnects, and observed-feed gaps. Stats coverage must derive known gap state from these events rather than only from oldest/newest trade timestamps.
- `market_stats_cache` is an optimization/cache, not the source of truth.
- `HYPERLIQUID_COINS` is the MVP source of truth for available market subscriptions. Startup or migration reconciliation must upsert configured coins into `markets`; `/api/markets`, Socket.IO bootstrap, and the coin selector must return the reconciled configured/enabled set even on a fresh database.
- Client state is display state only. It must not create trades, infer missing trades as persisted, or claim private account activity.
- Buyer/seller values from Hyperliquid `users` are internal ingestion/persistence fields only. Public REST responses, Socket.IO payloads, and rendered UI must not include buyer, seller, or `users` address values.
- `.env` may contain `HYPERTRACKER_API_TOKEN`, but the MVP must not read or use it for runtime behavior.
- The codebase must not add private-key material, signing functions, order endpoints, authenticated trading clients, or order placement commands.

## Dependencies

Keep where practical:

- `express`
- `socket.io`
- `socket.io-client`
- `pg-promise`
- `db-migrate` and `db-migrate-pg`
- `knex` only for SQL string building where existing patterns remain useful
- Preact/Webpack client stack for the MVP

Add:

- `ws` for the Hyperliquid WebSocket client

Remove after replacement work proves no active runtime, client, or test imports remain:

- `@vechain/connex-framework`
- `@vechain/connex.driver-nodejs`
- `thor-devkit`
- VeChain helper modules that are no longer imported by runtime/client code

Node target:

- Update `.node-version`, package engines, and docs to modern LTS, defaulting to Node 20.

## Route / API / Public Interface Changes

Socket.IO client request:

- `clientAskForLatest`: server emits latest market stats and latest trades.

Socket.IO server events:

- `serverSendTrades`: `{ trades, receivedAt }`, where each public trade omits buyer, seller, and `users`
- `serverSendMarketStats`: market stats payload from cache/processor
- `serverSendConnectionStatus`: `{ status, connected, reconnecting, stale, gapAffected, coins, updatedAt }`

REST endpoints:

- `GET /api/health`: returns server status, configured coins, and the current ingestion status snapshot matching `serverSendConnectionStatus` fields.
- `GET /api/markets`: returns the reconciled configured/enabled markets, seeded from `HYPERLIQUID_COINS` on startup or migration.
- `GET /api/trades?coin=BTC&limit=100`: returns latest public trade fields, optionally filtered by coin, without buyer/seller/users address values.
- `GET /api/market_stats`: returns cached or freshly computed observed-window market stats plus coverage and known-gap metadata.

Legacy events to remove from active frontend flow:

- `serverSendLatest`
- `serverSendTopContracts`

## Data Model / Schema / Storage Changes

Add new migration for MVP tables:

```sql
CREATE TABLE markets (
  coin text PRIMARY KEY,
  display_name text,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE trades (
  coin text NOT NULL,
  tid bigint NOT NULL,
  time_ms bigint NOT NULL,
  side text NOT NULL,
  raw_side text,
  price numeric NOT NULL,
  size numeric NOT NULL,
  notional numeric NOT NULL,
  hash text,
  buyer text,
  seller text,
  raw jsonb,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (coin, time_ms, tid)
);

CREATE TABLE market_stats_cache (
  cache_name text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE feed_status_events (
  id bigserial PRIMARY KEY,
  event_type text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
```

Indexes:

- `trades (time_ms desc)`
- `trades (coin, time_ms desc)`
- `trades (coin, side, time_ms desc)`
- `feed_status_events (started_at desc)`
- `feed_status_events (event_type, started_at desc)`

Old VeChain tables may remain unused for MVP safety. If a fresh Hypersight database is created, old migrations will still create old tables unless implementation chooses a safe migration reset. Runtime code must use the new tables.

## Technical Requirements

- TDR-001: Startup must initialize one Hyperliquid WebSocket service for all configured public trade subscriptions.
- TDR-002: Config must read `HYPERLIQUID_WS_URL`, `HYPERLIQUID_COINS`, `TRADE_RETENTION_HOURS`, `DATABASE_URL`, `PORT`, and `NODE_ENV` with documented and implemented defaults: `PORT=1337`, `HYPERLIQUID_WS_URL=wss://api.hyperliquid.xyz/ws`, `HYPERLIQUID_COINS=BTC,ETH,SOL,HYPE`, and `TRADE_RETENTION_HOURS=48`. `HYPERLIQUID_INFO_URL` is deferred until a concrete Info API consumer is added.
- TDR-003: Subscription messages must follow Hyperliquid shape: `{ "method": "subscribe", "subscription": { "type": "trades", "coin": "<COIN>" } }`.
- TDR-004: The WebSocket parser must treat pure `subscriptionResponse` acknowledgements as status-only, but any `trades` channel payload, including reconnect/snapshot-style trade arrays when present, must enter the same normalization and deduped persistence path.
- TDR-005: Trade normalization must preserve decimal strings for DB numeric insertion where possible, avoid using floating point for persisted numeric values, preserve raw side, and normalize Hyperliquid side `B` to buy/bid-aggressor and `A` to sell/ask-aggressor.
- TDR-006: Trade uniqueness must be enforced by `(coin, time_ms, tid)`.
- TDR-007: Persistence must batch insert and use `ON CONFLICT (coin, time_ms, tid) DO NOTHING`.
- TDR-008: Reconnect must use exponential backoff, heartbeat/liveness tracking, stale-feed detection, and resubscribe to all configured feeds on open.
- TDR-008a: The WebSocket service must emit lightweight status/gap events for connection open, disconnect, stale, reconnect, and known gap periods; app/command wiring must persist those events to `feed_status_events`.
- TDR-009: Market stats must compute observed up-to-24h trade count, notional volume, buy notional, sell notional, imbalance, latest price, latest global trades, per-coin summaries, coverage age/window metadata, and known gap status from `feed_status_events`.
- TDR-010: Socket.IO emission must send normalized trades quickly and market stats on a bounded cadence to avoid excessive database work during bursts.
- TDR-010a: Socket.IO emission must send `serverSendConnectionStatus` on initial client bootstrap and whenever ingestion status changes.
- TDR-011: API endpoints must read from the new actions and not from old block/top-contract cache actions.
- TDR-011a: Market actions must reconcile configured coins into `markets` and return configured/enabled default markets on fresh databases.
- TDR-012: Frontend state and components must use trade/market terminology, must not import VeChain known-address or contract-grouping helpers, and must not render buyer/seller/users address values.
- TDR-013: Tests must cover trade normalization, public payload sanitization, duplicate-key behavior or SQL shape, stats processing with seeded trades, WebSocket message parsing with mocked messages, and heartbeat/stale connection behavior.
- TDR-014: Final validation must include build/test commands, API health check where local DB is available, and browser/visual inspection for frontend work where practical.
- TDR-015: Runtime must not use `HYPERTRACKER_API_TOKEN`, private keys, signing libraries, wallet APIs, or order endpoints; frontend bundling must use an explicit public env allowlist and must not include server-only env names or values.

## Ingestion / Backfill / Migration / Rollout Plan

Rollout for MVP is local-first:

1. Update dependencies and Node target enough for install, tests, and build to run on modern Node; add `ws` and bootstrap tests without removing VeChain-only packages until active imports have been replaced.
2. Add Hyperliquid tables through db-migrate.
3. Add the WebSocket service and test normalization/parser behavior.
4. Wire persistence, stats, API, and Socket.IO events.
5. Replace frontend flow and visible terminology.
6. Update docs and env example.

No historical backfill is required. Trade history begins when the app runs. Old VeChain tables may be left in place but should not power Hypersight.

## Failure Modes / Recovery / Rollback

- WebSocket disconnect: service emits disconnected status, schedules exponential backoff reconnect, and resubscribes on open.
- WebSocket quiet or half-open state: service sends periodic ping, tracks pong and last message timestamps, marks stale status after a bounded interval, closes/reconnects, and resubscribes on the next open.
- Reconnect with missed data: pure subscription acknowledgements update status only, but any reconnect-delivered trade array must be processed through the same normalizer and `ON CONFLICT DO NOTHING` persistence path. If the reconnect does not provide recoverable trade data for a gap, connection/status and stats coverage metadata must mark the observed window as gap-affected through `feed_status_events` instead of implying continuous coverage.
- Process restart/offline period: startup records a new feed session; if the prior session did not end cleanly or the app was offline long enough to create a known observation gap, the server records a gap/stale event so stats do not claim continuous observed coverage.
- Duplicate trade: DB insert ignores conflict and continues.
- Bad or unknown message shape: parser logs/ignores without crashing the service.
- Missing database: server health should expose DB failure or startup logs should make it clear; docs should tell the operator to create `hypersight` and set `DATABASE_URL`.
- Missing or invalid `HYPERLIQUID_COINS`: default to `BTC,ETH,SOL,HYPE` after trimming empty entries.
- Missing `PORT` or `TRADE_RETENTION_HOURS`: runtime defaults to port 1337 and 48-hour retention, matching README and `.env.example`.
- Fresh `markets` table: startup or migration reconciliation upserts configured coins before `/api/markets` and Socket.IO bootstrap read markets.
- Market stats cache missing: action may compute stats from DB or return an empty default shape.
- Reverting the feature branch restores old SeeVeChain behavior because old migrations/tables can remain; no destructive migration rollback is required for the MVP.

## Operational Readiness

- Use one WebSocket connection to stay below Hyperliquid connection limits.
- Send only one subscribe message per configured coin on open/reconnect.
- Maintain minimal heartbeat/liveness behavior with periodic ping, pong/last-message tracking, stale connection status, and reconnect on stale close.
- Persist feed status events cheaply; do not add historical backfill or Info API gap filling in the MVP.
- Keep market-stat recomputation bounded, for example debounced/throttled around trade bursts plus initial client request.
- Prune old trades by `TRADE_RETENTION_HOURS` through a scheduled command or startup interval.
- Keep secrets server-side; replace broad frontend `.env` injection with an explicit allowlist for public client values only.
- Include a built-bundle sentinel check when `.env` contains a token-like value, and always search built client assets for forbidden server-only env names.
- Document that WebSocket reconnects are expected periodically.

## Verification and Test Strategy

Bootstrap test script:

- Replace the placeholder `npm test` with a Mocha command that runs server tests.

Targeted automated checks:

- Unit test trade normalizer with sample Hyperliquid trade payload.
- Unit test side mapping for raw `B` and `A`, including buy/sell notional buckets and imbalance direction.
- Unit test public payload shaping so buyer, seller, and `users` are not emitted through REST/Socket.IO payload builders.
- Unit test single-trade, array-trade, and reconnect/snapshot-style trade message parsing.
- Unit test heartbeat/stale connection behavior with a mocked socket or injectable timer/socket boundary.
- Unit test that the WebSocket service emits, rather than persists, status/gap events.
- Unit test dedupe identity by checking normalized key fields and save SQL conflict handling where practical.
- Unit/integration-style test market stats with seeded disposable rows or a DB-client stub where the repo pattern supports it, including observed coverage metadata and known gap status from feed status events.
- Unit/integration-style test discontinuous feed events so a stored trade span over 24 hours does not claim continuous coverage when a gap event falls inside the window.
- Unit/integration-style test `/api/health` and Socket.IO/bootstrap payload shape include the required connection status fields.
- Unit/integration-style test that a fresh DB plus default `HYPERLIQUID_COINS` returns BTC, ETH, SOL, and HYPE through market actions.

Final validation:

- `npm test`
- `npm run build`
- `npm run db:migrate` against a local disposable `hypersight` database when Postgres is available.
- Start the app and check `/api/health` when dependencies and local DB allow.
- Verify default startup uses local port 1337 when `PORT` is not set and pruning uses 48 hours when `TRADE_RETENTION_HOURS` is not set.
- Browser inspection of the Hypersight UI for visible trade/market wording and no VeChain terminology.
- Code search for forbidden trading/private-key behaviors, high-signal visible VeChain copy, and active legacy imports. Validation should distinguish rendered/bundled UI text and active runtime import paths from harmless CSS/browser substrings such as `inline-block` or `window.origin`, and from intentionally retained inactive migration history.
- Browser inspection of empty/no-trades, connected/live data, reconnecting/stale status, and desktop/mobile first-screen layout where local runtime allows.
- Built asset search for server-only env names such as `HYPERTRACKER_API_TOKEN` and for a local sentinel token value when available.

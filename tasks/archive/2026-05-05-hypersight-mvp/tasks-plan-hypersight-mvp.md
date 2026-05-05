See `skills/shared/references/execution/task-management.md` for execution workflow and review guidelines.

# Hypersight MVP

## Scope Summary

- Convert the cloned SeeVeChain app into Hypersight, a Hyperliquid public trade visualizer.
- Highest-risk areas are the old Node/dependency stack, replacing the VeChain block runtime cleanly, preserving decimal trade values, mapping Hyperliquid side correctly, labeling observed-window stats honestly, reconciling configured markets into API/UI state, wiring Socket.IO and frontend state end-to-end, proving no trading/private-key behavior was added, and preventing server-only env values from entering the client bundle.

## Relevant Files

- `package.json` - Project metadata, scripts, dependencies, and Node engine.
- `.node-version` - Current Node 12 target.
- `scripts/start` - Runtime startup currently subscribes to VeChain blocks.
- `server/app.js` - Express, Socket.IO, static serving, and scheduled cleanup.
- `server/routes.js` - REST and Socket.IO routes.
- `server/actions/` - Public API and Socket.IO data actions.
- `server/commands/` - Persistence and processor command pattern.
- `server/database/` - pg-promise and knex setup.
- `migrations/` - db-migrate schema changes.
- `server/test/` - Existing Mocha test location.
- `client/Main.js` - Client app root.
- `client/components/Visualizer/` - Current live visualizer flow.
- `client/components/Transaction/` and `client/components/Transactions/` - Current trade-like UI surfaces to replace or bypass.
- `client/style/` and `client/index.sass` - Global styling.
- `client/index.ejs` - Page metadata and loading text.
- `README.md` - Setup and product documentation.
- `webpack.config.js` - Build metadata and environment handling.

## Task Ordering Notes

- Bootstrap dependency and test script work must land before later tasks rely on `npm test` or modern Node behavior.
- VeChain-only packages should be removed only after the backend and frontend replacement tasks prove no active imports remain.
- Configured coins are the MVP market source of truth; migrations/startup must reconcile them into the `markets` table before API/UI reads.
- Coverage metadata must be driven by stored trades plus persisted feed status events, not only oldest/newest trade timestamps.
- Database schema and backend service work must land before frontend can be validated end-to-end.
- Frontend implementation may use mocked/empty initial state during coding, but final validation must hit the real Socket.IO/API contract where local runtime allows.
- Exact test placement and helper file names can be finalized during sub-task contracts after local pattern inspection.

## Tasks

- [x] 1.0 Bootstrap Hypersight project metadata, environment, and validation
  - covers_prd: `FR-001`, `FR-014`
  - covers_tdd: `TDR-002`, `TDR-013`, `TDR-014`, `TDR-015`
  - [x] 1.1 Rename project/package/docs scaffolding to Hypersight and update Node target/env example
    - covers_prd: `FR-001`, `FR-014`
    - covers_tdd: `TDR-002`, `TDR-015`
    - output: `package.json`, `.node-version`, `.env.example`, `README.md`, `webpack.config.js`, `client/index.ejs`
    - verify: `rg -n "seevechain|SeeVeChain|VeChain public blockchain|postgresql://localhost/seevechain|12\\.16" package.json .node-version README.md webpack.config.js client/index.ejs`
    - done_when: Project metadata, docs setup, page metadata, and env example use Hypersight, Node 20, `DATABASE_URL=postgresql://localhost/hypersight`, `PORT=1337`, and `TRADE_RETENTION_HOURS=48`; runtime default port is changed from 5000 to 1337; frontend env injection is narrowed to explicit public values only.
  - [x] 1.2 Update dependencies and scripts for MVP validation on modern Node
    - covers_prd: `FR-014`
    - covers_tdd: `TDR-013`, `TDR-014`
    - output: `package.json`, `package-lock.json`, server test config surface
    - verify: `npm install` and `npm test`
    - done_when: `ws` is installed, modern Node/test/build basics are viable, VeChain-only package removal is explicitly deferred until active imports are replaced, and `npm test` runs real Mocha tests instead of the placeholder failure.

- [x] 2.0 Add Hyperliquid data model and backend ingestion
  - covers_prd: `FR-002`, `FR-003`, `FR-004`, `FR-005`, `FR-006`, `FR-007`, `FR-008`, `FR-009`, `FR-009a`, `FR-010`, `FR-013`
  - covers_tdd: `TDR-001`, `TDR-003`, `TDR-004`, `TDR-005`, `TDR-006`, `TDR-007`, `TDR-008`, `TDR-008a`, `TDR-009`, `TDR-010`, `TDR-010a`, `TDR-011`, `TDR-011a`, `TDR-015`
  - [x] 2.1 Add Hyperliquid migrations for markets, trades, feed status events, stats cache, and indexes
    - covers_prd: `FR-006`, `FR-007`
    - covers_tdd: `TDR-006`, `TDR-009`, `TDR-011a`
    - output: `migrations/`
    - verify: `npm run db:migrate` against local disposable `hypersight` database when Postgres is available
    - done_when: New tables and indexes exist through db-migrate, including `feed_status_events`; configured default markets are seeded or ready for startup reconciliation; old VeChain tables are not required by new runtime code.
  - [x] 2.2 Implement Hyperliquid WebSocket service and parser/normalizer tests
    - covers_prd: `FR-002`, `FR-003`, `FR-004`, `FR-005`, `FR-013`
    - covers_tdd: `TDR-001`, `TDR-003`, `TDR-004`, `TDR-005`, `TDR-008`, `TDR-015`
    - output: `server/services/` or `server/lib/`, `server/test/`
    - verify: `npm test`
    - done_when: The service uses one WebSocket, subscribes to configured coins, parses single/array/reconnect trade payloads, normalizes sample trades with raw side plus buy/sell side mapping, tracks heartbeat/liveness/stale state, emits feed status/gap events for open/disconnect/stale/reconnect/gaps without direct DB writes, reconnects/resubscribes, and does not use private/authenticated trading behavior.
  - [x] 2.3 Implement trade persistence, market stats processing, pruning, and backend tests
    - covers_prd: `FR-006`, `FR-007`
    - covers_tdd: `TDR-006`, `TDR-007`, `TDR-009`, `TDR-013`
    - output: `server/commands/`, `server/actions/`, `server/test/`
    - verify: `npm test`
    - done_when: Trades insert with `ON CONFLICT DO NOTHING`, feed status events persist through command/action code, public payload builders omit buyer/seller/users values, stats compute observed up-to-24h volume/count/buy/sell/imbalance/latest price/recent trades plus coverage/gap metadata from feed status events, discontinuous feed events prevent continuous-coverage claims, `B` and `A` seed trades bucket into expected buy/sell notional, pruning respects `TRADE_RETENTION_HOURS` with a default of 48, and tests cover core processing.
  - [x] 2.4 Wire Express, Socket.IO, REST APIs, startup, and scheduled processing to Hyperliquid
    - covers_prd: `FR-008`, `FR-009`, `FR-009a`, `FR-010`, `FR-013`
    - covers_tdd: `TDR-001`, `TDR-010`, `TDR-010a`, `TDR-011`, `TDR-011a`, `TDR-014`, `TDR-015`
    - output: `scripts/start`, `server/app.js`, `server/routes.js`, `server/actions/index.js`, `server/commands/index.js`
    - verify: `npm test` plus `/api/health` local probe when DB/runtime is available
    - done_when: Startup initializes Hyperliquid ingestion, reconciles configured coins into markets, persists status events emitted by the WebSocket service, `clientAskForLatest` emits sanitized market stats/trades/status, `serverSendConnectionStatus` is emitted on status changes, REST endpoints use new actions, `/api/health` returns current ingestion status, `/api/markets` returns default coins on a fresh DB, old VeChain runtime subscription is not active, and server-only env values are not exposed to the client.

- [x] 3.0 Replace frontend with Hypersight live market experience
  - covers_prd: `FR-001`, `FR-008`, `FR-009`, `FR-011`, `FR-012`, `FR-013`
  - covers_tdd: `TDR-012`, `TDR-014`, `TDR-015`
  - [x] 3.1 Replace client state and Socket.IO handling with trade/market state
    - covers_prd: `FR-008`, `FR-009`, `FR-011`
    - covers_tdd: `TDR-012`
    - output: `client/Main.js`, `client/components/Visualizer/`, client state helpers
    - verify: `npm run build`
    - done_when: Client asks for latest data, handles `serverSendTrades`, `serverSendMarketStats`, and `serverSendConnectionStatus`, tracks selected coin/enabled coins/live trades/market stats/connection status/coverage metadata, and no longer depends on currentBlock/topContracts state.
  - [x] 3.2 Build Hypersight visual components for live trades, stats, top markets, trade tape, and coin selection
    - covers_prd: `FR-001`, `FR-011`, `FR-012`, `FR-013`
    - covers_tdd: `TDR-012`, `TDR-014`
    - output: `client/components/`, `client/style/`, `client/index.sass`
    - verify: `npm run build` and browser inspection of the rendered first screen
    - done_when: The first screen shows public market activity with trade pulses, observed-window stats, top markets, trade tape, coin selector, connection/stale status, no buyer/seller address display, and no wallet/trading controls.
  - [x] 3.3 Remove or bypass visible VeChain routes/components/assets/helpers from active UI
    - covers_prd: `FR-001`, `FR-011`, `FR-013`
    - covers_tdd: `TDR-012`, `TDR-015`
    - output: `client/components/`, `client/lib/`, `shared/`, active imports
    - verify: `npm run build`, built/rendered UI text search for high-signal legacy terms, and active import/runtime graph search for VeChain modules/helpers
    - done_when: No active rendered UI or runtime import path contains old VeChain terminology; validation explicitly ignores benign CSS/browser substrings like `inline-block` or `window.origin` and intentionally retained inactive migration history; VeChain-only dependencies are removed when no active imports remain.

- [x] 4.0 Final documentation, runtime smoke, review, and cleanup
  - covers_prd: `FR-014`, all acceptance criteria
  - covers_tdd: `TDR-014`, `TDR-015`
  - [x] 4.1 Complete README troubleshooting and MVP safety documentation
    - covers_prd: `FR-014`
    - covers_tdd: `TDR-002`, `TDR-015`
    - output: `README.md`, `.env.example`
    - verify: `rg -n "Hypersight|HYPERLIQUID_WS_URL|HYPERLIQUID_COINS|TRADE_RETENTION_HOURS|observed window|feed status|no private keys|no signing|no order" README.md .env.example`
    - done_when: Setup, env vars, DB creation, migration/start commands, troubleshooting, and public-data safety boundaries are documented.
  - [x] 4.2 Run final validation and forbidden-surface searches
    - covers_prd: all acceptance criteria
    - covers_tdd: `TDR-014`, `TDR-015`
    - output: validation evidence in task/review logs
    - verify: `npm test`, `npm run build`, DB/API/browser checks where local environment allows, default-port/default-retention checks, forbidden behavior/text `rg` searches, built asset search for server-only env names, and browser checks for empty/no-trades, live, stale/reconnecting, desktop, and mobile states where practical
    - done_when: Automated checks pass or skipped checks are explicitly justified, frontend is visually inspected across required states where practical, searches confirm no trading/private-key functionality was introduced, and client bundles do not contain server-only env names or sentinel token values.

# Sub-task 2.4 Contract

goal: Wire Express, Socket.IO, REST APIs, startup, market reconciliation, and scheduled processing to Hyperliquid.

in_scope:
- Replace `scripts/start` VeChain subscription startup with Hyperliquid service startup.
- Persist trades and feed status events from service events.
- Emit `serverSendTrades`, `serverSendMarketStats`, and `serverSendConnectionStatus`.
- Update `clientAskForLatest` bootstrap.
- Add `/api/health`, `/api/markets`, `/api/trades`, `/api/market_stats`.
- Add actions for latest trades/stats/markets/status and market reconciliation.
- Prune old trades periodically.

out_of_scope:
- No frontend rendering rewrite.
- No VeChain dependency removal unless imports become unused on touched runtime path.

surfaces:
- `scripts/start`
- `server/app.js`
- `server/routes.js`
- `server/actions/`
- `server/commands/index.js`
- `server/services/hyperliquidWs.js` only if integration requires small exported helper.
- `server/test/`

acceptance_checks:
- Startup no longer imports or calls `subscribeToVechainBlocks`.
- `/api/health` exposes current ingestion status.
- `/api/markets` returns default configured coins on fresh/no-row scenario.
- Socket bootstrap emits sanitized trades, market stats, and connection status.
- Server-only env values are not exposed to client.

reference_patterns:
- Existing `app.promiseRoute` route style.
- Existing action modules that wrap `server/database`.
- Existing command exports.

test_first_plan:
- Add route/action/integration tests with stubbed clients where practical, run `npm test`, expect missing actions or old routes to fail.

test_first_evidence:
- Pre-change command: `npm test`
- Observed failure: `Cannot find module '../actions/marketData'` from `server/test/marketActions.spec.js`.
- Production path exercised: planned market data action/bootstrap surface.
- Post-change command: pending.
- Post-change command: `npm test`
- Post-change result: passed with 16 Mocha assertions.

verify:
- `npm test`
- `rg -n "subscribeToVechainBlocks|startVechainConnection|getMissingBlocksAndTransactions|saveDailyStats|serverSendLatest|serverSendTopContracts" scripts/start server/app.js server/routes.js server/actions`

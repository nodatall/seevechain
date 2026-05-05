# Sub-task 2.3 Contract

goal: Implement trade persistence, feed status persistence, market stats processing, pruning, and backend tests.

in_scope:
- `saveTrades` with batch insert and `ON CONFLICT DO NOTHING`.
- Public payload sanitization omitting buyer/seller/users.
- `saveFeedStatusEvent`.
- `processMarketStats` from stored trades plus feed status events, with observed-window coverage/gap metadata.
- `pruneOldTrades` defaulting to 48 hours.
- Market actions/helpers needed for tests if naturally adjacent.

out_of_scope:
- No WebSocket startup integration.
- No frontend changes.
- No REST route wiring yet except action/helper exports if useful.

surfaces:
- `server/commands/`
- `server/actions/`
- `server/test/`

acceptance_checks:
- Duplicate trade persistence SQL uses `(coin, time_ms, tid)` conflict handling.
- Public payloads do not include buyer, seller, users, or raw.
- Side buckets produce expected buy/sell notional and imbalance.
- Feed status gap event inside window marks coverage gap affected.
- Prune defaults to 48 hours.

reference_patterns:
- Existing CommonJS command/action modules.
- Existing pg-promise `client.query` style and Mocha/Chai tests.

test_first_plan:
- Add focused tests against command/helper SQL and pure stats helpers before implementation; run `npm test` and expect missing modules/failures.

test_first_evidence:
- Pre-change command: `npm test`
- Observed failure: `Cannot find module '../commands/saveTrades'` from `server/test/marketDataCommands.spec.js`.
- Production path exercised: planned market data command modules.
- Post-change command: pending.
- Post-change command: `npm test`
- Post-change result: passed with 10 Mocha assertions.

verify:
- `npm test`

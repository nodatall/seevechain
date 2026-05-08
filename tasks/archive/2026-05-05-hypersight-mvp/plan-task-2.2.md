# Sub-task 2.2 Contract

goal: Implement the Hyperliquid WebSocket service, parser, normalizer, side mapping, and status event emission without DB coupling.

in_scope:
- One WebSocket connection for all configured coins.
- Subscribe messages for configured coins.
- Parse pure acknowledgements as status-only.
- Parse trade payloads defensively from single, array, and reconnect/snapshot-style channel messages.
- Normalize trades with decimal strings, raw side, side mapping, notional, internal buyer/seller, and raw payload.
- Emit `trades`, `connected`, `disconnected`, `error`, and status/gap events.
- Heartbeat/stale/reconnect timers should be testable through injected dependencies.

out_of_scope:
- No direct Postgres writes from the WebSocket service.
- No app startup integration.
- No REST or frontend changes.

surfaces:
- `server/services/` or `server/lib/`
- `server/test/`

acceptance_checks:
- Normalizer maps raw `B` to `buy` and raw `A` to `sell`, preserving raw side.
- Parser handles subscription responses and trade arrays without crashing.
- Service emits status/gap events rather than persisting them.
- Reconnect/resubscribe and heartbeat/stale behavior are covered with mocked socket/timers where practical.
- No private/authenticated trading behavior exists.

reference_patterns:
- Existing CommonJS module style in `server/lib/*` and `server/commands/*`.
- Existing Mocha/Chai test harness.

test_first_plan:
- Add focused server tests for normalizer/parser/status behavior, run `npm test`, expect failures because implementation does not exist.

test_first_evidence:
- Pre-change command: `npm test`
- Observed failure: `Cannot find module '../services/hyperliquidWs'` from `server/test/hyperliquidWs.spec.js`.
- Production path exercised: planned Hyperliquid WebSocket helper module.
- Post-change command: pending.
- Post-change command: `npm test`
- Post-change result: passed with 5 Mocha assertions.

verify:
- `npm test`
- `rg -n "privateKey|sign\\(|order|placeOrder|exchange action|userFills|clearinghouse" server/services server/lib server/test`

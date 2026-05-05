# Sub-task 4.2 Contract

goal: Run final validation, browser checks, forbidden-surface searches, review, and cleanup readiness checks for the Hypersight MVP.

in_scope:
- Re-run automated test and production build.
- Run local DB migration/API smoke where Postgres is available.
- Inspect the rendered frontend across desktop and mobile empty/no-trades states, plus live/stale status if local runtime allows.
- Search active runtime and built assets for forbidden legacy/trading/server-only env surfaces.
- Verify defaults for port, retention, configured coins, WebSocket URL, and explicit client env allowlist.
- Feed validation evidence into the final review.

out_of_scope:
- Implementing order books, candles, wallet fills, funding, or HyperTracker enrichment.
- Destructive cleanup of local databases or user environment.

surfaces:
- Whole active branch.

acceptance_checks:
- `npm test` and `npm run build` pass.
- `/api/health`, `/api/markets`, `/api/trades`, and `/api/market_stats` respond when local DB/runtime is available.
- Browser inspection shows Hypersight UI with no VeChain wording, no wallet controls, no order controls, and no buyer/seller address display.
- Built client assets do not contain server-only env names or token values.
- Final review finds no blockers, or blockers are fixed before completion.

verify:
- `npm test`
- `npm run build`
- `npm run db:migrate` when local Postgres is available
- local API probes when runtime is available
- browser screenshot/text checks
- forbidden-surface searches

post_change_evidence:
- `npm test`: passed with 16 Mocha assertions.
- `npm run build`: passed with only the existing Browserslist data warning.
- `npm run db:migrate -- --verbose`: passed against local `postgresql://localhost/hypersight`, including the Hyperliquid schema migration.
- Runtime smoke: `http://127.0.0.1:1337/api/health` returned `service=hypersight`, `connected=true`, and coins `BTC,ETH,SOL,HYPE`.
- API smoke: `/api/markets`, `/api/trades?coin=BTC&limit=5`, and `/api/market_stats` returned successful JSON; public trade payloads had no buyer/seller/raw fields.
- Browser desktop inspection: first screen rendered live trade pulses, stats, top markets, and trade tape with 80 rows and no forbidden visible legacy/trading terms.
- Browser mobile inspection at `390x844`: no horizontal overflow, live status visible, trade rows rendered, and no forbidden visible terms.
- Browser reconnecting inspection: after stopping the local server, the status badge changed to `Reconnecting`.
- Built asset search: no server-only env names, no `HYPERTRACKER_API_TOKEN`, and no local token value were found in `client/dist`.
- Active runtime search: no Connex, Thor, `knownAddresses`, old Socket.IO events, or SeeVeChain cookie references in active entrypoints.
- Defaults check: environment defaults resolved to port `1337`, WebSocket `wss://api.hyperliquid.xyz/ws`, coins `BTC,ETH,SOL,HYPE`, and retention `48`.

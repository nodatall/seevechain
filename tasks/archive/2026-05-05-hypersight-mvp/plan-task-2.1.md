# Sub-task 2.1 Contract

goal: Add Hyperliquid MVP schema through db-migrate.

in_scope:
- Add markets, trades, market_stats_cache, feed_status_events tables and indexes.
- Include raw_side in trades.
- Seed or make ready for startup reconciliation of default markets.

out_of_scope:
- No runtime ingestion or command implementation.
- No destructive removal of legacy VeChain tables.

surfaces:
- `migrations/`

acceptance_checks:
- New migration defines all required tables and indexes.
- Down migration drops only the new Hypersight tables/indexes.
- Legacy tables remain untouched.

reference_patterns:
- Existing db-migrate files in `migrations/*.js` use `exports.up = db => db.runSql(...)`.

test_first_plan:
- Failing-first DB migration is not practical without a local disposable DB pre-created. Use migration file review and, if DB exists, `npm run db:migrate`.

test_first_evidence:
- not applicable: schema file addition with optional local DB availability.

verify:
- `node -c migrations/<new-file>.js`
- `rg -n "CREATE TABLE markets|CREATE TABLE trades|CREATE TABLE market_stats_cache|CREATE TABLE feed_status_events|idx_trades_time_ms|idx_feed_status_events" migrations`
- `npm run db:migrate` when local Postgres/database is available.

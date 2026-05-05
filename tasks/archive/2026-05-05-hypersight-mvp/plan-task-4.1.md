# Sub-task 4.1 Contract

goal: Complete Hypersight setup, troubleshooting, and public-data safety documentation.

in_scope:
- Document install, database creation, migrations, start commands, and browser URL.
- Document supported environment variables and defaults.
- Explain observed-window stats and feed status/gap labeling.
- State the no private keys, no signing, no order placement, and no wallet-private data boundary.
- Clarify that `HYPERTRACKER_API_TOKEN` is not used by the MVP.

out_of_scope:
- Runtime smoke and browser screenshots.
- New features beyond public trades and market stats.

surfaces:
- `README.md`
- `.env.example`

acceptance_checks:
- README gives a clean local setup path for Postgres and Node.
- README tells operators what to check when no trades, DB errors, reconnects, or build issues happen.
- README makes the MVP safety boundary unambiguous.

verify:
- `rg -n "Hypersight|HYPERLIQUID_WS_URL|HYPERLIQUID_COINS|TRADE_RETENTION_HOURS|observed window|feed status|no private keys|no signing|no order" README.md .env.example`

post_change_evidence:
- README/env search passed and covered setup, env vars, observed window, feed status, and explicit public-data safety boundaries.

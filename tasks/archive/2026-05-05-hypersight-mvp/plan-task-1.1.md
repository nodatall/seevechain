# Sub-task 1.1 Contract

goal: Rename visible/project scaffolding to Hypersight, set modern Node/default env metadata, and narrow frontend env injection.

in_scope:
- Update package metadata, Node version, README/env example scaffolding, Webpack page metadata, and client loading copy.
- Set runtime/documented defaults for `PORT=1337`, `DATABASE_URL=postgresql://localhost/hypersight`, `TRADE_RETENTION_HOURS=48`, and default Hyperliquid WS/coins.
- Replace broad Webpack dotenv exposure with explicit public client env values only.

out_of_scope:
- Do not implement Hyperliquid ingestion, DB migrations, frontend redesign, or remove VeChain dependencies yet.
- Do not read or use `HYPERTRACKER_API_TOKEN`.

surfaces:
- `package.json`
- `.node-version`
- `.env.example`
- `README.md`
- `webpack.config.js`
- `client/index.ejs`
- `scripts/start`

acceptance_checks:
- Project metadata and docs use Hypersight.
- Node target is Node 20.
- Local startup default port is 1337.
- `.env.example` contains only MVP public/server config and no token value.
- Client bundle config exposes only explicit public env keys, not arbitrary `.env`.

reference_patterns:
- Existing `webpack.config.js` plugin/env metadata setup.
- Existing `scripts/start` server listen pattern.
- Existing README local setup structure, rewritten for Hypersight.

test_first_plan:
- Failing-first is not practical for metadata/docs-only edits before the config surface exists. Use targeted `rg` checks after edits.

test_first_evidence:
- not applicable: metadata/docs/config scaffolding slice; post-change targeted searches will verify behavior.

verify:
- `rg -n "seevechain|SeeVeChain|VeChain public blockchain|postgresql://localhost/seevechain|12\\.16|process\\.env\\.PORT \\|\\| 5000" package.json .node-version README.md webpack.config.js client/index.ejs scripts/start`
- `rg -n "Hypersight|PORT=1337|TRADE_RETENTION_HOURS=48|HYPERLIQUID_WS_URL|HYPERLIQUID_COINS" README.md .env.example`
- `rg -n "new Dotenv\\(\\)" webpack.config.js`

trust_boundary_notes:
- `.env` contains `HYPERTRACKER_API_TOKEN`; do not copy it into docs, bundle config, or client-visible code.

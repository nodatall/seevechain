# Sub-task 3.2 Contract

goal: Build the Hypersight first-screen market interface with live trade pulses, stats, top markets, trade tape, and coin selection.

in_scope:
- Replace the remaining VeChain visualizer stylesheet with Hypersight dashboard styles.
- Keep controls and layout responsive across desktop and mobile widths.
- Surface public market data only: trade pulses, observed-window stats, top markets, selected coin, connection/stale status, and recent trades.
- Avoid wallet, private account, signing, order, and address display affordances.

out_of_scope:
- Deleting inactive legacy files and package dependencies.
- Full runtime smoke with live WebSocket/Postgres.

surfaces:
- `client/components/Visualizer/index.sass`
- `client/index.sass`
- `client/style/index.sass`

acceptance_checks:
- First screen is the usable app, not a landing page.
- Layout has stable dimensions for lanes, controls, metrics, and tape rows.
- Empty/no-trades state is visible and does not look broken.
- `npm run build` passes without legacy visualizer Sass warnings.

test_first_plan:
- Use the existing build output from 3.1 as the failing visual/style baseline: it still compiled the old VeChain visualizer Sass and emitted deprecation warnings from that stylesheet.

test_first_evidence:
- Pre-change command: `npm run build`
- Observed issue: build passed but emitted warnings from the old visualizer Sass import/lighten pattern, and the first screen was not styled for the new Hypersight component tree.

verify:
- `npm run build`
- Browser inspection of the rendered first screen during final validation.

post_change_evidence:
- `npm run build`: passed with only the existing Browserslist data warning.
- Browser inspection: deferred to 4.2 so it can exercise the final client bundle after dependency cleanup and runtime smoke setup.

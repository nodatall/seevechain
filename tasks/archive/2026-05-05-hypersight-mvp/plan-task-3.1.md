# Sub-task 3.1 Contract

goal: Replace active client state and Socket.IO bootstrap with Hypersight trade, market, and connection state.

in_scope:
- Remove the active UI dependency on block/currentBlock/topContracts state.
- Handle `serverSendTrades`, `serverSendMarketStats`, and `serverSendConnectionStatus`.
- Track selected coin, enabled coins, live trades, market stats, connection status, and coverage metadata.
- Align server `serverSendTrades` payloads to the normalized batch envelope.
- Keep only explicitly allowed client environment values in the bundle.
- Make the modernized frontend build runnable under Node 20/OpenSSL 3.

out_of_scope:
- Final visual polish and browser screenshot QA.
- Deleting inactive legacy VeChain files and package dependencies unless required for build.

surfaces:
- `client/Main.js`
- `client/components/Visualizer/`
- `client/lib/appState.js`
- `client/index.js`
- `server/routes.js`
- `scripts/start`
- `package.json`
- `package-lock.json`
- `webpack.config.js`
- `.babelrc`

acceptance_checks:
- Client bootstrap emits `clientAskForLatest` without wallet/private fields.
- Client can consume both initial and live trade batches through `{ trades, receivedAt }`.
- Active rendered state does not use current block or top contract concepts.
- `npm run build` reaches the frontend bundle with modern Node-compatible Sass/Babel setup.

test_first_plan:
- Run the current production build and treat the OpenSSL/Babel/Sass failure plus old event dependency as the failing surface.

test_first_evidence:
- Pre-change command: `npm run build`
- Observed failure: Webpack 4 OpenSSL 3 hashing failure under the current Node runtime, followed by Babel/core-js compatibility failure when `NODE_OPTIONS=--openssl-legacy-provider` was supplied.
- Production path exercised: production client bundle.

verify:
- `npm run build`
- `rg -n "serverSendLatest|serverSendTopContracts|currentBlock|topContracts|clientAskForWeekly|seeVechainUid" client/Main.js client/components/Visualizer client/lib/appState.js server/routes.js scripts/start`

post_change_evidence:
- `npm run build`: passed. Build emits Sass deprecation warnings from the remaining visualizer stylesheet, to be removed in visual polish.
- `npm test`: passed with 16 Mocha assertions.
- Legacy active-surface search: no matches.

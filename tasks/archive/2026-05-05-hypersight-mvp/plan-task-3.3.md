# Sub-task 3.3 Contract

goal: Remove legacy VeChain modules from the active runtime graph and delete VeChain-only dependencies once inactive.

in_scope:
- Stop exporting old VeChain processors through active command/action indexes.
- Remove the old visitor analytics route from the active API surface.
- Remove VeChain-only packages and packages only used by inactive legacy UI modules.
- Keep historical migrations and inactive legacy source files only if they are not reachable from runtime imports or the built bundle.

out_of_scope:
- Rewriting old migration history.
- Cosmetic deletion of every inactive legacy file when active imports and bundle output are clean.

surfaces:
- `server/commands/index.js`
- `server/actions/index.js`
- `server/routes.js`
- `package.json`
- `package-lock.json`
- `.babelrc`

acceptance_checks:
- `require('./server/commands')` no longer loads VeChain command modules.
- `package.json` no longer contains `@vechain/connex-framework`, `@vechain/connex.driver-nodejs`, or `thor-devkit`.
- Built assets do not contain high-signal visible legacy UI terms.
- Active source entrypoints do not import `knownAddresses`, ABI signatures, Connex, or Thor helpers.

test_first_plan:
- Search package and active runtime indexes for high-signal VeChain dependencies and old UI/API exports.

test_first_evidence:
- Pre-change search found VeChain-only package dependencies and old command index exports for `saveBlock`, `saveTransaction`, `processLatestBlock`, and `processTopContracts`.

verify:
- `npm install --ignore-scripts --legacy-peer-deps`
- `npm test`
- `npm run build`
- `rg -n "@vechain|connex|thor-devkit|knownAddresses|ABI_SIGNATURES|serverSendLatest|serverSendTopContracts|clientAskForWeekly|seeVechainUid" package.json server/commands/index.js server/actions/index.js server/routes.js scripts/start client/Main.js client/components/Visualizer client/lib/appState.js webpack.config.js`
- `rg -n "VeChain|VET|VTHO|burn|block|clause|contract|delegator|reverted|private key|signing|order placement|wallet" client/dist`

post_change_evidence:
- `npm install --ignore-scripts --legacy-peer-deps`: passed, removed legacy inactive packages from the lockfile.
- `npm test`: passed with 16 Mocha assertions.
- `npm run build`: passed with only the existing Browserslist data warning.
- Active legacy import/dependency search: no matches.
- Built visible legacy term search: no matches.
- Runtime index load check: `require('./server/commands'); require('./server/actions')` passed.

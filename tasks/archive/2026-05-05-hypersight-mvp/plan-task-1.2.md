# Sub-task 1.2 Contract

goal: Make modern install/test basics viable for the MVP while deferring VeChain dependency removal until active imports are replaced.

in_scope:
- Add `ws`.
- Replace placeholder `npm test` with a real Mocha command.
- Keep or adjust dependencies only enough for Node 20 install/test basics.
- Do not remove VeChain-only dependencies until later tasks remove active imports.

out_of_scope:
- No ingestion implementation.
- No frontend redesign.
- No VeChain runtime removal yet.

surfaces:
- `package.json`
- `package-lock.json`
- `server/test/`

acceptance_checks:
- `npm install` completes under the available local Node/npm toolchain or records a concrete package blocker.
- `npm test` runs real tests.
- `ws` exists in dependencies.
- VeChain-only dependency removal is deferred.

reference_patterns:
- Existing Mocha/Chai example under `server/test/example.spec.js`.
- Existing package script style.

test_first_plan:
- Failing-first command: `npm test` should currently fail because it is a placeholder.

test_first_evidence:
- Pre-change command: `npm test`
- Observed failure: placeholder script prints `Error: no test specified` and exits 1.
- Production path exercised: package validation script surface.
- Post-change command: pending.
- Post-change command: `npm test`
- Post-change result: passed with 1 Mocha assertion.

verify:
- `npm test`
- `node -e "const p=require('./package.json'); if(!p.dependencies.ws) throw new Error('ws missing')"`

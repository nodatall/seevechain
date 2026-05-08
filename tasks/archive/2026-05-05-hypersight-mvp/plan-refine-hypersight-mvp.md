# Plan Refine Log: hypersight-mvp

## Round 1

challenge_brief:
- CH-1-1: Stats were described as 24h volume while the MVP has no historical backfill and only stores observed trades.
- CH-1-2: Buyer/seller fields were required in the normalized model but not constrained away from public UI/API payloads.
- CH-1-3: Task 1.2 could remove VeChain dependencies before active import paths were replaced.
- CH-1-4: Reconnect was specified, but heartbeat/stale-feed liveness was missing.
- CH-1-5: Broad Webpack dotenv injection could leak server-only env values such as `HYPERTRACKER_API_TOKEN`.

reviewer_findings:
- RF-1-1: material, fix, cross-artifact. Rename the MVP stats contract to observed stored-window stats, expose coverage metadata, and only imply a full 24h window once stored coverage reaches 24 hours.
- RF-1-2: material, fix, cross-artifact. Treat buyer/seller/users as raw/internal ingestion data only and ban them from public REST, Socket.IO, and UI payloads.
- RF-1-3: material, fix, tasks-plan. Defer VeChain-only dependency removal until backend/frontend replacement proves no active imports remain.
- RF-1-4: material, fix, tdd. Add heartbeat, pong/last-message tracking, stale status, reconnect/resubscribe behavior, and mocked tests.
- RF-1-5: material, fix, cross-artifact. Replace broad client env injection with an explicit public allowlist and validate built bundles for server-only names/values.
- RF-1-6: minor, fix, tasks-plan. Add focused browser checks for empty/no-trades, connected live data, reconnecting/stale status, and desktop/mobile first-screen states.

reviewer_dispositions:
- CH-1-1: promoted_to_finding, RF-1-1, material.
- CH-1-2: promoted_to_finding, RF-1-2, material.
- CH-1-3: promoted_to_finding, RF-1-3, material.
- CH-1-4: promoted_to_finding, RF-1-4, material.
- CH-1-5: promoted_to_finding, RF-1-5, material.

artifact_changes_from_challenges:
- PRD now describes stats as observed stored-window/up-to-24h values with coverage metadata and no false complete-24h claim on fresh databases.
- PRD/TDD now mark buyer/seller/users as internal-only and require sanitized public API/Socket.IO/UI payloads.
- TDD/tasks-plan now defer VeChain dependency removal until active imports are replaced.
- TDD/tasks-plan now include Hyperliquid heartbeat/liveness/stale reconnect behavior and tests.
- PRD/TDD/tasks-plan now require explicit public client env allowlisting and built-bundle secret checks.
- Tasks-plan now requires frontend visual checks for empty, live, stale/reconnecting, desktop, and mobile states.

rejected_or_deferred_challenges:
- none.

stop_decision:
- needs_artifact_fixes; material findings RF-1-1 through RF-1-5 were fixed in artifacts before round 2.

## Round 2

challenge_brief:
- CH-2-1: Buy/sell notional and imbalance were required, but Hyperliquid raw side `A`/`B` mapping was not defined.
- CH-2-2: Reconnect continuity was underspecified around subscription acknowledgements, reconnect/snapshot-style trade arrays, dedupe, and gap coverage.
- CH-2-3: The plan added `markets` and `/api/markets` without defining whether configured coins or DB rows were the source of truth on a fresh database.
- CH-2-4: The forbidden-term search was too broad for generic words such as `block` and `origin`, risking false failures on CSS/browser/runtime terms or inactive legacy files.

reviewer_findings:
- RF-2-1: material, fix, cross-artifact. Define side normalization: raw `B` maps to buy/bid-aggressor, raw `A` maps to sell/ask-aggressor; preserve raw side and test stats/UI buckets.
- RF-2-2: material, fix, tdd. Treat pure `subscriptionResponse` messages as status-only, but process any `trades` payload including reconnect/snapshot-style arrays through the same normalizer/persistence path; mark observed coverage as gap-affected when reconnect gaps are not recoverable.
- RF-2-3: material, fix, cross-artifact. Define configured coins as the MVP market source of truth and require startup/migration reconciliation into `markets`, with fresh DB defaults visible through `/api/markets`, Socket.IO bootstrap, and the selector.
- RF-2-4: material, fix, tasks-plan. Split forbidden-term validation into rendered/bundled UI copy, active runtime import graph, and high-signal broad terms, with explicit exclusions for benign CSS/browser substrings and inactive migration history.

reviewer_dispositions:
- CH-2-1: promoted_to_finding, RF-2-1, material.
- CH-2-2: promoted_to_finding, RF-2-2, material.
- CH-2-3: promoted_to_finding, RF-2-3, material.
- CH-2-4: promoted_to_finding, RF-2-4, material.

artifact_changes_from_challenges:
- PRD/TDD/tasks-plan now require raw side preservation and normalized `B` buy / `A` sell mapping with stats tests.
- TDD/tasks-plan now specify reconnect trade payload handling, dedupe, and observed-window gap metadata.
- PRD/TDD/tasks-plan now make configured coins the MVP market source of truth and require reconciliation into `markets`.
- Tasks-plan now narrows legacy-term validation to active UI/runtime surfaces and high-signal terms, avoiding false failures from harmless substrings.

rejected_or_deferred_challenges:
- none.

stop_decision:
- needs_artifact_fixes; material findings RF-2-1 through RF-2-4 were fixed in artifacts before round 3.

## Round 3

challenge_brief:
- no_material_challenges_found: yes.
- rationale: Current artifacts carried forward the round 1-2 fixes and aligned sequencing/verification with the repo cutover risks.

reviewer_findings:
- RF-3-1: material, fix, cross-artifact. PRD defaults for `PORT=1337` and `TRADE_RETENTION_HOURS=48` were not explicit enough in TDD/task verification, while the repo currently defaults startup to port 5000.

reviewer_dispositions:
- empty_challenger_brief: not_applicable.
- challenge_ids: none.

artifact_changes_from_challenges:
- TDD now names implemented config defaults directly, including `PORT=1337` and `TRADE_RETENTION_HOURS=48`.
- Tasks-plan now requires runtime default port 1337, default retention 48 hours, and final default checks.

rejected_or_deferred_challenges:
- none.

stop_decision:
- needs_artifact_fixes; material finding RF-3-1 was fixed in artifacts before round 4.

## Round 4

challenge_brief:
- CH-4-1: Coverage metadata could still imply continuous 24h feed across downtime/restarts/offline periods because only trades/cache were specified.
- CH-4-2: `HYPERLIQUID_INFO_URL` was listed as required config even though the MVP has no Info API consumer.

reviewer_findings:
- RF-4-1: material, fix, cross-artifact. Add a minimal durable source of truth for feed sessions/gaps or remove continuous-coverage implications. The chosen fix adds `feed_status_events` and derives known gap status from it.
- RF-4-2: material, fix, tdd. Remove `HYPERLIQUID_INFO_URL` from required MVP config and defer it until a concrete Info API consumer exists.

reviewer_dispositions:
- CH-4-1: promoted_to_finding, RF-4-1, material.
- CH-4-2: promoted_to_finding, RF-4-2, material.

artifact_changes_from_challenges:
- PRD/TDD/tasks-plan now require `feed_status_events` for connection/stale/reconnect/gap evidence and prohibit continuous coverage claims when known gaps exist.
- TDD now removes `HYPERLIQUID_INFO_URL` from required MVP config and explicitly defers it.

rejected_or_deferred_challenges:
- none.

stop_decision:
- needs_artifact_fixes; material findings RF-4-1 and RF-4-2 were fixed in artifacts before round 5.

## Round 5

challenge_brief:
- CH-5-1: Task sequencing blurred whether the WebSocket service should persist feed status events directly before persistence commands existed.
- CH-5-2: The UI needed live/stale status but `serverSendConnectionStatus` was optional and `/api/health` only had status where available.

reviewer_findings:
- RF-5-1: material, fix, cross-artifact. The WebSocket service should emit status/gap events, while app/command wiring persists them.
- RF-5-2: material, fix, cross-artifact. `serverSendConnectionStatus` and `/api/health` ingestion status fields should be required.

reviewer_dispositions:
- CH-5-1: promoted_to_finding, RF-5-1, material.
- CH-5-2: promoted_to_finding, RF-5-2, material.

artifact_changes_from_challenges:
- TDD/tasks-plan now state that `hyperliquidWs` emits status/gap events and does not write directly to Postgres.
- TDD/tasks-plan now assign feed status persistence to app/command wiring.
- PRD/TDD/tasks-plan now require `serverSendConnectionStatus` and matching `/api/health` status fields.

rejected_or_deferred_challenges:
- none.

stop_decision:
- needs_artifact_fixes; material findings RF-5-1 and RF-5-2 were fixed in artifacts before round 6.

## Round 6

challenge_brief:
- no_material_challenges_found: yes.
- rationale: Current artifacts carry forward the round 5 fixes and remaining high-risk areas are covered by executable TDRs, sequenced tasks, and validation checks.

reviewer_findings:
- none.

reviewer_dispositions:
- empty_challenger_brief: not_applicable.
- challenge_ids: none.

artifact_changes_from_challenges:
- none.

rejected_or_deferred_challenges:
- none.

stop_decision:
- clean_reviewer_round; no unresolved blocker or material findings remain.

## Refinement Completion Stamp

plan_refine_complete: yes
plan_key: hypersight-mvp
rounds_run: 6
fresh_challenger_rounds: 6
fresh_reviewer_rounds: 6
stop_reason: clean_reviewer_round
reviewer_stop_gate: no_unresolved_blocker_or_material
all_challenges_dispositioned: yes
research_carry_forward_complete: not_applicable
pro_carry_forward_complete: not_applicable
ready_for_execution: yes

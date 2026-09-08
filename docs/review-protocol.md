# Review Protocol — planning2

Applies on top of the standing AZM-Planning engineering discipline that governs all AzamanLTD repos.

## Branch discipline

- One branch per task. Delete the branch after merge.
- One change per PR, max ~500 lines where practical. Large authored banks may remain data-only when splitting them would make review harder.
- Branch naming: `feat/<thing>`, `fix/<thing>`, `docs/<thing>`.

## Definition of done (per PR)

1. CI green: every shipped JavaScript file passes syntax validation; content-shape checks pass; no known console errors on the happy path.
2. Pixel checks: any PR touching UI must include before/after comparison against the relevant screenshot in `docs/captures/` (or explicitly record why the capture is still unavailable).
3. Behavior checks: claims in the PR description are verified against `docs/bluebook-spec.md` acceptance criteria. Lyra reviews each PR against the spec — a PR that ships code contradicting the spec is rejected, not patched.
4. No new hardcoded colors or font sizes: all new visual styles come from `docs/design-tokens.md` and the app token layer.
5. State integrity: navigation between questions, review screen, timer, break, and tools never loses answers, marks, eliminations, highlights, or notes within a module.
6. Recovery integrity: refreshing during a timed module or scheduled break must preserve the correct absolute deadline and must not reopen a completed module; malformed persisted state must not bypass the ordered module chain or create an impossible break state.
7. Content integrity: the question bank must remain original, structurally valid, uniquely identified, correctly keyed, and represented in the required domain/difficulty distribution. Any runtime presentation transform must preserve the semantic correct answer.
8. Student UI integrity: internal curriculum metadata must not be exposed in the test-taking surface; content records may retain domain, skill, and difficulty tags for QA and routing.
9. Accessibility integrity: platform-specific keyboard shortcuts, region navigation, dialogs, answer controls, test tools, calculator tabs, and start-code fields must retain an operable keyboard and semantic path on every supported OS.
10. Platform evidence: changes based on current Bluebook documentation must be reflected in the platform-readiness notes and covered by static or browser-level contracts where practical.

## Review flow

1. Jarvis opens PR with a plain, honest description of what is and is not done.
2. Lyra audits against the spec and the screenshot pack; findings are posted as review comments, severity-tagged (P0 blocker / P1 must-fix / P2 nice).
3. Owner-reported mismatches from live mock sessions enter the backlog as P0 automatically.
4. Where implementation repeatedly falls short, Lyra takes over the component directly — this is expected behavior on this project, not a failure of process.

## Current verification notes

The real Bluebook application remains the visual reference authority. The repository currently uses provisional independent design tokens until the capture pack is available; no release claim may call the UI pixel-perfect before that pass is complete.

The current simulator implements the documented 4-module timing model, locked module transitions, a mandatory 10-minute inter-section break, score-based M2 routing, structured original question data, Math SPR input normalization, platform-aware keyboard shortcuts/Help, static local persistence, calculator and reference tools, robust start-code input, session recovery checks, student-facing metadata isolation, and raw practice results reporting.

The question-quality layer now also checks 147 effective records, authored R&W source coverage/length, duplicate prompt/source/options, adaptive pair integrity, curated hard Math SPR records, MCQ answer-position balance plus semantic mapping preservation, and idempotence.

The simulator does not attempt to emulate a specific testing-center Wi-Fi SSID from browser JavaScript. Network policy/proctor operations are outside the local practice engine and should not be represented as a fabricated client-side gate.

## Launch checklist (before first student session)

- [ ] Full-run simulation passes end to end on the deployment target
- [ ] Every screen in the inventory matches its capture, signed off in review
- [ ] Question bank complete per volume table and human-reviewed
- [ ] Session/proctor flow tested with a real room-sized group
- [ ] Results summary accurate and clearly labeled as practice-only
- [ ] Recovery tested across refresh/device interruption scenarios and malformed local state cases
- [ ] Production calculator path selected and verified (approved external integration or independent fallback)
- [ ] Windows/ChromeOS shortcut smoke is green
- [ ] macOS shortcut routing is statically and behaviorally validated on a Mac
- [ ] iPad shortcut routing, touch zoom, and keyboard focus are validated on a real iPad
- [ ] Screen-reader and reduced-motion checks pass on the supported device matrix

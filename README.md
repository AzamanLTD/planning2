# Azaman SAT Practice Simulator

A browser-based SAT practice experience for Azaman students that mirrors the Bluebook test-day workflow screen for screen — sign-in, Your Tests, the 10-step check-in wizard, exam chrome, and Check Your Work. All questions and sources are original Azaman content; the interface replicates the documented Bluebook workflow for authentic practice.

## Current implementation

- Reading and Writing: 2 × 32-minute modules, 27 questions each
- Math: 2 × 35-minute modules, 22 questions each
- Mandatory 10-minute break between Reading and Writing and Math
- Bluebook-style flow: sign-in choice, student-account credentials, Your Tests dashboard, 10-step exam-setup check-in wizard (welcome, your info, room code, accommodations, accessibility aids, equipment check, testing rules with typed agreement, start code, directions, check-in complete), and module directions
- Absolute-deadline timers that survive page refreshes
- Locked module transitions with score-based easy/hard Module 2 routing
- Back/Next navigation, question menu/review grid, and Mark for Review
- Highlights, notes, line reader, option elimination, zoom, timer hide/show, and keyboard shortcuts
- Platform-aware Help and shortcut reference for Windows/ChromeOS, macOS, and iPad
- Math multiple-choice and student-produced-response input with normalization/persistence
- Scientific calculator with safe expression evaluation, degree trig, implicit multiplication, guarded tangent singularities, and an independent lightweight graphing mode
- Formula reference sheet and draggable/resizable tool panels
- Pre-boot recovery guard that repairs stale/corrupt timed-session state, prevents reopening completed modules, and clears non-contiguous completion flags created by malformed state
- Robust six-digit start-code entry with paste, arrow-key, backspace, and assistive labels
- Student-facing UI hides internal domain/skill/difficulty metadata and neutralizes demo credential placeholders
- Practice completion report with Reading and Writing / Math and per-module raw accuracy
- Accessibility semantics for answer controls, test tools, review dialogs, calculator tabs, start-code fields, and reduced-motion preferences
- Deterministic MCQ answer-position balancing so the correct choice is not predictably concentrated in one option position
- Automated question-bank validation, authored-source content audit, source-override coverage, diversity audit, adaptive-variant integrity checks, answer-position balance, static contracts, recovery edge-case tests, SPR normalization contracts, accessibility contracts, representative Chromium smoke, complete 98-question Chromium smoke, mobile viewport smoke, dedicated Help smoke, and timer-warning recovery smoke
- Responsive static frontend with no runtime service dependency

## Network boundary

This simulator does not fabricate a testing-center SSID lock. A browser application should not pretend to know the center's Wi-Fi identity unless a real deployment service supplies that contract. The local practice engine therefore keeps exam-state behavior independent of a guessed Wi-Fi value.

## Practice bank

The repository contains 147 structured original question records across the launch modules and adaptive variants. CI validates counts, unique IDs, required metadata, question-type shape, Math SPR volume, hard-module tagging, domain coverage, source length, and exact full-item uniqueness. The content audit loads the same authored R&W source overrides used at runtime and requires every R&W source to meet the 25-word minimum while the override contract protects the authored source manifest from silent drift. Diversity CI blocks exact repeated prompts, sources, and option sets. Adaptive-variant CI checks substantive easy/hard differences and hard tagging. The answer-position audit also keeps the multiple-choice key distribution within a defined balance band. Editorial review remains a release requirement; passing CI is not a substitute for human review of question quality.

## Demo credentials

- Sign-in accepts any full name and email (practice simulator; nothing is transmitted)
- Room code: type `AZMPR` in the five letter boxes (letters only, like real Bluebook room codes — digits are rejected). `AZMPR` bridges to the internal fixture code `AZM24`, which the app also accepts programmatically.
- Start code: `492776`

These values are documented only for proctor/developer setup. They are intentionally not shown in student-facing UI fields or help text.

## Source-of-truth project documents

- `ASSIGNMENT.md` — owner brief and acceptance criteria
- `docs/bluebook-spec.md` — verified exam facts and behavioral requirements
- `docs/question-set-guidelines.md` — question-bank coverage and quality bar
- `docs/review-protocol.md` — branch, review, QA and launch discipline
- `docs/content-quality.md` — automated/editorial content-quality gate
- `docs/launch-checklist.md` — release acceptance checklist
- `docs/platform-readiness.md` — 2026–27 platform and accessibility readiness matrix
- `docs/full-run-verification.md` — complete adaptive 98-question browser gate
- `docs/qa-matrix.md` — consolidated automated and human QA matrix
- `docs/captures/INDEX.md` — reference-capture requirements and evidence map

## Verification status

Automated CI covers JavaScript syntax, effective question-bank shape/coverage, content integrity, authored-source override coverage, diversity, adaptive-variant integrity, answer-position balance, calculator safety, static simulator contracts, accessibility contracts, session recovery edge cases, SPR normalization and scoring, representative browser smoke, the complete 98-question adaptive run, mobile viewport layout, dedicated Help shortcut behavior, and timer-warning recovery. The real Bluebook application remains the visual reference authority. The repository intentionally uses Azaman-owned provisional design tokens until the permitted reference-capture pass is completed, so the product is not described as pixel-perfect.

Known release work includes human editorial review of every item, deeper accessibility/device review, richer image/chart interactions, exact calculator parity decisions, extended interruption/recovery testing, real group/proctor-session testing, reference-capture comparison, production deployment, and owner signoff.

## Run locally

Serve the repository through any static HTTP server rather than opening files directly:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Non-affiliation

This is an independent Azaman practice product and is not affiliated with or endorsed by College Board. All practice questions and interface assets in this repository are original.

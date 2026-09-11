# Azaman Digital SAT Exam-Model Simulator

An offline-capable, browser-delivered SAT exam-model experience for Azaman that mirrors the Bluebook-style test-day workflow as closely as permitted by the supplied references: sign-in, Your Tests, exam setup, check-in, exam chrome, question navigation, testing tools, accessibility surfaces, module transitions, and completion. All question content and non-College-Board assets are Azaman-owned originals; the application is independent and is not affiliated with College Board.

## Current implementation

- Reading and Writing: 2 × 32-minute modules, 27 questions each
- Math: 2 × 35-minute modules, 22 questions each
- Mandatory 10-minute break between Reading and Writing and Math
- Test-day flow: sign-in choice, student-account credentials, Your Tests dashboard, five-step exam setup, 10-step exam check-in, and module directions
- Absolute-deadline timers that survive page refreshes
- Actual exam-mode guard: normal student runs cannot advance to the next module before the active timer expires; the QA harness retains early-review behavior for automated testing
- Locked module transitions with score-based easy/hard Module 2 routing
- Back/Next navigation, question menu/review grid, and Mark for Review
- Highlights, notes, line reader, option elimination, zoom, timer hide/show, and platform-aware keyboard shortcuts
- Math multiple-choice and student-produced-response input with normalization/persistence
- Scientific calculator with safe expression evaluation, degree trig, implicit multiplication, guarded tangent singularities, and independent lightweight graphing
- Formula reference sheet with compact layout, zoom/pan, and draggable/resizable tool panel behavior
- Calculator/reference keyboard Move mode and touch/pointer handling
- Pre-boot recovery guard that repairs stale/corrupt timed-session state, prevents reopening completed modules, and clears malformed completion states
- Robust five-letter room-code and six-digit start-code entry with paste, arrow-key, backspace, and assistive labels
- Rich Assistive Technology dialog with Expand All / Collapse All and speech-to-text guidance
- Floating accessibility rail with volume and notification controls
- Local Test Your Device readiness dialog
- Student-facing UI hides internal domain/skill/difficulty metadata and neutralizes demo credential placeholders
- Practice completion report and detailed module accuracy reporting retained as a QA/development surface
- Automated question-bank validation, authored-source content audit, source-override coverage, diversity audit, adaptive-variant integrity checks, answer-position balance, static contracts, recovery edge-case tests, SPR normalization contracts, accessibility contracts, representative Chromium smoke, complete 98-question Chromium smoke, mobile viewport smoke, dedicated Help smoke, timer-warning recovery smoke, and a dedicated fidelity contract

## Offline runtime

The application is designed as a static offline exam model. All runtime HTML/CSS/JavaScript/question-bank assets are precached by the service worker and existing assets are served cache-first, so an installed exam build does not wait on network access during testing. The local state engine uses browser persistence for answers, flags, notes, highlights, timers, setup, and check-in recovery.

The simulator does not fabricate a testing-center SSID lock. Center networking, proctor administration, and secure test-session policy belong to a real deployment layer rather than the browser exam-state engine.

## Content bank

The repository contains 147 structured original question records across the launch modules and adaptive variants. CI validates counts, unique IDs, required metadata, question-type shape, Math SPR volume, hard-module tagging, domain coverage, source length, exact full-item uniqueness, and answer-position distribution. Diversity and adaptive-variant checks prevent silent duplication or non-substantive easy/hard routing. Editorial review remains a release requirement; passing automation is not a substitute for human review.

## Demo/proctor setup values

- Sign-in: any non-empty student name and email can be used in the local build
- Room code: any complete five-letter room code is accepted by the offline check-in flow
- Start code: `492776`

These values are for local/proctor development only and are not required by the normal student-facing copy.

## Source-of-truth project documents

- `ASSIGNMENT.md` — owner brief and acceptance criteria
- `docs/bluebook-spec.md` — verified exam facts and behavioral requirements
- `docs/question-set-guidelines.md` — question-bank coverage and quality bar
- `docs/review-protocol.md` — branch, review, QA and launch discipline
- `docs/content-quality.md` — automated/editorial content-quality gate
- `docs/launch-checklist.md` — release acceptance checklist
- `docs/platform-readiness.md` — platform and accessibility readiness matrix
- `docs/full-run-verification.md` — complete adaptive 98-question browser gate
- `docs/qa-matrix.md` — consolidated automated and human QA matrix
- `docs/captures/INDEX.md` — supplied-reference capture evidence and remaining verification notes

## Verification status

Automated CI covers JavaScript syntax, effective question-bank shape/coverage, content integrity, authored-source override coverage, diversity, adaptive-variant integrity, answer-position balance, calculator safety, static simulator contracts, accessibility contracts, session recovery edge cases, SPR normalization and scoring, representative browser smoke, the complete 98-question adaptive run, mobile viewport layout, dedicated Help shortcut behavior, timer-warning recovery, offline precache coverage, and reference-fidelity contracts. Visual comparison remains an iterative engineering task driven by the supplied reference captures and future permitted device captures.

## Run locally

Serve the repository through a local static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080` and allow the service worker to install before taking the build offline.

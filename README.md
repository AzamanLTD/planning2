# Azaman SAT Practice Simulator

An independent browser-based SAT practice experience for Azaman students. The product models the documented digital SAT/Bluebook workflow without reproducing College Board branding, proprietary assets, or College Board questions.

## Current implementation

- Reading and Writing: 2 × 32-minute modules, 27 questions each
- Math: 2 × 35-minute modules, 22 questions each
- Mandatory 10-minute break between Reading and Writing and Math
- Practice access-code, student, check-in, room-code, start-code, and module-directions flow
- Absolute-deadline timers that survive page refreshes
- Locked module transitions with score-based easy/hard Module 2 routing
- Back/Next navigation, question menu/review grid, and Mark for Review
- Highlights, notes, line reader, option elimination, zoom, timer hide/show, and keyboard shortcuts
- Math multiple-choice and student-produced-response input with normalization/persistence
- Scientific calculator with safe expression evaluation and an independent lightweight graphing mode
- Formula reference sheet and draggable/resizable tool panels
- Pre-boot recovery guard that repairs stale/corrupt timed-session state and prevents reopening completed modules
- Automated question-bank validation, static contract tests, recovery edge-case tests, and Chromium browser smoke coverage
- Responsive static frontend with no runtime service dependency

## Practice bank

The repository contains 147 structured original question records across the launch modules and adaptive variants. CI validates counts, unique IDs, required metadata, question-type shape, Math SPR volume, hard-module tagging, and domain coverage. Editorial review remains a release requirement; passing CI is not a substitute for human review of question quality.

## Demo credentials

- Access code: `SAT26` (also `PRACTICE` or `AZM-SAT`)
- Room code: `AZM24`
- Start code: `492776`

## Source-of-truth project documents

- `ASSIGNMENT.md` — owner brief and acceptance criteria
- `docs/bluebook-spec.md` — verified exam facts and behavioral requirements
- `docs/question-set-guidelines.md` — question-bank coverage and quality bar
- `docs/review-protocol.md` — branch, review, QA and launch discipline
- `docs/captures/INDEX.md` — reference-capture requirements and evidence map

## Verification status

The implementation has automated CI coverage for syntax, content contracts, recovery edge cases, and a real Chromium smoke run. The real Bluebook application remains the visual reference authority. The repository intentionally uses Azaman-owned provisional design tokens until the permitted reference-capture pass is completed, so the product is not described as pixel-perfect.

Known release work includes human editorial review, deeper accessibility/device review, richer image/chart interactions, calculator parity decisions, extended recovery testing, real group/proctor-session testing, and owner signoff.

## Run locally

Serve the repository through any static HTTP server rather than opening files directly:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Non-affiliation

This is an independent Azaman practice product and is not affiliated with or endorsed by College Board. All practice questions and interface assets in this repository are original.

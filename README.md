# Azaman SAT Practice Simulator

An original browser-based SAT practice experience for Azaman students. The goal is high behavioral fidelity to the current digital SAT/Bluebook testing flow without reproducing College Board branding, proprietary assets, or questions.

## Current implementation

- Reading and Writing: 2 × 32-minute modules, 27 questions each
- Math: 2 × 35-minute modules, 22 questions each
- 10-minute break between sections
- Test-code, check-in, room-code, start-code and directions flow
- Wall-clock module timers with local persistence
- Back/Next navigation, review grid, and mark-for-review
- Multiple-choice and student-produced-response Math UI
- Calculator and reference-sheet tools
- Completion screen and local practice scoring
- Responsive static frontend with no runtime dependencies

## Demo credentials

- Access code: `SAT26` (also `PRACTICE` or `AZM-SAT`)
- Room code: `AZM24`
- Start code: `492776`

## Source-of-truth project documents

- `ASSIGNMENT.md` — owner brief and acceptance criteria
- `docs/bluebook-spec.md` — verified exam facts and behavioral requirements
- `docs/question-set-guidelines.md` — question-bank coverage and quality bar
- `docs/review-protocol.md` — branch, review, QA and launch discipline

## Important status

The current app is a functional foundation, not a claim of pixel-perfect completion. The spec still requires a real Bluebook reference-capture pass, exact design tokens, all official tools, richer original content, adaptive Module 2 selection, and full-run QA before student launch.

## Run locally

Open `index.html` in a browser, or use any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Non-affiliation

This is an independent Azaman practice product and is not affiliated with or endorsed by College Board. All practice questions are original.

# planning2 — Bluebook SAT Exam Replica

A pixel-faithful web replica of the College Board **Bluebook** digital SAT exam
experience. Purpose: students preparing for the SAT practice under conditions
identical to test day — same sign-in flow, same timed modules, same tools, same
screens — so the real exam feels familiar instead of intimidating.

## What this is

- A web app that mirrors the Bluebook exam experience end to end
- Sign-in with test code, exactly like proctored exam day
- Full-length digital SAT: Reading & Writing (2 modules) and Math (2 modules),
  timed to official specifications
- Every testing tool from the official Bluebook toolset
- An original question set written for this project (no College Board content)

## What this is not

- Not affiliated with or endorsed by College Board
- Does not use or reproduce College Board's copyrighted questions
- Not a scoring service for real SAT results

## Repository layout

| Path | Contents |
|---|---|
| `ASSIGNMENT.md` | The full assignment brief from the owner. Read this first. |
| `docs/bluebook-spec.md` | Verified exam structure, timings, flow, and tool inventory. Source of truth for behavior. |
| `docs/question-set-guidelines.md` | Requirements for the original question bank. |
| `docs/review-protocol.md` | Engineering standards, branch discipline, and review process. |

## Working agreement

Jarvis (Codex) builds. Lyra (the project's review agent) audits every PR
against the acceptance criteria in `docs/bluebook-spec.md` and takes over where
implementation falls short. The owner monitors mock exams run through this
app with real students.

Priority order: fidelity to the real exam experience above all else. No
invented features, no "improvements" to the Bluebook UX, no off-brand colors.

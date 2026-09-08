# Bluebook Exam Spec (verified facts + behavior requirements)

This document is the behavioral source of truth for the replica. Facts below
marked **[VERIFIED]** come from College Board's official published materials
(retrieved 2026-09-08). Items marked **[VERIFY]** must be confirmed against
the real Bluebook app during the reference-capture pass before implementation
is considered complete. Nothing in this file may be implemented from memory
alone when a screenshot can prove it.

## 1. Exam structure and timing [VERIFIED]

The digital SAT is two sections, each split into two adaptive modules:

| Stage | Content | Questions | Time |
|---|---|---|---|
| 1 | Reading & Writing — Module 1 | 27 | 32 min |
| 2 | Reading & Writing — Module 2 (adaptive) | 27 | 32 min |
| — | Break | — | 10 min |
| 3 | Math — Module 1 | 22 | 35 min |
| 4 | Math — Module 2 (adaptive) | 22 | 35 min |

- Total working time: 2 h 14 m plus the break and setup screens.
- R&W Module 2 difficulty adapts to Module 1 performance; same for Math.
  (For the replica, adaptive selection may be simplified: two pre-built
  difficulty variants per section, chosen by Module 1 score. Flag any
  deviation in review.)
- Question types: R&W — 4-option multiple choice. Math — 4-option multiple
  choice plus student-produced response (free-response numeric entry with
  fraction support).

## 2. Testing tools [VERIFIED — official College Board tool list]

These must all exist, with the real app's icons, placements, and interactions:

1. **Testing Timer** — shows time remaining in the module; can be hidden;
   alerts when 5 minutes remain.
2. **Calculator** — a Desmos-style scientific/graphing calculator, draggable
   anywhere on screen. Available on the SAT Math modules.
3. **Reference Sheet** — formula reference shown on all tests with math
   questions. [VERIFY] exact contents/layout from capture pass.
4. **Highlights & Notes** — highlight text in a question/passage; attach a
  note to a question.
5. **Mark for Review** — bookmark icon flags a question for return.
6. **Line Reader** — focus tool for reading test content.
7. **Option Eliminator** — strike through wrong answer choices; undoable.
8. **Question Menu (navigator)** — grid showing answered, unanswered, and
   marked questions; jump to any question in the section.
9. **Zoom** — pinch on tablets / keyboard shortcut on laptops.

## 3. Test-day flow (screen inventory) [VERIFY each screen in capture pass]

The replica must reproduce this sequence. Screen names are descriptive; the
capture pass supplies exact wording, layout, and styling:

1. **Sign-in / test code entry** — proctor gives a test code; student enters
   it to start. [VERIFY] exact sign-in variants (test code vs. College Board
   account login) and which apply to proctored test day.
2. **Exam setup** — student confirms info, agrees to test rules, device
   lock-in messaging.
3. **Welcome / instructions screens** — per-module directions: what the
   section covers, number of questions, time, calculator availability.
4. **Module screens** — the exam itself: passage left / questions right
   (R&W), question with tools bar, question counter, timer.
5. **Break screen** — 10-minute countdown, resume when ready (proctor-paced).
   [VERIFY] exact countdown behavior and messaging.
6. **Review screen** — end-of-module view listing questions: answered,
   unanswered, marked. Navigate back, then submit the module.
7. **Finish / survey screens** — completion confirmation and the test-day
   questionnaire flow. [VERIFY] wording and sequence.
8. **Results placeholder** — replica shows practice score summary
   (deviation from real app, which submits to College Board; approved by
   owner for this project).

Anything else observed during the capture pass gets added here first, then
implemented.

## 4. Reference capture (blocking task, do first)

Before feature code:

1. Install the real Bluebook app, run a full-length official practice test.
2. Screenshot every screen, state, and interaction (tools open/closed,
   calculator open, review screen, break, submit warnings).
3. Store captures in `docs/captures/` with a naming convention of
   `NN-screen-name[-state].png` in flow order.
4. Build `docs/captures/INDEX.md` mapping each capture to the screen
   inventory above.
5. Extract the visual token set from captures: exact hex values for
   backgrounds, headers, buttons, text, tool icons, states (hover, selected,
   eliminated, marked). Record in `docs/design-tokens.md`.

The token set in `docs/design-tokens.md` is the only permitted source of
colors and typography. No hardcoded literals in components.

## 5. Behavior requirements

- Timer counts down per module; auto-submits (or shows the real app's
  behavior) when time expires — [VERIFY] exact expiry behavior in capture
  pass and mirror it.
- Question navigation: next/back, question menu grid, review screen —
  never lose an answer on navigation.
- Answers persist across module revisit (back from review into questions).
- Module submission is final within a run: after submit, no re-entry to
  the module (matches real exam).
- Keyboard shortcuts mirror the real app where they exist. [VERIFY] list.
- Accessibility: keyboard navigable; color contrast as per real app.

## 6. Non-goals (explicit)

- No College Board branding reproduction beyond what is necessary to
  mirror the exam UX; label the app as a practice simulator in places the
  real app would show College Board identity — do not claim affiliation.
- No invented tools, screens, or "improvements" not in the real app.
- No real College Board questions, passages, or answer keys.

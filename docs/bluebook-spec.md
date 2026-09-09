# Bluebook Exam Spec (verified facts + behavior requirements)

This document is the behavioral source of truth for the replica. Facts below
marked **[VERIFIED]** come from College Board's official published materials
(retrieved 2026-09-09). Items marked **[VERIFY]** must be confirmed against
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
   anywhere on screen. Available on the SAT Math modules. **Beginning Fall
   2026, the embedded calculator can also be resized.**
3. **Reference Sheet** — formula reference shown on all tests with math
   questions. **Beginning Fall 2026, reference sheets can be shown in a
   different/compressed layout and students can use zoom and pan to inspect
   charts, graphs, and images.** [VERIFY] exact contents/layout from capture.
4. **Highlights & Notes** — highlight text in a question/passage; attach a
   note to a question.
5. **Mark for Review** — bookmark icon flags a question for return.
6. **Line Reader** — focus tool for reading test content.
7. **Option Eliminator** — strike through wrong answer choices; undoable.
8. **Question Menu (navigator)** — grid showing answered, unanswered, and
   marked questions; jump to any question in the section.
9. **Zoom** — pinch on tablets / keyboard shortcut on laptops and can also be
   used with reference-sheet/image inspection where supported.

### Keyboard shortcuts [VERIFIED — operating-system-specific official pages]

The current official Windows and macOS pages, and the current Bluebook
accessibility page, document operating-system-specific shortcut variants.
Windows uses Control-based combinations; macOS uses Command/Control or
Command/Option combinations depending on the action. ChromeOS uses a distinct
Control + Search + S command to open the shortcut list, while retaining the
same Control-based exam actions. iPad follows the Apple shortcut families and
has its own Help command. The official pages also document E in interfaces
that support a fifth response option; this SAT replica exposes only the four
answer choices present in its current question bank.

For the browser simulator, the implemented verified subset is:

| Function | Windows | ChromeOS | macOS | iPad |
|---|---|---|---|---|
| Keyboard shortcuts | F1 | Control + Search + S | F1 | F1 |
| Exam region forward/back | F6 / Shift+F6 | F6 / Shift+F6 | F6 / Shift+F6 | F6 / Shift+F6 |
| Zoom in/out/reset | Ctrl + + / Ctrl + - / Ctrl + 0 | Ctrl + + / Ctrl + - / Ctrl + 0 | Command + + / Command + - / Command + 0 | Command + + / Command + - / Command + 0 |
| Back | Ctrl + Alt + B | Ctrl + Alt + B | Command + Control + B | Command + Control + B |
| Next / review module | Ctrl + Alt + X | Ctrl + Alt + X | Command + Control + X | Command + Control + X |
| Question menu | Ctrl + Alt + G | Ctrl + Alt + G | Command + Control + G | Command + Control + G |
| Help | Ctrl + Alt + H | Ctrl + Alt + H | Command + Control + H | Command + Control + P |
| Directions | Ctrl + Alt + Shift + D | Ctrl + Alt + Shift + D | Command + Control + Shift + D | Command + Control + Shift + D |
| Line reader | Ctrl + L | Ctrl + L | Command + L | Command + L |
| Timer | Ctrl + Alt + T | Ctrl + Alt + T | Command + Option + T | Command + Option + T |
| Mark for Review | Ctrl + Alt + V | Ctrl + Alt + V | Command + Shift + V | Command + Shift + V |
| Highlights & Notes | Ctrl + H | Ctrl + H | Control + H | Control + H |
| Calculator | Ctrl + Alt + C | Ctrl + Alt + C | Command + Option + C | Command + Option + C |
| Reference sheet | Ctrl + Alt + R | Ctrl + Alt + R | Command + Option + R | Command + Option + R |
| Option eliminator mode | Ctrl + Alt + O | Ctrl + Alt + O | Command + Control + O | Command + Control + O |
| Eliminate A–D | Ctrl + Alt + 1–4 | Ctrl + Alt + 1–4 | Command + Option + 1–4 | Command + Option + 1–4 |
| Select A–D | Ctrl + Shift + 1–4 | Ctrl + Shift + 1–4 | Command + Control + 1–4 | Command + Control + 1–4 |

The exact official pages remain the authority for additional platform-specific
shortcut differences and assistive-technology commands. Pause Timer is an
accommodation-dependent Bluebook command and is not exposed as a normal practice
control in this simulator.

## 3. Test-day flow (screen inventory) [VERIFY each screen in capture pass]

The replica must reproduce this sequence. Screen names are descriptive; the
capture pass supplies exact wording, layout, and styling. Internally, the
simulator's setup/check-in state is represented as `checkin` so refresh recovery
can preserve the exact active state used by the browser runtime:

1. **Sign-in / test code entry** — proctor gives a test code; student enters
   it to start. [VERIFY] exact sign-in variants (test code vs. College Board
   account login) and which apply to proctored test day.
2. **Exam setup / check-in** — student confirms info, agrees to test rules,
   and acknowledges the practice workspace/setup reminders.
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
4. Build `docs/captures/INDEX.md` mapping each capture to the screen inventory
   above.
5. Extract the visual token set from captures: exact hex values for
   backgrounds, headers, buttons, text, tool icons, states (hover, selected,
   eliminated, marked). Record in `docs/design-tokens.md`.

The token set in `docs/design-tokens.md` is the only permitted source of colors
and typography. No hardcoded literals in components.

## 5. Behavior requirements

- Timer counts down per module; auto-submits (or shows the real app's
  behavior) when time expires — [VERIFY] exact expiry behavior in capture
  pass and mirror it.
- Question navigation: next/back, question menu, review screen —
  never lose an answer on navigation.
- Answers persist across module revisit (back from review into questions).
- Module submission is final within a run: after submit, no re-entry to
  the module (matches real exam).
- Keyboard shortcuts mirror the real app where they exist. [VERIFY] exact
  platform-specific list; the implemented subset above is based on the current
  official Windows/ChromeOS/macOS/iPad documentation.
- Accessibility: keyboard navigable; color contrast as per real app.
- Recovery: refresh during an active module or the scheduled break preserves
  the absolute deadline; stale or impossible persisted states are repaired
  without reopening completed modules. Setup/check-in state must also survive
  reload instead of falling back to the access screen.
- Current Fall 2026 tool behavior: reference-sheet zoom/pan and alternate
  layout controls are required in the simulator's math tool surface; calculator
  resizing remains required. [VERIFY] exact affordances from capture pass.

## 6. Network boundary [VERIFY / implementation boundary]

The browser simulator must not invent a client-side test-center SSID check.
Center Wi-Fi requirements, proctoring, room administration, and test-session
network policy belong to the deployment/proctor layer rather than the local
exam-state engine. The simulator may require a normal web connection to load
its assets, but once the app is running, local persistence and timed-state
behavior must not be tied to a fabricated SSID value.

Any future server-backed practice mode may add explicit session/network
controls, but those controls must be based on a real deployment contract,
not guessed Bluebook behavior.

## 7. Non-goals (explicit)

- No College Board branding reproduction beyond what is necessary to
  mirror the exam UX; label the app as a practice simulator in places the
  real app would show College Board identity — do not claim affiliation.
- No invented tools, screens, or "improvements" not in the real app.
- No real College Board questions, passages, or answer keys.

## 8. Official verification links

- Windows shortcuts: https://bluebook.collegeboard.org/help-center/windows-keyboard-shortcuts
- Chromebook shortcuts: https://bluebook.collegeboard.org/help-center/chromebook-keyboard-shortcuts
- macOS shortcuts: https://bluebook.collegeboard.org/help-center/macos-keyboard-shortcuts
- Accessibility / platform shortcuts: https://bluebook.collegeboard.org/students/accommodations-assistive-technology/accessing-bluebook-features-content
- Fall 2026 Bluebook updates: https://bluebook.collegeboard.org/test-admin/new-updated-features

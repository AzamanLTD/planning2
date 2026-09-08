# Assignment: Bluebook SAT Exam Replica (Web)

This is the owner's assignment, verbatim intent preserved. It is the single
authoritative brief for this project.

---

## The brief

Before we continue with the remaining work on Azaman, there is a new project:
build a web app exactly like Bluebook for the SAT exam. A pixel-faithful web
replica of the College Board Bluebook exam experience — sign-in with test code,
timed Reading & Writing and Math modules, question navigator, and review
screen.

Replicate the exact SAT Bluebook app, launched on the web. Every page needs to
be perfect and work the same as the actual SAT emulator. From signing in with
the test code to the timer to the questions, everything has to be the same,
because the students being prepared for the SAT need to get the exact feel of
the actual test. The owner will monitor them like an actual SAT exam and they
need to see how it works from start to end. Research anything unknown, but it
has to be exactly the same. Every button, every page, every timer. Don't miss
anything. No off colors, nothing. Do not add invented features — mirror it in
every way so that on actual test day the students are not nervous, because the
experience is identical. Check how the test starts (it is Math and English).
Write an original question set that makes sense. Time it exactly as long as the
actual SAT. Don't stop at good enough — it has to be perfect.

Deliverable: a deployable web app. (The owner's deployment agent will host it.)

---

## Success criteria (how we judge done)

1. **Sign-in flow matches test day.** A student who has used this app
   recognizes every screen of the real Bluebook sign-in and exam setup, in
   order, with no surprises.
2. **Module structure and timing are exact.** R&W Module 1 (27 q / 32 min),
   R&W Module 2, break, Math Module 1 (22 q / 35 min), Math Module 2 — per
   `docs/bluebook-spec.md`.
3. **All official testing tools present and behaving correctly** (timer,
   Desmos-style calculator, reference sheet, highlights & notes, mark for
   review, line reader, option eliminator, question menu, zoom).
4. **Question navigator and review screen** work exactly like the real exam.
5. **Visual fidelity.** Layout, typography, spacing, colors, and component
   styling match the real app as captured in the reference screenshot pack.
   Verified side-by-side during review.
6. **Original question bank** per `docs/question-set-guidelines.md` — SAT-style
   quality, zero College Board content.
7. **Full-run simulation works end to end** — a proctor can run a room of
   students through a complete mock exam without hitting a broken screen,
   dead button, or stuck state.

## Division of labor

- **Jarvis** implements. Branches, PRs, everything through the normal
  engineering discipline (see `docs/review-protocol.md`).
- **Lyra** reviews every PR against this brief and the spec, does research and
  verification passes, and takes over implementation where Jarvis falls short.
- **Owner** runs live mock exams with students and reports anything that feels
  different from the real Bluebook. Those reports are treated as P0 bugs.

## First task for Jarvis

Read `docs/bluebook-spec.md` fully. Then create the screenshot pack by
capturing the real Bluebook app (see spec section "Reference capture"), and
propose the component tree + screen inventory before writing feature code.
The review protocol requires plan-before-code on this project because
pixel fidelity is the whole point.

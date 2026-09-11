# Reference-driven fidelity plan

The supplied Bluebook reference captures are now treated as the current visual comparison set for the exam-model UI.

## Implemented in this pass

- Reworked check-in wizard outer chrome toward the captured Help / Return to Home / footer geometry.
- Replaced segmented-looking progress styling with a continuous long progress bar while retaining the existing step semantics.
- Enlarged and restyled room-code boxes and wizard navigation controls.
- Simplified the Your Tests surface toward the sparse reference composition and light background.
- Added the missing Test Your Device entry point to sign-in and a local-only device readiness dialog.
- Adjusted the student-account sign-in surface toward the captured email/password form while retaining compatibility with the existing state model.
- Added a distinct Module Is Over transition for the post-module direction state.
- Added an in-test accessibility rail matching the captured vertical control treatment.
- Expanded Assistive Technology into a scrollable accordion-style modal with speech-to-text, Chromebook dictation, Windows speech, magnification, and keyboard navigation sections.
- Added Exit the Exam to the More menu through the fidelity layer.
- Calibrated exam pane/background/footer/choice geometry toward the supplied captures.

## Deliberately preserved

The tested runtime state engine, timer persistence, adaptive routing, calculator logic, reference-sheet controls, answer persistence, recovery, and existing contract/browser smoke infrastructure were not replaced by the fidelity layer.

## Next calibration targets

The next pass should measure screenshots directly for exact pixel geometry: typography, icon silhouettes, header/footer heights, pane split, modal dimensions, focus states, and accessibility-rail spacing. It should then consolidate the accumulated legacy CSS/enhancement layers rather than adding another parallel override system.

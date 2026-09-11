# Reference fidelity implementation

The current main branch adds a small, isolated fidelity layer after the existing tested UI stack. It is intentionally offline and does not introduce network dependencies.

### Surfaces addressed

- Check-in wizard: simplified chrome, measured-style long progress track, larger room-code fields and footer controls.
- Your Tests: light sparse layout closer to supplied capture; non-reference portal blocks are suppressed on this surface.
- Account sign-in: visible form now follows the supplied email/password composition while preserving legacy state compatibility.
- Test Your Device: local-only readiness dialog added to the sign-in surface.
- Exam shell: pane/background/footer/answer-row calibration.
- Module transitions: distinct `This Module Is Over` save/auto-advance state.
- Assistive Technology: expandable, scrollable informational surface plus accessibility rail.
- More menu: Exit the exam entry point added without modifying the core state machine.

The implementation avoids changing the existing question-bank, timer, adaptive routing, calculator, recovery, and test-automation foundations.

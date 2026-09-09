# QA matrix

The canonical simulator is validated at three levels.

| Area | Automated gate | Human/deployment gate |
|---|---|---|
| State flow | session recovery contracts + complete-run Chromium smoke | full mock exam observation |
| Question content | bank integrity, diversity, adaptive, answer-key and source audits | editorial review of every item |
| Timing | timer warning smoke + persisted deadline/recovery tests | timed device run |
| Testing tools | calculator, reference, notes, highlights, elimination, navigator and Help contracts | interaction comparison against the permitted Bluebook reference captures |
| Accessibility | semantic, keyboard, reduced-motion and Help smoke | real keyboard, screen-reader and device validation |
| Deployment | Pages workflow contract | production URL launch check |

The complete-run smoke test is intentionally separate from representative browser smoke. A representative test catches interaction regressions in individual features; the complete-run gate catches broken transitions that only appear after multiple module submissions, variant changes, or the mandatory break.

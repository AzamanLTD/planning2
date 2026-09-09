# Full-run verification

The simulator must survive a complete 98-question practice session, not only representative smoke fixtures.

The CI browser gate `tests/full-run-smoke.html` exercises the effective runtime path in Chromium:

- renders every question in R&W Module 1 and Module 2 and verifies the 27-question navigator count;
- submits a perfect R&W Module 1 and verifies hard Module 2 routing;
- verifies Module 2 locks and starts the mandatory break;
- expires the break and verifies Math directions recovery;
- renders every question in Math Module 1 and Module 2 and verifies the 22-question count;
- submits a perfect Math Module 1 and verifies hard Module 2 routing;
- verifies Math SPR and MCQ presentation for every Math question;
- verifies final submission, all four completion flags, 98 persisted answers, and the practice results surface.

This gate does not attempt to wait for real 32/35-minute timers. It supplies future deadlines for the browser exercise and separately covers timer expiry and the five-minute warning in the existing browser smoke suite.

A passing full-run smoke test proves the integrated static simulator can traverse the complete adaptive exam structure without a broken screen or dead transition. It does not replace human editorial review, reference-capture comparison, or real-device accessibility validation.

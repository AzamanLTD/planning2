# Launch Checklist — planning2

This checklist is intentionally explicit about what automated CI proves and what still requires a human or a real deployment environment.

## Automated gates

- JavaScript syntax passes for every `.js` file.
- The six question-bank groups contain 147 total records with unique IDs.
- R&W and Math answer-choice / SPR structures are valid.
- Domain coverage and hard-module tagging remain within the configured QA ranges.
- Full-item signatures are unique.
- Exact repeated prompts, sources, and option sets are blocked.
- Multiple-choice answer-position distribution stays within the configured balance band.
- MCQ balancing preserves the original semantic correct-answer text and is idempotent.
- Curated hard Math SPR overrides are explicitly contract-tested for type, answer, prompt, and explanation.
- Adaptive Module 2 pairs are substantively different and hard variants are fully hard-tagged.
- Session recovery edge cases pass, including non-contiguous completion repair, invalid break prerequisites, later-completion cleanup, and terminal-state canonicalization.
- Accessibility contract checks pass.
- Chromium browser smoke passes the end-to-end simulator path, including keyboard shortcut help, directions shortcut, F6 region navigation, calculator/graph behavior, break recovery, and start-code accessibility.

## Human / environment gates

- Human editorial review of all 147 questions is complete.
- R&W source passages flagged by the content audit are rewritten and reviewed.
- Answer choices and rationales are checked for correctness, plausibility, and unintended clues.
- Real Bluebook reference captures are available and visual comparisons are complete.
- Accessibility is checked on the actual supported desktop/tablet devices.
- The production calculator path is selected and tested.
- Real group/proctor-session behavior is tested where a session service is intended.
- Refresh, tab close/reopen, and device interruption recovery are tested on the deployment target.
- Owner signs off the release.

## Fidelity boundary

The simulator must remain an independent practice product. It should reproduce verified behavior, not proprietary branding/assets, and must not invent client-side testing-center network or SSID enforcement that the software cannot actually verify.

# Reference Capture Pack

This folder is intentionally kept free of College Board/Bluebook screenshots or copied proprietary assets.

The repository's capture requirement remains **open** until the owner can run the official Bluebook app and capture the permitted reference states independently. Public documentation is used for behavioral verification, but it is not treated as a substitute for the required real-app visual capture pass.

## Current evidence map

| Flow | Evidence | Status |
|---|---|---|
| Sign-in / check-in | College Board SAT weekend student page and proctor materials | Behavioral reference only |
| Room/start codes | College Board / state proctor manuals | Behavioral reference only |
| R&W modules | College Board test directions | Timing/structure verified |
| Math modules | College Board test directions | Timing/structure verified |
| 5-minute timer warning | College Board SAT Weekend Student Guide | Behavior verified |
| Question menu / mark for review | College Board Bluebook practice guide | Behavior verified |
| Highlights & Notes | College Board SAT Weekend Student Guide | Behavior verified |
| Option eliminator | College Board SAT Weekend Student Guide | Behavior verified |
| Calculator | College Board SAT Weekend Student Guide | Availability verified; visual/UI capture pending |
| Reference sheet | College Board test directions | Availability verified; exact layout capture pending |
| Break | College Board SAT weekend student page + student guide | 10-minute section break verified |
| Submission | College Board SAT weekend student page | Automatic submission verified |
| Recovery | College Board SAT Weekend Student Guide | Saved-work/resume behavior verified |

## Official public sources

- https://bluebook.collegeboard.org/students/sat-weekend
- https://satsuite.collegeboard.org/practice/bluebook
- https://satsuite.collegeboard.org/media/pdf/english-pn-test-directions-bb.pdf
- https://bluebook.collegeboard.org/students/privacy-policy-use-bluebook

## Capture procedure when available

1. Run an official practice test in Bluebook on a permitted test device.
2. Capture each distinct screen/state and tool open/closed state that the owner is permitted to retain for internal reference.
3. Store files using `NN-screen-name[-state].png`.
4. Record each capture below with the observed wording, dimensions, measured spacing, and interaction notes.
5. Update `docs/design-tokens.md` only from observations that can actually be measured from the capture pack.

Until that pass is completed, no implementation in this repository should be described as a pixel-perfect reproduction of Bluebook.

# Design Tokens

These tokens are the current visual contract for the independent Azaman exam-model simulator. The values below combine the existing implementation tokens with the owner-supplied reference capture calibration. They are intentionally treated as **approximate capture-derived values**, not as proprietary College Board design-system claims.

## Core surfaces

```css
--color-page: #f7f7f8;
--color-surface: #ffffff;
--color-surface-muted: #f7f7f8;
--color-text: #202124;
--color-text-muted: #5f6368;
--color-border: #d4d6d9;
--color-border-strong: #9ea2a7;
--color-exam-topbar: #eaf2fb;
--color-preview-banner: #20286c;
--color-blue: #355bd5;
--color-logo-blue: #384bbf;
--color-cta-yellow: #ffd400;
--color-green: #1f7f46;
--color-danger: #c0392b;
```

## Capture-derived geometry guidance

| Surface | Current target |
|---|---|
| Check-in header | ~60 px high, white, no in-flow brand mark |
| Check-in footer | ~106 px high with large Back/Next controls |
| Check-in progress | ~8 px tall, long continuous rounded track |
| Room-code boxes | ~54 × 61 px, ~19 px gap on desktop |
| Exam top bar | ~70 px high |
| Exam workspace | ~48/52 stimulus/question split |
| Exam footer | ~72 px high |
| Answer row | ~57 px minimum height, ~8 px radius |
| Accessibility volume rail | tall floating control, compact companion notification control |

## Current fidelity status

- [x] Apply supplied reference screenshots to setup/check-in chrome
- [x] Calibrate Your Tests composition
- [x] Calibrate student-account sign-in surface
- [x] Calibrate exam split and pane backgrounds
- [x] Add dedicated module transition surface
- [x] Expand Assistive Technology modal structure
- [x] Add Test Your Device surface
- [x] Add actual exam-mode UI separation from QA harness
- [x] Make installed runtime service-worker cache-first and network-independent
- [ ] Measure individual icon paths against permitted device captures
- [ ] Measure exact typography metrics on target OS/device combinations
- [ ] Complete device-level touch/screen-reader parity capture

Until those final device-specific measurements are available, visual claims remain reference-calibrated rather than pixel-perfect.

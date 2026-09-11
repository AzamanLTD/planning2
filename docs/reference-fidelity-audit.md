# Reference Fidelity Audit — supplied capture set

## P0 — visual structure

| Surface | Current issue observed against supplied capture | Target |
|---|---|---|
| Check-in wizard | Card treatment, header composition, footer sizing, and short segmented progress treatment diverge | Borderless centered content, minimal header, large footer controls, continuous progress track |
| Your Tests | Excess portal content, dark background, extra metadata/actions | Sparse white dashboard/card matching the supplied test card |
| Student sign-in | Visible Full name field and loose link layout | Email + Password primary form, centered secondary links |
| Assistive Technology | Informational one-screen dialog rather than full expandable content surface | Scrollable accordion modal with Expand All / Collapse All and accessibility guidance |
| Accessibility rail | No equivalent persistent visual rail | Vertical speaker/volume + notification control treatment |
| Module transition | Directions can appear directly after a completed module | Dedicated "This Module Is Over" save/auto-advance state |

## P1 — exam surface

- Calibrate test pane split from captures rather than a fixed historical 43/57 assumption.
- Calibrate source/question backgrounds and divider contrast.
- Calibrate footer height, question menu pill, and navigation button dimensions.
- Tune answer-row height, option letter circles, selected state, and eliminator treatment.
- Tune exam header icon spacing and timer control geometry.

## P2 — tools and accessibility

- Compare calculator frame, internal controls, graph area, resize handle, and movement affordance against captures.
- Compare reference sheet frame, zoom/pan treatment, and compact layout.
- Measure Line Reader mask opacity/height/position from a permitted capture.
- Verify More menu ordering and menu item iconography.
- Verify keyboard focus rings and modal focus return across every overlay.

## P3 — implementation quality

- Consolidate CSS history/overrides after visual calibration is stable.
- Replace visible-label-based keyboard dispatch with stable action IDs.
- Reduce MutationObserver-driven feature injection where a single renderer can own the surface.
- Keep the runtime entirely local/static; no fabricated testing-center network checks.

# Reference Capture Pack

This index records the reference screenshots supplied by the project owner for the current fidelity pass. They are treated as visual evidence for internal engineering comparison. They are not copied into the repository.

## Supplied reference states

| State | Evidence | Fidelity use |
|---|---|---|
| Check-in room code | `03-room-code-filled-x2-trix.png` in supplied contact sheet | Wizard chrome, room-code boxes, success state, footer and progress geometry |
| Your Tests | `what-does-start-exam-setup-button-mean-in-the...` in supplied contact sheet | Dashboard composition, card spacing, Active/Past control, CTA |
| Math module | `Screenshot_20260909-073411.jpg` | Exam shell, calculator, question surface, footer |
| Math module with calculator | `Screenshot_20260909-072951.jpg` | Calculator placement and exam workspace |
| Directions modal | `Screenshot_20260909-072948.jpg` | Modal size, overlay and directions surface |
| Module transition | `Screenshot_20260909-072940.jpg` | `This Module Is Over` layout, copy and loader |
| Check Your Work | `Screenshot_20260909-072937.jpg` | Review navigator and overlay treatment |
| R&W data question | `Screenshot_20260909-072924.jpg` | R&W split pane, table stimulus and answer controls |
| Assistive Technology | `Screenshot_20260909-072917.jpg` | AT modal, accordions, accessibility rail |
| More menu | `Screenshot_20260909-072913.jpg` | Tool menu ordering and right-side accessibility rail |
| Sign In | `Screenshot_20260909-072756.jpg` | App login shell, branding, Test Your Device and buttons |
| Student Account Sign In | `Screenshot_20260909-072802.jpg` | Email/password form, focus/keyboard context |

## Current interpretation

The reference set establishes the visual target for the actual exam-model runtime. The practice/QA harness may retain additional instrumentation and early-review capabilities, but normal exam-model presentation should prioritize the captured application surface and should not expose QA-only affordances.

## Capture-derived requirements now implemented or being calibrated

- Check-in uses sparse page-level composition, borderless central content, large footer navigation, and a continuous visual progress bar.
- Your Tests uses a light sparse surface and a focused test card rather than a general student portal layout.
- Student-account sign-in uses the email/password visual surface; legacy student identity remains internal for local session state.
- Exam panes are calibrated toward a balanced split and white working surfaces.
- Module transitions have a dedicated full-screen state instead of reusing the scheduled break card.
- Assistive Technology has a scrollable accordion surface with Expand All / Collapse All.
- The exam accessibility rail is treated as a persistent overlay layer.
- Actual exam-model mode suppresses preview-only UI and blocks early module advance while retaining QA-harness behavior for automated smoke coverage.

## Remaining measurement work

Exact per-device typography, icon paths, pixel spacing and uncommon accessibility-device interactions still require additional permitted reference captures when available. Those should update `docs/design-tokens.md` and this index rather than being inferred from memory.

# Review Protocol — planning2

Applies on top of the standing AZM-Planning engineering discipline that
governs all AzamanLTD repos.

## Branch discipline

- One branch per task. Delete the branch after merge.
- One change per PR, max ~500 lines.
- Branch naming: `feat/<thing>`, `fix/<thing>`, `docs/<thing>`.

## Definition of done (per PR)

1. CI green: build passes, lint passes, no console errors on the happy path.
2. Pixel checks: any PR touching UI must include before/after comparison
   against the relevant screenshot in `docs/captures/` (or extend the capture
   pack first if the screen is not yet captured).
3. Behavior checks: claims in the PR description are verified against
   `docs/bluebook-spec.md` acceptance criteria. Lyra reviews each PR against
   the spec — a PR that ships code contradicting the spec is rejected, not
   patched. The recent PR-49 lesson applies: **validate against acceptance
   criteria before marking anything complete.**
4. No hardcoded colors or font sizes: all styles come from
   `docs/design-tokens.md` and the app's token file.
5. State integrity: navigation between questions, review screen, and tools
   never loses answers, marks, highlights, or notes within a module.

## Review flow

1. Jarvis opens PR with a plain, honest description of what is and is not
   done.
2. Lyra audits against the spec and the screenshot pack; findings are posted
   as review comments, severity-tagged (P0 blocker / P1 must-fix / P2 nice).
3. Owner-reported mismatches from live mock sessions enter the backlog as
   P0 automatically.
4. Where implementation repeatedly falls short, Lyra takes over the
   component directly — this is expected behavior on this project, not a
   failure of process.

## Launch checklist (before first student session)

- [ ] Full-run simulation passes end to end on the deployment target
- [ ] Every screen in the inventory matches its capture, signed off in
      review
- [ ] Question bank complete per volume table and human-reviewed
- [ ] Session/proctor flow tested with a real room-sized group
- [ ] Results placeholder and post-exam summary accurate

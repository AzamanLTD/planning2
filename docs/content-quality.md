# Content Quality Gate

The question bank is structurally complete at 147 original records. Editorial readiness is tracked separately so source quality cannot be hidden behind a passing schema check.

The automated audit now loads the exact runtime content, including `data/rw-source-overrides.js`, and checks duplicate IDs and full-item signatures, required metadata, answer-choice shape, Math SPR shape, required R&W sources, and the 25–150 word source-length guideline. R&W source passages are release-blocking when they fall below 25 words.

The current authored-source pass removes the previously identified generic placeholder passages and expands every previously flagged short R&W source to meet the minimum source-length gate. Future content edits must preserve those constraints.

## Release gate

Before student launch:

- every question has a rationale that explains why the keyed answer is correct;
- options are plausible, mutually distinct, and defensible;
- difficulty tags match the actual cognitive demand;
- adaptive Module 2 variants are substantively different, not merely renamed copies;
- a human reviewer signs off on the full 147-record set.

CI should enforce deterministic structural/content-integrity checks. Human editorial review remains a required release responsibility, even when automation is green.

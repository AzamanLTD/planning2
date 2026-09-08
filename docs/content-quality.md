# Content Quality Gate

The question bank is structurally complete at 147 original records. Editorial readiness is tracked separately so source quality cannot be hidden behind a passing schema check.

The automated audit loads the exact runtime content, including `data/rw-source-overrides.js` and `data/question-quality-overrides.js`, and checks duplicate IDs and full-item signatures, required metadata, answer-choice shape, Math SPR shape, required R&W sources, and the 25–150 word source-length guideline. R&W source passages are release-blocking when they fall below 25 words.

The authored-source pass removes the previously identified generic placeholder passages and expands every previously flagged short R&W source to meet the minimum source-length gate. The quality override layer also protects runtime question presentation: exact duplicate prompt/source/option-set groups are blocked, adaptive Module 2 variants must differ substantively, and multiple-choice answer positions are deterministically balanced so the correct choice is not predictably concentrated in one position.

Persisted-session validation also treats module completion as an ordered chain. A malformed state cannot mark a later module complete while an earlier module remains incomplete; recovery clears that impossible suffix before resuming the exam.

## Release gate

Before student launch:

- every question has a rationale that explains why the keyed answer is correct;
- options are plausible, mutually distinct, and defensible;
- difficulty tags match the actual cognitive demand;
- adaptive Module 2 variants are substantively different, not merely renamed copies;
- source passages meet the configured length and quality expectations;
- a human reviewer signs off on the full 147-record set.

CI should enforce deterministic structural/content-integrity checks. Human editorial review remains a required release responsibility, even when automation is green.

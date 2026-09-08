# Question Set Guidelines

The replica ships with an **original** question bank written for this project.
Zero College Board content. The bank must feel like a real digital SAT in
difficulty, coverage, and format.

## Volume (minimum for launch)

| Module | Count | Types |
|---|---|---|
| R&W Module 1 | 27 | 4-option MCQ |
| R&W Module 2 (harder variant) | 27 | 4-option MCQ |
| Math Module 1 | 22 | MCQ + student-produced response |
| Math Module 2 (harder variant) | 22 | MCQ + student-produced response |

Total: 98 questions, plus a second difficulty variant for the Module 2s
(R&W 27 + Math 22) = **147 questions** to author at launch. Over time the bank
grows so students can take multiple unique mock exams.

## Reading & Writing coverage

Per digital SAT domain weighting, each 27-question module should include:

- **Craft and Structure** (~28%): words in context, text structure and
  purpose, cross-text connections (paired-passage format).
- **Information and Ideas** (~26%): central ideas and details, command of
  evidence (textual and quantitative — include chart/table interpretation),
  inferences.
- **Standard English Conventions** (~26%): sentence boundaries, agreement,
  verb forms, punctuation (the "which choice completes the text so it
  satisfies the convention" format).
- **Expression of Ideas** (~20%): transitions, rhetorical synthesis
  (the "which choice most effectively accomplishes the goal" format).

Passages: 25-150 words each, short single-passage format (the digital SAT
does not use long passages). One passage per question, sometimes shared by
two paired questions.

## Math coverage

Per digital SAT domain weighting, each 22-question module should include:

- **Algebra** (~35%): linear equations, systems, inequalities.
- **Advanced Math** (~32%): nonlinear functions, quadratics, polynomials,
  exponent properties.
- **Problem Solving & Data Analysis** (~15%): ratios, rates, percentages,
  scatterplots, statistics.
- **Geometry & Trigonometry** (~15%): area/volume, lines/angles, triangles,
  circles, trig ratios.

Student-produced responses: roughly 25% of the delivered Math test. The
current launch bank contains 5 SPR items in Math Module 1 and 5 SPR items in
each Module 2 variant, yielding 10 SPR items in either complete 44-question
adaptive Math path (about 23%). Answers are non-negative integers, decimals,
or fractions — mirror the real entry UI, which shows fraction formatting.
[VERIFY] entry UI in capture pass.

## Quality bar

- Every question reviewed by at least one human editor for accuracy of the
  keyed answer, plausibility of distractors, and correct difficulty tier.
- Each question tagged: section, domain, skill, difficulty (easy/medium/hard),
  answer key, explanation (explanations are for the owner's teaching use after
  the exam — never shown during it).
- No trick questions, no ambiguity, no culturally inaccessible references.
- Data is JSON (or equivalent structured) so question sets can be swapped
  per exam session without code changes.

## Proctor / session model

- A proctor creates an exam session and gets a test code (like real exam
  day). Students enter the code to join.
- The question set is fixed per session (chosen variant for Module 2s decided
  by Module 1 performance at runtime — see spec §1).
- Keep an eye on the intended deployment: the owner's agent deploys this app
  with limited computing power. No heavyweight infra; static-friendly
  architecture preferred.

const fs = require('fs');
const assert = require('assert');

const smoke = fs.readFileSync('tests/full-run-smoke.html', 'utf8');
const ci = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const docs = fs.readFileSync('docs/full-run-verification.md', 'utf8');

assert(smoke.includes('FULL RUN SMOKE COMPLETE'), 'full-run smoke must expose a completion marker');
assert(smoke.includes("const bank = win.SAT_QUESTIONS.rw1"), 'full-run smoke must load effective R&W Module 1 questions');
assert(smoke.includes("const bank = win.SAT_QUESTIONS.rw2.hard"), 'full-run smoke must exercise hard R&W Module 2');
assert(smoke.includes('win.SAT_QUESTIONS.math1'), 'full-run smoke must load Math Module 1');
assert(smoke.includes('win.SAT_QUESTIONS.math2.hard'), 'full-run smoke must exercise hard Math Module 2');
assert(smoke.includes("bank.length === 27"), 'full-run smoke must enforce the R&W module size');
assert(smoke.includes('22, win.SAT_QUESTIONS.math1'), 'full-run smoke must enforce the Math module size');
assert(smoke.includes("state.screen = 'break'"), 'full-run smoke must exercise the required break');
assert(smoke.includes("next.screen === 'finish' && next.submitted === true"), 'full-run smoke must reach terminal submission');
assert(smoke.includes('Object.keys(next.answers).length === 98'), 'full-run smoke must persist 98 answers');
assert(ci.includes('tests/full-run-smoke.html'), 'CI must execute the full-run browser smoke');
assert(ci.includes('FULL RUN SMOKE COMPLETE'), 'CI must assert full-run browser completion');
assert(docs.includes('98-question'), 'full-run documentation must state the complete exam scope');

console.log('Full-run smoke contract passed.');

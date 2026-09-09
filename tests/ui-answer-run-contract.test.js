const fs = require('fs');
const assert = require('assert');

const smoke = fs.readFileSync('tests/ui-answer-run-smoke.html', 'utf8');
const workflow = fs.readFileSync('.github/workflows/ui-answer-run-smoke.yml', 'utf8');

for (const phrase of [
  'data-answer', '.spr-input', "#nextBtn", '#submitModule',
  "adaptive.rw === 'hard'", "adaptive.math === 'hard'",
  "s.screen==='break'", "s.screen==='finish' && s.submitted===true",
  'Object.keys(s.answers).length===98', 'UI ANSWER-RUN SMOKE COMPLETE'
]) assert(smoke.includes(phrase), `UI answer-run smoke missing coverage: ${phrase}`);
assert(workflow.includes('tests/ui-answer-run-smoke.html'), 'CI workflow must execute UI answer-run smoke');
assert(workflow.includes('UI ANSWER-RUN SMOKE COMPLETE'), 'CI workflow must assert UI answer-run completion');

console.log('UI answer-run smoke contract passed.');

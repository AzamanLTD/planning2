const fs = require('fs');
const assert = require('assert');

const smoke = fs.readFileSync('tests/ui-answer-run-smoke.html', 'utf8');
const workflow = fs.readFileSync('.github/workflows/ui-answer-run-smoke.yml', 'utf8');

assert(smoke.includes('UI ANSWER-RUN SMOKE COMPLETE'), 'completion marker missing');
assert(smoke.includes('data-answer'), 'MCQ UI selection coverage missing');
assert(smoke.includes('.spr-input'), 'SPR UI coverage missing');
assert(smoke.includes("adaptive.rw === 'hard'"), 'R&W adaptive routing coverage missing');
assert(smoke.includes("adaptive.math === 'hard'"), 'Math adaptive routing coverage missing');
assert(smoke.includes("s.screen==='break'"), 'break coverage missing');
assert(smoke.includes("s.screen==='finish' && s.submitted===true"), 'terminal coverage missing');
assert(smoke.includes('Object.keys(s.answers).length===98'), '98-answer persistence coverage missing');
assert(workflow.includes('tests/ui-answer-run-smoke.html'), 'workflow smoke target missing');
assert(workflow.includes('UI ANSWER-RUN SMOKE COMPLETE'), 'workflow completion assertion missing');

console.log('UI answer-run smoke contract passed.');

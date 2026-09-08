const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('data/questions.js', 'utf8');
const easy = fs.readFileSync('data/rw2-easy.js', 'utf8');
const overrideSource = fs.readFileSync('data/rw-source-overrides.js', 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
vm.runInNewContext(easy, sandbox);
vm.runInNewContext(overrideSource, sandbox);

const expected = [
  ...Array.from({ length: 27 }, (_, i) => `RW2E${i + 1}`),
  'RWM1Q2','RWM1Q3','RWM1Q4','RWM1Q5','RWM1Q6','RWM1Q7','RWM1Q8','RWM1Q11','RWM1Q12','RWM1Q13','RWM1Q14','RWM1Q15','RWM1Q18','RWM1Q19','RWM1Q20','RWM1Q21','RWM1Q23','RWM1Q24','RWM1Q25','RWM1Q26','RWM1Q27',
  'RWM2HQ1','RWM2HQ4','RWM2HQ5','RWM2HQ6','RWM2HQ7','RWM2HQ8','RWM2HQ10','RWM2HQ11','RWM2HQ12','RWM2HQ13','RWM2HQ14','RWM2HQ15','RWM2HQ17','RWM2HQ18','RWM2HQ19','RWM2HQ20','RWM2HQ21','RWM2HQ22','RWM2HQ23','RWM2HQ25','RWM2HQ26','RWM2HQ27'
];

assert.equal(new Set(expected).size, 70, 'expected authored source override manifest must contain 70 unique IDs');
for (const id of expected) assert(overrideSource.includes(`${id}:`), `override source is missing ${id}`);

const rw = [sandbox.window.SAT_QUESTIONS.rw1, sandbox.window.SAT_QUESTIONS.rw2.easy, sandbox.window.SAT_QUESTIONS.rw2.hard];
const byId = new Map(rw.flat().map((q) => [q.id, q]));
for (const id of expected) {
  const q = byId.get(id);
  assert(q, `runtime question ${id} is missing`);
  const words = q.source?.paragraphs?.join(' ').trim().split(/\s+/).filter(Boolean).length || 0;
  assert(words >= 25 && words <= 150, `${id} override source must be 25-150 words, got ${words}`);
}

console.log('R&W authored-source override contract passed for 70 IDs.');

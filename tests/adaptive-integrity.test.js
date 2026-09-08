const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = { window: {} };
for (const path of ['data/questions.js', 'data/rw2-easy.js']) vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
const b = sandbox.window.SAT_QUESTIONS;

function signature(q) {
  return JSON.stringify({ prompt: q.prompt, options: q.options || [], answer: q.answer, source: q.source || null });
}
function pairReport(easy, hard, label) {
  assert.equal(easy.length, hard.length, `${label} easy/hard counts must match`);
  const exactMatches = easy.reduce((count, q, i) => count + (signature(q) === signature(hard[i]) ? 1 : 0), 0);
  const distinct = easy.length - exactMatches;
  assert(distinct >= Math.ceil(easy.length * 0.75), `${label} adaptive variants must be substantively different: only ${distinct}/${easy.length} pairs differ`);
  const hardTagged = hard.filter((q) => q.difficulty === 'hard').length;
  assert(hardTagged >= Math.ceil(hard.length * 0.75), `${label} hard variant is under-tagged: ${hardTagged}/${hard.length}`);
  console.log(`${label}: ${distinct}/${easy.length} pair signatures differ; ${hardTagged}/${hard.length} are hard-tagged.`);
}

pairReport(b.rw2.easy, b.rw2.hard, 'Reading and Writing Module 2');
pairReport(b.math2.easy, b.math2.hard, 'Math Module 2');
console.log('Adaptive variant integrity checks passed.');

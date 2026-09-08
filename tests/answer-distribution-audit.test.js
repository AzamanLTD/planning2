const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = { window: {} };
for (const path of ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js', 'data/question-quality-overrides.js']) {
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
}
const b = sandbox.window.SAT_QUESTIONS;
const groups = [b.rw1, b.rw2.easy, b.rw2.hard, b.math1, b.math2.easy, b.math2.hard];
const letters = ['A', 'B', 'C', 'D'];
const counts = { A: 0, B: 0, C: 0, D: 0 };
let mcq = 0;
for (const group of groups) for (const q of group) {
  if (q.type === 'spr') continue;
  mcq++;
  assert(letters.includes(q.answer), `${q.id} has invalid MCQ answer position`);
  assert.equal(new Set(q.options).size, 4, `${q.id} contains duplicate answer choices`);
  const answerIndex = letters.indexOf(q.answer);
  assert(q.options[answerIndex], `${q.id} keyed answer has no corresponding option`);
  counts[q.answer]++;
}
assert.equal(mcq, 132, `expected 132 MCQ items, got ${mcq}`);
for (const [letter, count] of Object.entries(counts)) {
  assert(count >= 26 && count <= 40, `answer position ${letter} is imbalanced: ${count}/${mcq}`);
}
console.log(`Answer-position distribution: A=${counts.A}, B=${counts.B}, C=${counts.C}, D=${counts.D} across ${mcq} MCQ items.`);

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = { window: {} };
for (const path of ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js', 'data/question-quality-overrides.js']) {
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
}

const bank = sandbox.window.SAT_QUESTIONS;
const groups = [
  ['rw1', bank.rw1], ['rw2.easy', bank.rw2.easy], ['rw2.hard', bank.rw2.hard],
  ['math1', bank.math1], ['math2.easy', bank.math2.easy], ['math2.hard', bank.math2.hard]
];
const all = groups.flatMap(([, items]) => items);
const letters = ['A', 'B', 'C', 'D'];
const normalize = (value) => String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();

for (const question of all) {
  if (question.type === 'spr') {
    assert.equal(question.section, 'Math', `${question.id}: SPR is only valid for Math`);
    assert.notEqual(normalize(question.answer), '', `${question.id}: SPR answer cannot be empty`);
    assert(!question.options || question.options.length === 0, `${question.id}: SPR must not provide MCQ options`);
    continue;
  }

  assert(Array.isArray(question.options), `${question.id}: MCQ must provide options`);
  assert.equal(question.options.length, 4, `${question.id}: MCQ must provide exactly four options`);
  const normalizedOptions = question.options.map(normalize);
  assert.equal(new Set(normalizedOptions).size, 4, `${question.id}: MCQ options must be mutually distinct`);

  const answerIndex = letters.indexOf(String(question.answer).toUpperCase());
  assert(answerIndex >= 0, `${question.id}: answer must be an A-D key`);
  const correctText = normalize(question.options[answerIndex]);
  assert.notEqual(correctText, '', `${question.id}: keyed answer cannot be empty`);
  assert.equal(normalizedOptions.filter((option) => option === correctText).length, 1, `${question.id}: keyed answer must identify exactly one option`);
}

for (const [name, items] of groups.filter(([name]) => name.startsWith('math'))) {
  const sprCount = items.filter((question) => question.type === 'spr').length;
  assert.equal(sprCount, 5, `${name}: launch bank expects exactly five SPR items`);
  assert.equal(items.length - sprCount, 17, `${name}: launch bank expects seventeen MCQ items`);
}

console.log(`Effective question integrity checks passed for ${all.length} items; each Math delivery group contains 5 SPR + 17 MCQ.`);
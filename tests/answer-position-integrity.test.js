const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sourceFiles = ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js'];
const qualitySource = fs.readFileSync('data/question-quality-overrides.js', 'utf8');

function load(withQuality, runQualityTwice = false) {
  const sandbox = { window: {} };
  for (const path of sourceFiles) vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
  if (withQuality) {
    vm.runInNewContext(qualitySource, sandbox);
    if (runQualityTwice) vm.runInNewContext(qualitySource, sandbox);
  }
  return sandbox.window.SAT_QUESTIONS;
}

const baseline = load(false);
const effective = load(true);
const effectiveTwice = load(true, true);
const groups = (bank) => [bank.rw1, bank.rw2.easy, bank.rw2.hard, bank.math1, bank.math2.easy, bank.math2.hard].flat();
const letters = ['A', 'B', 'C', 'D'];

const baselineById = new Map(groups(baseline).map((question) => {
  const index = letters.indexOf(String(question.answer).toUpperCase());
  return [question.id, index >= 0 ? question.options[index] : null];
}));
for (const question of groups(effective)) {
  const originalCorrectText = baselineById.get(question.id);
  if (originalCorrectText === null || originalCorrectText === undefined) continue;
  const answerIndex = letters.indexOf(String(question.answer).toUpperCase());
  assert(answerIndex >= 0, `${question.id} lost its answer letter`);
  assert.equal(question.options[answerIndex], originalCorrectText, `${question.id} changed its correct answer text during balancing`);
}

assert.deepEqual(effectiveTwice, effective, 'answer-position balancing is not idempotent');
console.log('Answer-position integrity checks passed for all effective MCQ records.');

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = { window: {} };
for (const path of ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js', 'data/question-quality-overrides.js']) {
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
}

const all = [
  ...sandbox.window.SAT_QUESTIONS.rw1,
  ...sandbox.window.SAT_QUESTIONS.rw2.easy,
  ...sandbox.window.SAT_QUESTIONS.rw2.hard,
  ...sandbox.window.SAT_QUESTIONS.math1,
  ...sandbox.window.SAT_QUESTIONS.math2.easy,
  ...sandbox.window.SAT_QUESTIONS.math2.hard
];
const byId = new Map(all.map((question) => [question.id, question]));

const expected = {
  MM2HQ14: '60',
  MM2HQ20: '2',
  MM2HQ21: '4',
  MM2HQ22: '64'
};

for (const [id, answer] of Object.entries(expected)) {
  const question = byId.get(id);
  assert(question, `missing curated hard Math item ${id}`);
  assert.equal(question.section, 'Math');
  assert.equal(question.difficulty, 'hard');
  assert.equal(question.type, 'spr', `${id} must remain an SPR item`);
  assert.equal(question.answer, answer, `${id} answer changed`);
  assert(!question.options || question.options.length === 0, `${id} SPR must not expose MCQ options`);
  assert(question.prompt.length > 30, `${id} prompt was unexpectedly truncated`);
  assert(question.explanation.length > 20, `${id} explanation is missing substantive guidance`);
}

console.log('Curated hard Math SPR override checks passed.');

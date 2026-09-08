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
  MM2HQ1: { answer: '1', type: 'mcq', domain: 'Algebra' },
  MM2HQ2: { answer: '6', type: 'mcq', domain: 'Algebra' },
  MM2HQ3: { answer: '10', type: 'mcq', domain: 'Advanced Math' },
  MM2HQ4: { answer: '√5', type: 'mcq', domain: 'Advanced Math' },
  MM2HQ5: { answer: '5', type: 'spr', domain: 'Advanced Math' },
  MM2HQ6: { answer: '30,000', type: 'mcq', domain: 'Problem Solving and Data Analysis' },
  MM2HQ7: { answer: '10√3', type: 'mcq', domain: 'Geometry and Trigonometry' },
  MM2HQ8: { answer: '114', type: 'mcq', domain: 'Algebra' },
  MM2HQ9: { answer: '8', type: 'mcq', domain: 'Advanced Math' },
  MM2HQ10: { answer: '6', type: 'mcq', domain: 'Problem Solving and Data Analysis' },
  MM2HQ11: { answer: '54π', type: 'mcq', domain: 'Geometry and Trigonometry' },
  MM2HQ12: { answer: '5/3', type: 'mcq', domain: 'Algebra' },
  MM2HQ13: { answer: '3', type: 'mcq', domain: 'Advanced Math' },
  MM2HQ14: { answer: '7.5', type: 'spr', domain: 'Problem Solving and Data Analysis' },
  MM2HQ15: { answer: '36', type: 'mcq', domain: 'Geometry and Trigonometry' },
  MM2HQ16: { answer: '16', type: 'mcq', domain: 'Algebra' },
  MM2HQ17: { answer: '8/5', type: 'mcq', domain: 'Advanced Math' },
  MM2HQ18: { answer: '7/15', type: 'mcq', domain: 'Problem Solving and Data Analysis' },
  MM2HQ19: { answer: '−6', type: 'mcq', domain: 'Geometry and Trigonometry' },
  MM2HQ20: { answer: '34', type: 'spr', domain: 'Algebra' },
  MM2HQ21: { answer: '16', type: 'spr', domain: 'Advanced Math' },
  MM2HQ22: { answer: '108', type: 'spr', domain: 'Problem Solving and Data Analysis' }
};

for (const [id, contract] of Object.entries(expected)) {
  const question = byId.get(id);
  assert(question, `missing curated hard Math item ${id}`);
  assert.equal(question.section, 'Math');
  assert.equal(question.difficulty, 'hard', `${id} must remain hard`);
  assert.equal(question.type, contract.type, `${id} changed response type`);
  assert.equal(question.domain, contract.domain, `${id} changed domain`);
  assert(question.prompt.length > 45, `${id} prompt should require meaningful reasoning`);
  assert(question.explanation.length > 60, `${id} explanation should contain substantive guidance`);

  if (question.type === 'spr') {
    assert(!question.options || question.options.length === 0, `${id} SPR must not expose MCQ options`);
    assert.equal(question.answer, contract.answer, `${id} answer changed`);
  } else {
    assert.equal(question.options.length, 4, `${id} must have four answer choices`);
    const answerIndex = ['A', 'B', 'C', 'D'].indexOf(question.answer);
    assert(answerIndex >= 0, `${id} lost its answer letter`);
    assert.equal(question.options[answerIndex], contract.answer, `${id} correct answer text changed`);
    assert.equal(new Set(question.options).size, 4, `${id} has duplicate answer choices`);
  }
}

const hard = all.filter((question) => question.id.startsWith('MM2HQ'));
assert.equal(hard.length, 22, 'Math M2 hard module must contain 22 items');
assert.equal(hard.filter((question) => question.difficulty === 'hard').length, 22, 'all Math M2 hard items must be hard-tagged');

console.log('Curated hard Math Module 2 checks passed for all 22 items.');
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

function loadBank() {
  const source = fs.readFileSync('data/questions.js', 'utf8');
  const easy = fs.readFileSync('data/rw2-easy.js', 'utf8');
  const overrides = fs.readFileSync('data/rw-source-overrides.js', 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox);
  vm.runInNewContext(easy, sandbox);
  vm.runInNewContext(overrides, sandbox);
  return sandbox.window.SAT_QUESTIONS;
}

const bank = loadBank();
const groups = [
  ['rw1', bank.rw1], ['rw2.easy', bank.rw2.easy], ['rw2.hard', bank.rw2.hard],
  ['math1', bank.math1], ['math2.easy', bank.math2.easy], ['math2.hard', bank.math2.hard]
];

const seenIds = new Set();
const exactSignatures = new Set();
const issues = [];
const shortPassageIds = [];

for (const [group, items] of groups) {
  assert(Array.isArray(items), `${group} is not an array`);
  items.forEach((question, index) => {
    const location = `${group}[${index}] ${question.id || 'missing-id'}`;
    if (!question.id) issues.push(`${location}: missing id`);
    if (seenIds.has(question.id)) issues.push(`${location}: duplicate id`);
    seenIds.add(question.id);
    if (!question.prompt?.trim()) issues.push(`${location}: missing prompt`);
    if (!question.explanation?.trim()) issues.push(`${location}: missing explanation`);
    if (question.section === 'Reading and Writing') {
      const paragraphs = question.source?.paragraphs || [];
      const words = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
      if (words < 25) shortPassageIds.push(question.id);
      if (!paragraphs.length) issues.push(`${location}: missing source passage`);
      if (!Array.isArray(question.options) || question.options.length !== 4) issues.push(`${location}: expected 4 R&W options`);
    }
    if (question.section === 'Math' && question.type === 'mcq' && (!Array.isArray(question.options) || question.options.length !== 4)) issues.push(`${location}: expected 4 Math options`);
    if (question.section === 'Math' && question.type === 'spr' && question.options?.length) issues.push(`${location}: SPR contains options`);
    const signature = JSON.stringify({ section: question.section, type: question.type || 'mcq', prompt: question.prompt, options: question.options || [], answer: question.answer, source: question.source || null });
    if (exactSignatures.has(signature)) issues.push(`${location}: exact duplicate item`);
    exactSignatures.add(signature);
  });
}

assert.equal(issues.length, 0, `content integrity issues:\n${issues.join('\n')}`);
assert.equal(exactSignatures.size, 147, 'expected 147 unique full-item signatures');
assert.equal(shortPassageIds.length, 0, `R&W passages under 25 words:\n${shortPassageIds.join(', ')}`);

console.log(`Audited ${exactSignatures.size} unique items with complete R&W passages.`);
console.log('No R&W synthetic placeholder passages remain.');

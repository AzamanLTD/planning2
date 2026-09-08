const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

function loadBank() {
  const source = fs.readFileSync('data/questions.js', 'utf8');
  const easy = fs.readFileSync('data/rw2-easy.js', 'utf8');
  const sandbox = {};
  vm.runInNewContext(source, sandbox);
  vm.runInNewContext(easy, sandbox);
  return sandbox.SAT_QUESTIONS;
}

const bank = loadBank();
const groups = [
  ['rw1', bank.rw1], ['rw2.easy', bank.rw2.easy], ['rw2.hard', bank.rw2.hard],
  ['math1', bank.math1], ['math2.easy', bank.math2.easy], ['math2.hard', bank.math2.hard]
];

const seenIds = new Set();
const exactSignatures = new Set();
const issues = [];
let shortPassages = 0;
let syntheticSources = 0;

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
      if (words < 25) shortPassages += 1;
      if (paragraphs.some((paragraph) => /the passage presents a situation that illustrates the relationship described in the question/i.test(paragraph))) syntheticSources += 1;
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

console.log(`Audited ${exactSignatures.size} unique items.`);
console.log(`R&W items with source passages under 25 words: ${shortPassages}`);
console.log(`R&W synthetic placeholder passages detected: ${syntheticSources}`);
if (shortPassages || syntheticSources) {
  console.warn('Content-quality follow-up remains open: strengthen short or synthetic passages before student launch.');
}

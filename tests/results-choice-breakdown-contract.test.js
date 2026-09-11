const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('results-choice-breakdown-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8').replace(/\?v=\d+/g, '')

for (const phrase of [
  "const KEY = 'azaman-sat-practice-v3'",
  'function bankFor(module, current)',
  "article.dataset.choiceBreakdownReady = '1'",
  "list.className = 'results-choice-breakdown'",
  "list.setAttribute('aria-label', 'Answer choice breakdown')",
  "row.className = 'results-choice-row'",
  "row.classList.add('is-selected')",
  "row.classList.add('is-correct')",
  'question.type === \'spr\'',
  'item.question.options.slice(0, 4)'
]) assert(source.includes(phrase), `choice breakdown contract missing: ${phrase}`);
assert(index.includes('href="results-choice-breakdown.css"'), 'choice breakdown stylesheet must be loaded');
assert(index.includes('src="results-choice-breakdown-enhancement.js"'), 'choice breakdown enhancement must be loaded');

console.log('RESULTS CHOICE BREAKDOWN CONTRACT PASSED');

const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('review-submit-timing-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

for (const phrase of [
  "const KEY = 'azaman-sat-practice-v3'",
  'function remaining(state)',
  'button.disabled = locked',
  "button.setAttribute('aria-disabled', String(locked))",
  "id = 'reviewTimingNote'",
  'The module will finish when time expires.',
  "if (event.target?.id !== 'submitModule') return;",
  'event.stopImmediatePropagation()',
  'window.setInterval(sync, 100)',
  "observer.observe(document.body, { childList: true, subtree: true })"
]) assert(source.includes(phrase), `review timing contract missing: ${phrase}`);
assert(index.includes('src="review-submit-timing-enhancement.js"'), 'review timing enhancement must be loaded');

console.log('REVIEW SUBMIT TIMING CONTRACT PASSED');

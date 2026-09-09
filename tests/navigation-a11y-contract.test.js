const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('ui-accessibility-enhancement.js', 'utf8');

for (const phrase of [
  'aria-pressed',
  'Remove mark for review',
  'Mark for review',
  'aria-haspopup',
  "setAttribute('aria-expanded'",
  "setAttribute('aria-label', 'Open question menu')",
  "setAttribute('aria-label', 'Previous question')",
  'Review module',
  "source?.setAttribute('role', 'region')",
  "source?.setAttribute('aria-label', 'Source')",
  "question?.setAttribute('role', 'region')",
  "question?.setAttribute('aria-label', 'Question')",
  "footer?.setAttribute('role', 'contentinfo')"
]) assert(source.includes(phrase), `navigation accessibility contract missing: ${phrase}`);

assert(source.includes("attributeFilter: ['class', 'aria-pressed']"), 'navigation observer must react to mark-state changes');

console.log('NAVIGATION A11Y CONTRACT PASSED');

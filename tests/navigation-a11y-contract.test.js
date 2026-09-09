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
  'Review module'
]) assert(source.includes(phrase), `navigation accessibility contract missing: ${phrase}`);

assert(source.includes("attributeFilter: ['class', 'aria-pressed']"), 'navigation observer must react to mark-state changes');

console.log('NAVIGATION A11Y CONTRACT PASSED');

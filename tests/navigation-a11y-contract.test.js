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
]) assert(source.includes(phrase), `navigation accessibility contract missing: ${phrase}`);

const regionPatterns = [
  /(?:const\s+source\s*=.*?;\s*)?source\?\.setAttribute\('role', 'region'\)/s,
  /source\?\.setAttribute\('aria-label', '(?:Source|Passage or Source)'\)/,
  /(?:const\s+question\s*=.*?;\s*)?question\?\.setAttribute\('role', 'region'\)/s,
  /question\?\.setAttribute\('aria-label', '(?:Question|Question and Answer)'\)/,
  /(?:const\s+footer\s*=.*?;\s*)?footer\?\.setAttribute\('role', 'contentinfo'\)/s,
  /footer\?\.setAttribute\('aria-label', 'Question Navigation'\)/,
];
regionPatterns.forEach((pattern, index) => assert(pattern.test(source), `navigation landmark contract missing: ${index + 1}`));

assert(source.includes('childList: true, subtree: true'), 'navigation observer must react to rendered state changes');
assert(!source.includes("attributeFilter: ['class', 'aria-pressed']"), 'navigation observer must not observe its own state attributes');

console.log('NAVIGATION A11Y CONTRACT PASSED');

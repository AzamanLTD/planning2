const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('results-enhancement.js', 'utf8');
for (const phrase of [
  'results-domain-breakdown',
  'domainAccuracy',
  'results-domain-bar',
  'aria-valuenow',
  'aria-valuemin',
  'aria-valuemax'
]) assert(source.includes(phrase), `domain report contract missing: ${phrase}`);

console.log('RESULTS DOMAIN REPORT CONTRACT PASSED');

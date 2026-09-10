const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('results-download-enhancement.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
for (const phrase of [
  "current.screen !== 'finish'",
  'new Blob([html]',
  'download = `azaman-sat-report-',
  'Print / Save as PDF',
  'numericAnswer',
  'Math.abs(an - bn) <= 1e-9',
  'domainTable',
  'reviewTable',
  'Every question from your completed test'
]) assert(source.includes(phrase), `download report contract missing: ${phrase}`);
assert(html.includes('results-download-enhancement.js'), 'download report enhancement must be loaded');
console.log('RESULTS DOWNLOAD REPORT CONTRACT PASSED');

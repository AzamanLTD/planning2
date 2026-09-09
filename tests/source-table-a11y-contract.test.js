const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('ui-accessibility-enhancement.js', 'utf8');

for (const phrase of [
  '.source-panel .data-table table',
  "document.createElement('caption')",
  "setAttribute('scope', 'col')",
  "setAttribute('scope', 'row')",
  'Source data table'
]) assert(source.includes(phrase), `source table accessibility contract missing: ${phrase}`);

console.log('SOURCE TABLE A11Y CONTRACT PASSED');

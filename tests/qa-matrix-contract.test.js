const fs = require('fs');
const assert = require('assert');

const docs = fs.readFileSync('docs/qa-matrix.md', 'utf8');
const smoke = fs.readFileSync('tests/full-run-smoke.html', 'utf8');
assert(docs.includes('State flow'), 'QA matrix must cover state flow');
assert(docs.includes('Question content'), 'QA matrix must cover question content');
assert(docs.includes('Testing tools'), 'QA matrix must cover testing tools');
assert(docs.includes('Accessibility'), 'QA matrix must cover accessibility');
assert(docs.includes('Deployment'), 'QA matrix must cover deployment');
assert(docs.includes('complete-run smoke'), 'QA matrix must distinguish complete-run smoke from representative smoke');
assert(smoke.includes('FULL RUN SMOKE COMPLETE'), 'complete-run smoke must remain executable');
console.log('QA matrix contract passed.');

const fs = require('fs');
const assert = require('assert');

const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');

assert.match(workflow, /\bon:\n  push:\n    branches:\s*\[main\]/, 'CI must run direct pushes only on main');
assert.match(workflow, /\n  pull_request:\s*\n  workflow_dispatch:\s*\n/, 'CI must retain PR and manual triggers');
assert.doesNotMatch(workflow, /branches:\s*\[['"]\*\*['"]\]/, 'CI must not run on every feature-branch push');
assert.match(workflow, /\nconcurrency:\n\s+group:\s+ci-\$\{\{\s*github\.event\.pull_request\.number\s+\|\|\s*github\.ref\s*\}\}/, 'CI concurrency must group PR runs by PR number and direct runs by ref');
assert.match(workflow, /\n\s+cancel-in-progress:\s+true\s*\n/, 'CI must cancel superseded runs');

console.log('CI trigger and concurrency contract checks passed.');

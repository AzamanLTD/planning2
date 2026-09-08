const fs = require('fs');
const assert = require('assert');

const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
const helpSmoke = fs.readFileSync('tests/help-shortcut-smoke.html', 'utf8');

assert.match(workflow, /\bon:\n  push:\n    branches:\s*\[main\]/, 'CI must run direct pushes only on main');
assert.match(workflow, /\n  pull_request:\s*\n  workflow_dispatch:\s*\n/, 'CI must retain PR and manual triggers');
assert.doesNotMatch(workflow, /branches:\s*\[['"]\*\*['"]\]/, 'CI must not run on every feature-branch push');
assert.match(workflow, /\nconcurrency:\n\s+group:\s+ci-\$\{\{\s*github\.event\.pull_request\.number\s+\|\|\s*github\.ref\s*\}\}/, 'CI concurrency must group PR runs by PR number and direct runs by ref');
assert.match(workflow, /\n\s+cancel-in-progress:\s+true\s*\n/, 'CI must cancel superseded runs');
assert.match(workflow, /Run dedicated Help shortcut smoke test/, 'CI must include a dedicated Help browser smoke step');
assert.match(workflow, /tests\/help-shortcut-smoke\.html/, 'CI Help smoke must target the dedicated fixture');
assert(helpSmoke.includes('Ctrl+Alt+H'), 'Help smoke must exercise Windows/ChromeOS Help');
assert(helpSmoke.includes('Command + Control + H'), 'Help smoke must verify the documented macOS Help shortcut');
assert(helpSmoke.includes('HELP SMOKE COMPLETE'), 'Help smoke must expose a machine-checkable completion marker');

console.log('CI trigger/concurrency and dedicated Help-smoke contracts passed.');

const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const smoke = fs.readFileSync('tests/timer-warning-recovery-smoke.html', 'utf8');
const workflow = fs.readFileSync('.github/workflows/timer-warning-recovery.yml', 'utf8');

assert(app.includes('if(r<=C.warnSec&&!s.warning[m().id])'), 'timer warning must trigger at or below the threshold after recovery');
assert(smoke.includes('299500'), 'timer recovery smoke must start below the exact five-minute boundary');
assert(smoke.includes('TIMER WARNING RECOVERY COMPLETE'), 'timer recovery smoke must expose a completion marker');
assert(workflow.includes('tests/timer-warning-recovery-smoke.html'), 'timer recovery workflow must execute the dedicated smoke');
assert(workflow.includes('TIMER WARNING RECOVERY COMPLETE'), 'timer recovery workflow must assert smoke completion');

console.log('Timer warning recovery contract passed.');

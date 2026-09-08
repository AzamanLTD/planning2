const fs = require('fs');
const assert = require('assert');

const index = fs.readFileSync('index.html', 'utf8');
for (const obsolete of ['shortcut-enhancement.js', 'enhancements.js', 'connectivity-enhancement.js']) {
  assert(!index.includes(obsolete), `index must not reintroduce obsolete layer ${obsolete}`);
}
for (const obsolete of ['shortcut-enhancement.js', 'enhancements.js', 'connectivity-enhancement.js']) {
  assert(!fs.existsSync(obsolete), `obsolete layer file ${obsolete} must remain removed`);
}

console.log('Legacy enhancement-layer contract passed.');

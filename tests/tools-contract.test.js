const fs = require('fs');
const assert = require('assert');

const tools = fs.readFileSync('tools-enhancement.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const keyboard = fs.readFileSync('keyboard.js', 'utf8');

for (const formula of ['A = πr²', 'C = 2πr', 'A = lw', 'A = ½bh', 'c² = a² + b²', 'x√3', 's√2', 'V = lwh', 'V = πr²h', 'V = 4/3πr³', 'V = 1/3πr²h', '360° = 2π radians', '180°']) {
  assert(tools.includes(formula), `reference sheet missing public formula: ${formula}`);
}
assert(tools.includes("panel.id === 'referencePanel'"), 'reference sheet must have a dedicated enhancement path');
assert(tools.includes("title.textContent = 'Reference sheet'"), 'reference sheet title must be student-facing');
assert(tools.includes("aria-labelledby', 'referencePanelTitle'"), 'reference sheet must expose an accessible name');
assert(tools.includes('Resize calculator'), 'calculator must expose a resize affordance');
assert(tools.includes('makeDraggable'), 'tool panels must be draggable');
assert(app.includes('Line reader'), 'line reader tool must remain in the core exam surface');
assert(app.includes('Mark for review'), 'mark-for-review tool must remain in the core exam surface');
assert(keyboard.includes('Option eliminator'), 'option eliminator shortcut must remain wired in keyboard layer');
assert(app.includes('Reference sheet'), 'reference sheet tool must remain in the core exam surface');

console.log('Reference-sheet and exam-tool contracts passed.');

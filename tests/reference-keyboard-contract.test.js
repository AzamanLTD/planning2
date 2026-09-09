const fs = require('fs');
const assert = require('assert');

const script = fs.readFileSync('reference-keyboard-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

assert(script.includes('referenceKeyboardReady'), 'reference keyboard enhancer must be idempotent');
assert(script.includes('reference-viewport'), 'reference keyboard enhancer must target the sheet viewport');
assert(script.includes('ArrowLeft') && script.includes('ArrowRight'), 'reference sheet must support horizontal keyboard panning');
assert(script.includes('ArrowUp') && script.includes('ArrowDown'), 'reference sheet must support vertical keyboard panning');
assert(script.includes('event.shiftKey ? 72 : 24'), 'reference sheet must provide larger Shift+Arrow pan increments');
assert(script.includes("event.key === 'Home'"), 'reference sheet must provide a keyboard reset shortcut');
assert(script.includes('aria-describedby'), 'reference sheet keyboard behavior must be announced to assistive technology');
assert(index.includes('reference-keyboard-enhancement.js'), 'reference keyboard enhancement must be loaded');

console.log('REFERENCE KEYBOARD CONTRACT PASSED');

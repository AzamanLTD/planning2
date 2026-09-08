const fs = require('fs');
const assert = require('assert');

const read = (p) => fs.readFileSync(p, 'utf8');
const html = read('index.html');
const app = read('app.js');
const sanitizer = read('exam-ui-sanitizer.js');
const notes = read('note-enhancement.js');
const modal = read('modal-enhancement.js');
const calculator = read('calculator-enhancement.js');
const tools = read('tools-enhancement.js');
const results = read('results-enhancement.js');
const guard = read('session-guard.js');
const keyboard = read('keyboard.js');

const requiredScripts = [
  'data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js', 'data/question-quality-overrides.js',
  'session-guard.js', 'exam-ui-sanitizer.js', 'app.js', 'keyboard.js', 'spr-input.js', 'tools-enhancement.js',
  'note-enhancement.js', 'modal-enhancement.js', 'calculator-enhancement.js', 'code-input-enhancement.js',
  'results-enhancement.js', 'ui-accessibility-enhancement.js'
];
for (const src of requiredScripts) assert(html.includes(`src=\"${src}\"`), `index.html missing ${src}`);
assert(html.indexOf('exam-ui-sanitizer.js') < html.indexOf('app.js'), 'sanitizer must load before app boot');
assert(!html.includes('shortcut-enhancement.js'), 'obsolete shortcut layer must not be loaded');
assert(!html.includes('connectivity-enhancement.js'), 'obsolete connectivity layer must not be loaded');

assert(sanitizer.includes("access.setAttribute('placeholder', 'Enter access code')"), 'access placeholder must be neutral');
assert(sanitizer.includes("room.setAttribute('placeholder', 'Enter room code')"), 'room placeholder must be neutral');
assert(!/placeholder\s*=\s*["']SAT26["']/.test(sanitizer), 'sanitizer must not restore SAT26');
assert(!/placeholder\s*=\s*["']AZM24["']/.test(sanitizer), 'sanitizer must not restore AZM24');

for (const phrase of ['STORAGE_KEY', 'saveNote', 'azmNoteEditor']) assert(notes.includes(phrase), `note contract missing: ${phrase}`);
for (const phrase of ['FOCUSABLE', 'activeDialog', 'focusFirst']) assert(modal.includes(phrase), `modal contract missing: ${phrase}`);
for (const phrase of ['tokenize(input)', 'sin', 'sqrt', 'Graph']) assert(calculator.includes(phrase), `calculator contract missing: ${phrase}`);
for (const phrase of ['makeDraggable', 'makeResizable', 'restoreSavedHighlights']) assert(tools.includes(phrase), `tools contract missing: ${phrase}`);
for (const phrase of ['Practice report', 'Reading and Writing', 'Math']) assert(results.includes(phrase), `results contract missing: ${phrase}`);
for (const phrase of ['state.completed', 'state.endAt <= Date.now()', "'checkin'"]) assert(guard.includes(phrase), `recovery contract missing: ${phrase}`);
for (const phrase of ['const isChromeOS', 'const isMac', 'const isIPad', 'openHelp']) assert(keyboard.includes(phrase), `keyboard platform contract missing: ${phrase}`);

for (const phrase of ['show(\"break\")', 's.submitted=true', 'minutes:32,count:27', 'minutes:35,count:22']) assert(app.includes(phrase), `app flow contract missing: ${phrase}`);
assert(!app.includes('Function('), 'app must not use Function()');
assert(!app.includes('eval('), 'app must not use eval()');
assert(!calculator.includes('Function('), 'calculator must not use Function()');
assert(!calculator.includes('eval('), 'calculator must not use eval()');

console.log('Static simulator contract checks passed.');

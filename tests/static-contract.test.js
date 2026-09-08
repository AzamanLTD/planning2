const fs = require('fs');
const assert = require('assert');

const read = (p) => fs.readFileSync(p, 'utf8');
const html = read('index.html');
const app = read('app.js');
const guard = read('session-guard.js');
const keyboard = read('keyboard.js');
const spr = read('spr-input.js');
const tools = read('tools-enhancement.js');
const notes = read('note-enhancement.js');
const modal = read('modal-enhancement.js');
const calculator = read('calculator-enhancement.js');
const connectivity = read('connectivity-enhancement.js');
const codeInput = read('code-input-enhancement.js');
const results = read('results-enhancement.js');
const sanitizer = read('exam-ui-sanitizer.js');
const tokens = read('styles.css');

const requiredScripts = [
  'data/questions.js', 'data/rw2-easy.js', 'session-guard.js', 'app.js', 'keyboard.js',
  'spr-input.js', 'tools-enhancement.js', 'note-enhancement.js', 'modal-enhancement.js',
  'calculator-enhancement.js', 'connectivity-enhancement.js', 'code-input-enhancement.js',
  'results-enhancement.js', 'exam-ui-sanitizer.js'
];
for (const src of requiredScripts) assert(html.includes(`src=\"${src}\"`), `index.html missing ${src}`);
assert(!html.includes('shortcut-enhancement.js'), 'obsolete duplicate shortcut layer must not be loaded');

for (const phrase of [
  'screen:\"access\"', 'show(\"break\")', 's.screen=\"finish\"', 'breakSec:600', 'warnSec:300',
  'minutes:32,count:27', 'minutes:35,count:22', 'completed[m().id]=true', 'routeNext()', 's.submitted=true',
  'Review questions', 'Question menu', 'Mark for review', 'Reference sheet', 'Calculator', 'Line reader',
  'Highlight selection', 'Hide timer'
]) assert(app.includes(phrase), `app.js missing contract: ${phrase}`);

for (const phrase of ['STORAGE_KEY', 'MODULES', 'state.submitted', 'state.completed', 'state.endAt <= Date.now()',
  'state.breakEndAt <= Date.now()', "state.screen = 'directions'", 'state.adaptive.rw', 'state.adaptive.math']) {
  assert(guard.includes(phrase), `session recovery contract missing: ${phrase}`);
}

for (const phrase of ['F1', 'F6', 'Ctrl + Alt + B', 'Ctrl + Alt + X', 'Ctrl + Alt + G', 'Ctrl + Alt + Shift + D',
  'Ctrl + Alt + V', 'Ctrl + L', 'Ctrl + H', 'Ctrl + Alt + C', 'Ctrl + Alt + R', 'Ctrl + Alt + O',
  'Ctrl + Alt + 1–4', 'Ctrl + Shift + 1–4', 'clickText(\'Question menu\')']) {
  assert(keyboard.includes(phrase), `keyboard shortcut missing: ${phrase}`);
}

for (const phrase of ['normalizeFraction', 'normalizeDecimal', 'blur', 'MAX_POSITIVE_CHARS', 'MAX_NEGATIVE_CHARS']) {
  assert(spr.includes(phrase), `SPR normalization contract missing: ${phrase}`);
}
for (const phrase of ['setAttribute(\'role\', \'dialog\')', 'aria-modal', 'Resize calculator', 'makeDraggable', 'makeResizable', 'restoreSavedHighlights']) {
  assert(tools.includes(phrase), `tool enhancement contract missing: ${phrase}`);
}
for (const phrase of ['STORAGE_KEY', 'questionKey', 'saveNote', 'azmNoteEditor', 'stopImmediatePropagation']) {
  assert(notes.includes(phrase), `note enhancement contract missing: ${phrase}`);
}
for (const phrase of ['FOCUSABLE', 'activeDialog', 'event.key !== \'Tab\'', 'aria-modal', 'focusFirst']) {
  assert(modal.includes(phrase), `modal focus contract missing: ${phrase}`);
}
for (const phrase of ['tokenize(input)', 'sin', 'cos', 'tan', 'sqrt', 'log10', 'Graph', 'azmGraphExpr', 'azmXMin', 'azmXMax',
  'getContext(\'2d\')', 'aria-controls="azmCalcCalculate"', 'aria-controls="azmCalcGraph"', 'Object.entries(views)',
  'view.hidden = name !== mode']) {
  assert(calculator.includes(phrase), `calculator enhancement contract missing: ${phrase}`);
}
for (const phrase of ['bannerId', 'navigator.onLine', "window.addEventListener('offline'", "window.addEventListener('online'", 'Connection lost.', 'Connection restored.']) {
  assert(connectivity.includes(phrase), `connectivity contract missing: ${phrase}`);
}
for (const phrase of ['start-digit', 'data-code-ready', 'paste', 'Backspace', 'ArrowLeft', 'ArrowRight', 'codeReady']) {
  assert(codeInput.includes(phrase), `code-input enhancement contract missing: ${phrase}`);
}
for (const phrase of ['Practice report', 'Reading and Writing', 'Math', 'raw practice-test results', 'not an official SAT scaled score', 'results-section-grid', 'results-module-row']) {
  assert(results.includes(phrase), `results enhancement contract missing: ${phrase}`);
}
for (const phrase of ['q-meta', 'domain', 'difficulty', 'source-label', "textContent = 'Source'", 'MutationObserver', 'sanitize']) {
  assert(sanitizer.includes(phrase), `student UI sanitizer contract missing: ${phrase}`);
}

for (const token of ['--color-page:', '--color-surface:', '--color-text:', '--color-border:', '--color-primary:', '--color-warning:', '--color-focus:', '--color-selected:']) {
  assert(tokens.includes(token), `visual token missing: ${token}`);
}
assert(!app.includes('Function('), 'unsafe Function() evaluator must not return');
assert(!app.includes('eval('), 'unsafe eval() evaluator must not return');
assert(!calculator.includes('Function('), 'calculator must not use Function()');
assert(!calculator.includes('eval('), 'calculator must not use eval()');

console.log('Static simulator contract checks passed.');

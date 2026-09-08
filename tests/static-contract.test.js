const fs = require('fs');
const assert = require('assert');

const read = (p) => fs.readFileSync(p, 'utf8');
const html = read('index.html');
const app = read('app.js');
const keyboard = read('keyboard.js');
const spr = read('spr-input.js');
const tools = read('tools-enhancement.js');
const notes = read('note-enhancement.js');
const modal = read('modal-enhancement.js');
const tokens = read('styles.css');

const requiredScripts = [
  'data/questions.js',
  'data/rw2-easy.js',
  'app.js',
  'keyboard.js',
  'spr-input.js',
  'tools-enhancement.js',
  'note-enhancement.js',
  'modal-enhancement.js'
];
for (const src of requiredScripts) assert(html.includes(`src=\"${src}\"`), `index.html missing ${src}`);

for (const phrase of [
  'screen:\"access\"', 'show(\"break\")', 's.screen=\"finish\"',
  'breakSec:600', 'warnSec:300', 'minutes:32,count:27', 'minutes:35,count:22',
  'completed[m().id]=true', 'routeNext()', 's.submitted=true',
  'Review questions', 'Mark for review', 'Reference sheet', 'Calculator',
  'Line reader', 'Highlight selection', 'Hide timer'
]) assert(app.includes(phrase), `app.js missing contract: ${phrase}`);

for (const phrase of [
  'F1', 'F6', 'Ctrl + Alt + B', 'Ctrl + Alt + X', 'Ctrl + Alt + G',
  'Ctrl + Alt + Shift + D', 'Ctrl + Alt + V', 'Ctrl + L', 'Ctrl + H',
  'Ctrl + Alt + C', 'Ctrl + Alt + R', 'Ctrl + Alt + O',
  'Ctrl + Alt + 1–4', 'Ctrl + Shift + 1–4'
]) assert(keyboard.includes(phrase), `keyboard shortcut missing: ${phrase}`);

for (const phrase of ['normalizeFraction', 'normalizeDecimal', 'blur', 'MAX_POSITIVE_CHARS', 'MAX_NEGATIVE_CHARS']) {
  assert(spr.includes(phrase), `SPR normalization contract missing: ${phrase}`);
}

for (const phrase of ['role=\"dialog\"', 'aria-modal', 'Resize calculator', 'makeDraggable', 'makeResizable', 'restoreSavedHighlights']) {
  assert(tools.includes(phrase), `tool enhancement contract missing: ${phrase}`);
}

for (const phrase of ['STORAGE_KEY', 'questionKey', 'saveNote', 'azmNoteEditor', 'stopImmediatePropagation']) {
  assert(notes.includes(phrase), `note enhancement contract missing: ${phrase}`);
}

for (const phrase of ['FOCUSABLE', 'activeDialog', 'event.key !== \'Tab\'', 'aria-modal', 'focusFirst']) {
  assert(modal.includes(phrase), `modal focus contract missing: ${phrase}`);
}

for (const token of [
  '--color-page:', '--color-surface:', '--color-text:', '--color-border:',
  '--color-primary:', '--color-warning:', '--color-focus:', '--color-selected:'
]) assert(tokens.includes(token), `visual token missing: ${token}`);

assert(!app.includes('Function('), 'unsafe Function() evaluator must not return');
assert(!app.includes('eval('), 'unsafe eval() evaluator must not return');

console.log('Static simulator contract checks passed.');

const fs = require('fs');
const assert = require('assert');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const app = read('app.js');
const keyboard = read('keyboard.js');
const modal = read('modal-enhancement.js');
const calculator = read('calculator-enhancement.js');
const codeInput = read('code-input-enhancement.js');
const uiA11y = read('ui-accessibility-enhancement.js');

assert(html.includes('<html lang="en">'), 'document language must be declared');
assert(app.includes('aria-live'), 'application status region must expose live updates');
assert(app.includes('aria-label="Answer choices"'), 'answer-choice group must be labelled');
assert(app.includes('aria-pressed'), 'selected choices must expose pressed state');
assert(app.includes('aria-labelledby="warnTitle"'), 'timer warning must have an accessible name');
assert(keyboard.includes('role="dialog"'), 'shortcut dialog must expose dialog role');
assert(keyboard.includes('openHelp'), 'help shortcut must have a dedicated help dialog');
for (const shortcut of [
  'Ctrl + Alt + H / Command + Control + H / iPad: Command + Control + P',
  'Ctrl + Alt + B / Command + Control + B',
  'Ctrl + Alt + X / Command + Control + X',
  'Ctrl + Alt + G / Command + Control + G',
  'Ctrl + Alt + Shift + D / Command + Control + Shift + D',
  'Ctrl + L / Command + L',
  'Ctrl + Alt + T / Command + Option + T',
  'Ctrl + Alt + V / Command + Shift + V',
  'Ctrl + Alt + C / Command + Option + C',
  'Ctrl + Alt + R / Command + Option + R',
  'Ctrl + Alt + O / Command + Control + O',
  'Ctrl + Alt + 1–4 / Command + Option + 1–4',
  'Ctrl + Shift + 1–4 / Command + Control + 1–4'
]) assert(keyboard.includes(shortcut), `platform shortcut must be documented: ${shortcut}`);
assert(keyboard.includes('const isMac'), 'platform-specific shortcut routing must detect Apple platforms');
assert(keyboard.includes('const isIPad'), 'iPad-specific shortcut routing must be supported');
assert(keyboard.includes('const triple = isMac ? command && ctrl : ctrl && alt'), 'shared Control/Command chord must follow platform mapping');
assert(keyboard.includes('const comboAlt = isMac ? command && alt : ctrl && alt'), 'Option/Alt chord must follow platform mapping');
assert(keyboard.includes("isIPad && command && ctrl && lower === 'p'"), 'iPad Help must use Command+Control+P');
assert(keyboard.includes("isMac ? command && event.shiftKey && lower === 'v' : ctrl && alt && lower === 'v'"), 'Mark for Review must use the platform-specific mapping');
assert(modal.includes('role="dialog"'), 'modal focus layer must target dialog semantics');
assert(modal.includes('aria-modal="true"'), 'dialogs must be modal to assistive technology');
assert(modal.includes('FOCUSABLE'), 'dialogs must define keyboard focusable controls');
assert(calculator.includes('aria-controls="azmCalcCalculate"'), 'calculator tabs must expose calculate panel relationship');
assert(calculator.includes('aria-controls="azmCalcGraph"'), 'calculator tabs must expose graph panel relationship');
assert(calculator.includes('aria-selected'), 'calculator tabs must expose selection state');
assert(codeInput.includes('setAttribute(\'aria-label\''), 'start-code fields must receive individual accessible labels');
assert(codeInput.includes('Start code digit ${index + 1} of 6'), 'start-code labels must identify each digit position');
assert(uiA11y.includes("setAttribute('role', 'radio')"), 'answer choices must expose radio semantics');
assert(uiA11y.includes("setAttribute('aria-checked'"), 'answer choices must expose checked state');
assert(uiA11y.includes("setAttribute('role', 'menu')"), 'test tools must expose menu semantics');
assert(uiA11y.includes('Question ${number}, ${states.join'), 'review buttons must have descriptive labels');
assert(uiA11y.includes('installReducedMotionSupport'), 'reduced-motion preference must have a dedicated accessibility path');
assert(uiA11y.includes('prefers-reduced-motion: reduce'), 'reduced-motion preference must be honored');
assert(html.includes('ui-accessibility-enhancement.js'), 'semantic accessibility enhancement must be loaded');

console.log('Accessibility, reduced-motion, and platform shortcut contract checks passed.');

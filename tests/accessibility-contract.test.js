const fs = require('fs');
const assert = require('assert');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const app = read('app.js');
const keyboard = read('keyboard.js');
const modal = read('modal-enhancement.js');
const calculator = read('calculator-enhancement.js');
const codeInput = read('code-input-enhancement.js');

assert(html.includes('<html lang="en">'), 'document language must be declared');
assert(app.includes('aria-live'), 'application status region must expose live updates');
assert(app.includes('aria-label="Answer choices"'), 'answer-choice group must be labelled');
assert(app.includes('aria-pressed'), 'selected choices must expose pressed state');
assert(app.includes('aria-labelledby="warnTitle"'), 'timer warning must have an accessible name');
assert(keyboard.includes('role="dialog"'), 'shortcut dialog must expose dialog role');
assert(modal.includes('role="dialog"'), 'modal focus layer must target dialog semantics');
assert(modal.includes('aria-modal="true"'), 'dialogs must be modal to assistive technology');
assert(modal.includes('FOCUSABLE'), 'dialogs must define keyboard focusable controls');
assert(calculator.includes('aria-controls="azmCalcCalculate"'), 'calculator tabs must expose tabpanel relationship');
assert(calculator.includes('aria-controls="azmCalcGraph"'), 'graph tab must expose tabpanel relationship');
assert(calculator.includes('aria-selected'), 'calculator tabs must expose selection state');
assert(codeInput.includes('aria-label="Start code digit'), 'start-code fields must be individually labelled');

console.log('Accessibility contract checks passed.');

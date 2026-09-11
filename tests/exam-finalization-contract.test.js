'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

const index = read('index.html');
const js = read('bluebook-exam-finalization.js');
const css = read('bluebook-exam-finalization.css');
const ref = read('bluebook-fidelity-enhancement.js');
const sw = read('sw.js');

for (const asset of ['bluebook-exam-finalization.css', 'bluebook-exam-finalization.js']) {
  if (!index.includes(asset)) throw new Error(`index.html does not load ${asset}`);
  if (!sw.includes(asset)) throw new Error(`service worker does not precache ${asset}`);
}

for (const text of [
  'Testing was interrupted.',
  'Sign in again to continue testing.',
  'Exit Bluebook',
  'pauses your testing timer temporarily',
  'Answers submitted',
  'Submitting your answers',
]) {
  if (!js.includes(text) && !ref.includes(text)) throw new Error(`missing exam-mode recovery/finalization behavior: ${text}`);
}

for (const selector of ['.azm-recovery-notice', '.azm-submission-page', '.azm-submission-spinner']) {
  if (!css.includes(selector)) throw new Error(`missing exam finalization selector: ${selector}`);
}

new Function(js);
console.log('EXAM FINALIZATION CONTRACT PASS');

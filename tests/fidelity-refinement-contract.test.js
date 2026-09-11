'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

const index = read('index.html');
const css = read('bluebook-fidelity-refinements.css');
const js = read('bluebook-fidelity-refinements.js');
const examCss = read('bluebook-exam-mode.css');
const examJs = read('bluebook-exam-mode.js');
const sw = read('sw.js');

for (const asset of [
  'bluebook-fidelity-overrides.css',
  'bluebook-fidelity-refinements.css',
  'bluebook-exam-mode.css',
  'bluebook-fidelity-enhancement.js',
  'bluebook-fidelity-refinements.js',
  'bluebook-exam-mode.js',
]) {
  if (!index.includes(`href="${asset}"`) && !index.includes(`src="${asset}"`)) {
    throw new Error(`index.html does not load ${asset}`);
  }
}

const requiredCss = [
  '.ref2-access-brand',
  '.test-main',
  '.test-footer',
  '.azm-a11y-rail',
  '#atModal',
  '.azm-module-transition',
];
requiredCss.forEach((selector) => {
  if (!css.includes(selector)) throw new Error(`missing fidelity selector: ${selector}`);
});

const requiredJs = [
  'Test Your Device',
  'Assistive Technology',
  'This Module Is Over',
  'Expand All',
  'Collapse All',
  'bluebook-fidelity-refinements',
];
requiredJs.forEach((text) => {
  if (!js.includes(text)) throw new Error(`missing fidelity behavior: ${text}`);
});

if (!examCss.includes('body:not(.azm-harness) .preview-banner')) {
  throw new Error('actual exam model must suppress preview-only chrome outside QA harness');
}
if (!examJs.includes('actualModeAdvanceGuard') || !examJs.includes('Review module')) {
  throw new Error('actual exam model must gate early module advance');
}
if (!sw.includes('bluebook-fidelity-refinements.css') || !sw.includes('bluebook-exam-mode.js')) {
  throw new Error('offline cache is missing fidelity assets');
}
if (!sw.includes("const CACHE_NAME = 'azaman-bluebook-v3'")) {
  throw new Error('offline cache version was not bumped');
}
if (!sw.includes('caches.match(request).then((cached) =>')) {
  throw new Error('service worker is not cache-first');
}

new Function(js);
new Function(examJs);

console.log('FIDELITY REFINEMENT CONTRACT PASS');

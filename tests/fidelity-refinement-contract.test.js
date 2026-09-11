'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

const index = read('index.html');
const css = read('bluebook-fidelity-refinements.css');
const pixelCss = read('bluebook-pixel-fidelity.css');
const js = read('bluebook-fidelity-refinements.js');
const examCss = read('bluebook-exam-mode.css');
const examJs = read('bluebook-exam-mode.js');
const finalizationJs = read('bluebook-exam-finalization.js');
const breakCss = read('bluebook-break-fidelity.css');
const breakJs = read('bluebook-break-fidelity.js');
const mvpJs = read('bluebook-mvp-runtime.js');
const transitionJs = read('bluebook-module-transition.js');
const sw = read('sw.js');

for (const asset of ['bluebook-fidelity-overrides.css','bluebook-fidelity-refinements.css','bluebook-exam-mode.css','bluebook-break-fidelity.css','bluebook-pixel-fidelity.css','bluebook-fidelity-enhancement.js','bluebook-fidelity-refinements.js','bluebook-exam-mode.js','bluebook-module-transition.js','bluebook-break-fidelity.js','bluebook-mvp-runtime.js']) {
  if (!index.includes(`href="${asset}"`) && !index.includes(`src="${asset}"`)) throw new Error(`index.html does not load ${asset}`);
}
for (const selector of ['.ref2-access-brand','.test-main','.test-footer','.azm-a11y-rail','#atModal','.azm-module-transition']) {
  if (!css.includes(selector)) throw new Error(`missing fidelity selector: ${selector}`);
}
for (const selector of ['.test-top','.timer-block','.question-nav','.test-footer','.test-main','.code-input','.azm-break-device-status']) {
  if (!pixelCss.includes(selector)) throw new Error(`missing pixel calibration selector: ${selector}`);
}
for (const text of ['Test Your Device','Assistive Technology','This Module Is Over','Expand All','Collapse All','moduleTransitions']) {
  if (!js.includes(text)) throw new Error(`missing fidelity behavior: ${text}`);
}
for (const [text, source] of [['Take a Break: Do Not Close Your Device',breakCss+breakJs],['Resume Testing Now',breakCss+breakJs],['Follow these rules during the break:',breakJs],['This Module Is Over',transitionJs],['moduleSec',mvpJs],['Congratulations!',finalizationJs],['Return to Homepage',finalizationJs]]) {
  if (!source.includes(text)) throw new Error(`missing MVP runtime behavior: ${text}`);
}
if (!examCss.includes('body:not(.azm-harness) .preview-banner')) throw new Error('actual exam model must suppress preview-only chrome outside QA harness');
if (!examJs.includes('actualModeAdvanceGuard') || !examJs.includes('Review module')) throw new Error('actual exam model must gate early module advance');
if (!finalizationJs.includes('isActualRuntime') || !finalizationJs.includes('mountRecoveryNotice')) throw new Error('actual runtime recovery/finalization layer is missing');
if (!sw.includes('bluebook-fidelity-refinements.css') || !sw.includes('bluebook-exam-mode.js')) throw new Error('offline cache is missing fidelity assets');
for (const asset of ['bluebook-break-fidelity.css','bluebook-break-fidelity.js','bluebook-module-transition.js','bluebook-mvp-runtime.js','bluebook-pixel-fidelity.css']) {
  if (!sw.includes(asset)) throw new Error(`offline cache is missing MVP asset: ${asset}`);
}
if (!sw.includes("const CACHE_NAME='azaman-bluebook-v10'")) throw new Error('offline cache version does not match current precache generation');
if (!sw.includes('caches.match(r).then(c=>')) throw new Error('service worker is not cache-first');
if (sw.includes('fetch(request)')) throw new Error('exam service worker must not depend on a runtime network fallback');
new Function(js);new Function(examJs);new Function(finalizationJs);new Function(breakJs);new Function(mvpJs);new Function(transitionJs);
console.log('FIDELITY REFINEMENT CONTRACT PASS');

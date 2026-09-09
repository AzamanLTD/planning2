const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const script = fs.readFileSync('line-reader-enhancement.js', 'utf8');
const css = fs.readFileSync('line-reader-enhancement.css', 'utf8');
const smoke = fs.readFileSync('tests/line-reader-smoke.html', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

assert(app.includes('s.lineReader'), 'app must retain Line Reader state');
assert(app.includes('class="line-reader"'), 'app must render the Line Reader surface');
assert(script.includes('data-line-reader-active'), 'Line Reader enhancement must mark active state');
assert(script.includes('aria-hidden'), 'visual Line Reader layer must remain hidden from assistive technology');
assert(script.includes('questionPrompt'), 'Line Reader must align to active question content');
assert(script.includes('getBoundingClientRect'), 'Line Reader must calculate content-relative position');
assert(css.includes('var(--color-focus)'), 'Line Reader focus treatment must use focus design token');
assert(css.includes('var(--line-reader-mask)'), 'Line Reader mask must use design token');
assert(smoke.includes('LINE READER SMOKE COMPLETE'), 'Line Reader smoke completion marker missing');
assert(index.includes('line-reader-enhancement.js'), 'Line Reader script must be loaded');
assert(index.includes('line-reader-enhancement.css'), 'Line Reader stylesheet must be loaded');
console.log('LINE READER CONTRACT PASSED');

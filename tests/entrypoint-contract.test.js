const fs = require('fs');
const assert = require('assert');

assert(fs.existsSync('index.html'), 'canonical root entrypoint must exist');
assert(!fs.existsSync('app'), 'legacy React/Vite prototype must not return');
assert(!fs.existsSync('app/package.json'), 'legacy React package manifest must not return');
assert(!fs.existsSync('app/src'), 'legacy React source tree must not return');

const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('<div id="app" aria-live="polite"></div>'), 'root app mount must remain canonical');
assert(html.includes('src="app.js"'), 'canonical root runtime must be loaded');
assert(!html.includes('src="app/src/'), 'root entrypoint must not reference the deleted React prototype');

console.log('Canonical entrypoint contract passed; no legacy React prototype present.');

const fs = require('fs');

const css = fs.readFileSync('styles.css', 'utf8');
const supplemental = fs.readFileSync('styles-tokens.css', 'utf8');
const rootEnd = css.indexOf('}');
if (rootEnd < 0) throw new Error('styles.css must contain a :root block');

const nonRoot = css.slice(rootEnd + 1);
const rawColors = nonRoot.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || [];
if (rawColors.length) throw new Error(`raw color literals remain outside :root: ${rawColors.join(', ')}`);

const definitions = new Set();
for (const source of [css.slice(0, rootEnd + 1), supplemental]) {
  for (const match of source.matchAll(/--([a-z0-9-]+)\s*:/gi)) definitions.add(`--${match[1]}`);
}
const uses = [...css.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((m) => m[1]);
const missing = [...new Set(uses)].filter((name) => !definitions.has(name));
if (missing.length) throw new Error(`undefined CSS custom properties: ${missing.join(', ')}`);

if (!/styles-tokens\.css/.test(fs.readFileSync('index.html', 'utf8'))) {
  throw new Error('index.html must load styles-tokens.css after styles.css');
}

console.log(`STYLE TOKEN CONTRACT PASSED (${uses.length} variable uses, ${definitions.size} definitions)`);

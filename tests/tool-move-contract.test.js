const fs = require('fs');
const assert = require('assert');

const script = fs.readFileSync('tools-move-enhancement.js', 'utf8');
const css = fs.readFileSync('tools-move-enhancement.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

for (const marker of [
  'type = \'button\'',
  'aria-pressed',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  "event.key === 'Escape'",
  'setPosition(panel'
]) {
  assert(script.includes(marker), `keyboard move contract missing ${marker}`);
}
assert(script.includes("move.addEventListener('click'"), 'Move control must use native button activation for Enter/Space');
assert(script.includes('Space/Enter use native button activation'), 'Move control accessibility behavior must be documented in code');
assert(script.includes('Move calculator'), 'calculator move label missing');
assert(script.includes('Move reference sheet'), 'reference move label missing');
assert(css.includes('var(--color-focus)'), 'move focus style must use design token');
assert(index.includes('tools-move-enhancement.js'), 'move script not wired into entrypoint');
assert(index.includes('tools-move-enhancement.css'), 'move stylesheet not wired into entrypoint');
console.log('TOOL MOVE CONTRACT PASSED');

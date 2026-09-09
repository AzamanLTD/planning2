const fs = require('fs');

const script = fs.readFileSync('tools-move-enhancement.js', 'utf8');
const css = fs.readFileSync('tools-move-enhancement.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

for (const marker of [
  'aria-pressed',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  "event.key === 'Escape'",
  "event.key === 'Enter'",
  "event.key === ' '",
  'setPosition(panel'
]) {
  if (!script.includes(marker)) throw new Error(`keyboard move contract missing ${marker}`);
}
if (!script.includes("Move calculator")) throw new Error('calculator move label missing');
if (!script.includes("Move reference sheet")) throw new Error('reference move label missing');
if (!css.includes('var(--color-focus)')) throw new Error('move focus style must use design token');
if (!index.includes('tools-move-enhancement.js') || !index.includes('tools-move-enhancement.css')) throw new Error('move enhancement not wired into entrypoint');
console.log('TOOL MOVE CONTRACT PASSED');

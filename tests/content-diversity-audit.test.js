const fs = require('fs');
const vm = require('vm');

function loadBank() {
  const sandbox = { window: {} };
  for (const path of ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js', 'data/question-quality-overrides.js']) {
    vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
  }
  const b = sandbox.window.SAT_QUESTIONS;
  return [b.rw1, b.rw2.easy, b.rw2.hard, b.math1, b.math2.easy, b.math2.hard].flat();
}

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const bank = loadBank();
const groups = { prompt: new Map(), source: new Map(), options: new Map() };
for (const q of bank) {
  const values = {
    prompt: normalize(q.prompt),
    source: normalize(q.source?.paragraphs?.join(' ')),
    options: normalize((q.options || []).join(' | ')),
  };
  for (const [kind, key] of Object.entries(values)) {
    if (key) groups[kind].set(key, [...(groups[kind].get(key) || []), q.id]);
  }
}
const repeats = Object.fromEntries(Object.entries(groups).map(([kind, map]) => [kind, [...map.values()].filter((ids) => ids.length > 1)]));
console.log(`Diversity audit: ${bank.length} items.`);
for (const [kind, duplicateGroups] of Object.entries(repeats)) {
  console.log(`Exact repeated ${kind}: ${duplicateGroups.length}`);
  duplicateGroups.slice(0, 20).forEach((ids) => console.log(`Repeated ${kind}: ${ids.join(', ')}`));
}
if (repeats.prompt.length !== 0) throw new Error(`R&W prompt diversity gate found ${repeats.prompt.length} exact repeats`);
if (repeats.source.length !== 0) throw new Error(`source diversity gate found ${repeats.source.length} exact repeats`);

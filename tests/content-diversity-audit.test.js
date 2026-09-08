const fs = require('fs');
const vm = require('vm');

function loadBank() {
  const sandbox = { window: {} };
  for (const path of ['data/questions.js', 'data/rw2-easy.js', 'data/rw-source-overrides.js']) {
    vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox);
  }
  const b = sandbox.window.SAT_QUESTIONS;
  return [b.rw1, b.rw2.easy, b.rw2.hard, b.math1, b.math2.easy, b.math2.hard].flat();
}

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const bank = loadBank();
const promptGroups = new Map();
const sourceGroups = new Map();
const optionGroups = new Map();
for (const q of bank) {
  const prompt = normalize(q.prompt);
  const source = normalize(q.source?.paragraphs?.join(' '));
  const options = normalize((q.options || []).join(' | '));
  if (prompt) promptGroups.set(prompt, [...(promptGroups.get(prompt) || []), q.id]);
  if (source) sourceGroups.set(source, [...(sourceGroups.get(source) || []), q.id]);
  if (options) optionGroups.set(options, [...(optionGroups.get(options) || []), q.id]);
}

const repeatedPrompts = [...promptGroups.values()].filter((ids) => ids.length > 1);
const repeatedSources = [...sourceGroups.values()].filter((ids) => ids.length > 1);
const repeatedOptions = [...optionGroups.values()].filter((ids) => ids.length > 1);

console.log(`Diversity audit: ${bank.length} items.`);
console.log(`Exact repeated prompts: ${repeatedPrompts.length}`);
console.log(`Exact repeated sources: ${repeatedSources.length}`);
console.log(`Exact repeated option sets: ${repeatedOptions.length}`);
for (const [label, groups] of [['prompt', repeatedPrompts], ['source', repeatedSources], ['options', repeatedOptions]]) {
  groups.slice(0, 10).forEach((ids) => console.log(`Repeated ${label}: ${ids.join(', ')}`));
}

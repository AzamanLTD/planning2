const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('unscheduled-break-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8').replace(/\?v=\d+/g, '')

for (const phrase of [
  "id = 'unscheduledBreakTool'",
  "button.textContent = 'Unscheduled break'",
  "The module timer continues while you are away.",
  "id = 'unscheduledBreakModal'",
  'role="dialog"',
  'function openBreak()',
  'id="returnFromUnscheduledBreak"',
  "event.key !== 'Escape'",
  'new MutationObserver(install)'
]) assert(source.includes(phrase), `unscheduled-break contract missing: ${phrase}`);
assert(index.includes('src="unscheduled-break-enhancement.js"'), 'unscheduled break enhancement must be loaded');
assert(!source.includes('state.endAt ='), 'unscheduled break must not mutate the module deadline');
assert(!source.includes('state.breakEndAt ='), 'unscheduled break must not mutate the scheduled break deadline');

console.log('UNSCHEDULED BREAK CONTRACT PASSED');

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const results = fs.readFileSync('results-enhancement.js', 'utf8');

const match = app.match(/function same\(v,k\)\{[^\n]*\}/);
assert.ok(match, 'app.js must define the answer-equivalence helper same(v,k)');
assert.ok(app.includes('same(v,x.answer)'), 'scoreMod must score through same()');
assert.ok(app.includes('same(v,q.answer)'), 'scoreAll must score through same()');
assert.ok(results.includes('window.same'), 'results-enhancement must score through the shared helper');

const sandbox = { String, Number, Math };
vm.runInNewContext(`${match[0]}; globalThis.same = same;`, sandbox);
const same = sandbox.same;

// MCQ letters behave as before
assert.strictEqual(same('A', 'A'), true);
assert.strictEqual(same('a', 'A'), true);
assert.strictEqual(same('A', 'B'), false);

// SPR numeric equivalence forms a student could store without blur normalization
assert.strictEqual(same('0.75', '.75'), true);
assert.strictEqual(same('07', '7'), true);
assert.strictEqual(same('60.0', '60'), true);
assert.strictEqual(same('2.5', '2.50'), true);
assert.strictEqual(same('-0.5', '-.5'), true);

// Non-matching values and empties stay wrong
assert.strictEqual(same('4', '5'), false);
assert.strictEqual(same('', '7'), false);
assert.strictEqual(same('7', ''), false);

// MCQ letter vs numeric key never collide
assert.strictEqual(same('C', '7'), false);

console.log('SPR scoring equivalence checks passed.');

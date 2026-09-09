const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const results = fs.readFileSync('results-enhancement.js', 'utf8');

// app.js scoring path still goes through the shared same() helper
const match = app.match(/function same\(v,k\)\{[^\n]*\}/);
assert.ok(match, 'app.js must define the answer-equivalence helper same(v,k)');
assert.ok(app.includes('same(v,x.answer)'), 'scoreMod must score through same()');
assert.ok(app.includes('same(v,q.answer)'), 'scoreAll must score through same()');

// results-enhancement scores through sameAnswer()/numericAnswer() with the same semantics
const numFn = results.match(/function numericAnswer\(value\) \{[\s\S]*?\n  \}/);
assert.ok(numFn, 'results-enhancement must define numericAnswer()');
const sameFn = results.match(/function sameAnswer\(value, expected\) \{[\s\S]*?\n  \}/);
assert.ok(sameFn, 'results-enhancement must define sameAnswer() and score every answer through it');
const scoreCalls = results.match(/sameAnswer\([^)]*\)/g) || [];
assert.ok(scoreCalls.length >= 3, 'results-enhancement must score all summary, domain, and review paths through sameAnswer()');

const sandbox = { String, Number, Math };
vm.runInNewContext(`${numFn[0]}\n${sameFn[0]}\nglobalThis.sameAnswer = sameAnswer;`, sandbox);
const sameAnswer = sandbox.sameAnswer;

// MCQ letters behave as before
assert.strictEqual(sameAnswer('A', 'A'), true);
assert.strictEqual(sameAnswer('a', 'A'), true);
assert.strictEqual(sameAnswer('A', 'B'), false);

// SPR numeric equivalence forms a student could store without blur normalization
assert.strictEqual(sameAnswer('0.75', '.75'), true);
assert.strictEqual(sameAnswer('07', '7'), true);
assert.strictEqual(sameAnswer('60.0', '60'), true);
assert.strictEqual(sameAnswer('2.5', '2.50'), true);
assert.strictEqual(sameAnswer('-0.5', '-.5'), true);

// Fraction keys and stored fractions compare numerically
assert.strictEqual(sameAnswer('3/4', '0.75'), true);
assert.strictEqual(sameAnswer('3/4', '.75'), true);
assert.strictEqual(sameAnswer('1/2', '0.5'), true);

// Non-matching values and empties stay wrong
assert.strictEqual(sameAnswer('4', '5'), false);
assert.strictEqual(sameAnswer('', '7'), false);
assert.strictEqual(sameAnswer('7', ''), false);
assert.strictEqual(sameAnswer('1/0', '2'), false);

// MCQ letter vs numeric key never collide
assert.strictEqual(sameAnswer('C', '7'), false);

console.log('SPR scoring equivalence checks passed.');

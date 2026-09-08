const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('spr-input.js', 'utf8');
const instrumented = source.replace(/\n\}\)\(\);\s*$/, '\n  globalThis.__spr = { normalize, normalizeFraction, normalizeDecimal, applyLengthLimit };\n})();');
const sandbox = {
  document: { addEventListener() {} },
  Event: class Event {},
  String, Number, Math, Object, Array, Set,
};
vm.runInNewContext(instrumented, sandbox);
const spr = sandbox.__spr;
assert.ok(spr, 'SPR helpers must be instrumentable for contract tests');

assert.equal(spr.normalize('7/2'), '3.5');
assert.equal(spr.normalize('-7/2'), '-3.5');
assert.equal(spr.normalize('.6666'), '0.6666');
assert.equal(spr.normalize('  12.5000  '), '12.5');
assert.equal(spr.normalize(''), '');
assert.equal(spr.normalize('7/0'), null);
assert.equal(spr.normalize('7/2/1'), null);
assert.equal(spr.normalize('12,345'), null);
assert.equal(spr.normalize('$12'), null);
assert.equal(spr.normalize('5%'), null);
assert.equal(spr.normalize('abc'), null);

const positive = { value: '123456', maxLength: 0 };
spr.applyLengthLimit(positive);
assert.equal(positive.value, '12345');
assert.equal(positive.maxLength, 5);

const negative = { value: '-123456', maxLength: 0 };
spr.applyLengthLimit(negative);
assert.equal(negative.value, '-12345');
assert.equal(negative.maxLength, 6);

console.log('SPR normalization and length contracts passed.');

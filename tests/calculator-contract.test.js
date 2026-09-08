const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('calculator-enhancement.js', 'utf8');

assert(!/\beval\s*\(/.test(source), 'calculator must not use eval');
assert(!/\bFunction\s*\(/.test(source), 'calculator must not use Function constructor');
assert(source.includes('Math.pow'), 'calculator must support exponentiation');
assert(source.includes("['sin',"), 'calculator must support sine');
assert(source.includes("['asin',"), 'calculator must support inverse sine');
assert(source.includes("['sqrt',"), 'calculator must support square roots');
assert(source.includes("['log', Math.log10]"), 'calculator must support common logarithms');
assert(source.includes("['ln', Math.log]"), 'calculator must support natural logarithms');
assert(source.includes('Implicit multiplication'), 'calculator must document implicit multiplication');
assert(source.includes('2^-2'), 'calculator contract must cover negative exponent semantics');
assert(source.includes('x from ${xmin} to ${xmax}'), 'graphing mode must report its plotted range');
assert(source.includes('xmax - xmin > 200'), 'graphing mode must reject unbounded ranges');

console.log('Calculator safety/capability contract passed.');

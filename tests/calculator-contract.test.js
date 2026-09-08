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
assert(source.includes("['tan', tanDegrees]"), 'calculator must use a guarded tangent implementation');
assert(source.includes("tan undefined"), 'calculator must reject undefined tangent values');
assert(source.includes('Implicit multiplication'), 'calculator must document implicit multiplication');
assert(source.includes('const unary = ()'), 'calculator must parse unary signs');
assert(source.includes('return power();'), 'calculator must give exponentiation a dedicated precedence layer');
assert(source.includes('x from ${xmin} to ${xmax}'), 'graphing mode must report its plotted range');
assert(source.includes('xmax - xmin > 200'), 'graphing mode must reject unbounded ranges');

console.log('Calculator safety/capability contract passed.');

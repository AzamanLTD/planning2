const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('room-code-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

for (const phrase of [
  'INTERNAL_ROOM_CODE = \'AZM24\'',
  'PRACTICE_ROOM_CODE = \'AZMPR\'',
  'ROOM_CODE_LENGTH = 5',
  "input.maxLength = ROOM_CODE_LENGTH",
  "input.pattern = '[A-Za-z]{5}'",
  "input.inputMode = 'text'",
  "if (bridging || input.value.trim().toUpperCase() !== PRACTICE_ROOM_CODE) return;",
  "input.value = INTERNAL_ROOM_CODE",
  "button.dispatchEvent(new MouseEvent('click'",
  'event.stopImmediatePropagation()'
]) assert(source.includes(phrase), `room code contract missing: ${phrase}`);
assert(index.includes('src="room-code-enhancement.js"'), 'room code enhancement must be loaded');

console.log('ROOM CODE CONTRACT PASSED');

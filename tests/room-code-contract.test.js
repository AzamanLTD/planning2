const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('room-code-enhancement.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const smoke = fs.readFileSync('tests/room-code-smoke.html', 'utf8');

for (const phrase of [
  "INTERNAL_ROOM_CODE = 'AZM24'",
  "PRACTICE_ROOM_CODE = 'AZMPR'",
  'ROOM_CODE_LENGTH = 5',
  "querySelectorAll('.room-digit')",
  "inputMode = 'text'",
  "aria-describedby', 'roomCodeHint'",
  'roomCodeHint'
]) assert(source.includes(phrase), `room code contract missing: ${phrase}`);

// the practice-code fixture bridge lives in the wizard advance path now
assert(app.includes('s.roomCode=C.roomCode'), 'room code contract missing: practice-code bridge must normalize the stored fixture code');
assert(app.includes('AZMPR'), 'room code contract missing: practice room code must remain accepted');

// the room code UI must be five letter boxes, never a single free-text field
assert(app.includes('room-digit'), 'room code contract missing: app must render room-digit boxes');
assert(!app.includes('id="room" class="text-input'), 'room code contract must not allow the old single-field fallback');

assert(index.includes('src="room-code-enhancement.js"'), 'room code enhancement must be loaded');
assert(smoke.includes("step !== 4"), 'room code smoke must verify wizard advancement');
assert(smoke.includes('AZMPR'), 'room code smoke must cover the practice-code fixture bridge');

console.log('ROOM CODE CONTRACT PASSED');

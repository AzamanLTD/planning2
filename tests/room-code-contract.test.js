const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('room-code-enhancement.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const smoke = fs.readFileSync('tests/room-code-smoke.html', 'utf8');

for (const phrase of [
  'ROOM_CODE_LENGTH = 5',
  "querySelectorAll('.room-digit')",
  "inputMode = 'text'",
  "aria-describedby', 'roomCodeHint'",
  'roomCodeHint'
]) assert(source.includes(phrase), `room code contract missing: ${phrase}`);

// Offline practice tool: any complete 5-letter room code is accepted.
// There is no server to validate against and no fixture code to match.
assert(app.includes('s.roomCode=rc'), 'room code contract missing: wizard must accept and store the typed room code as-is');
assert(!app.includes('Invalid room code'), 'room code contract violated: offline tool must not reject any complete code');
assert(!app.includes("isn't right"), 'room code contract violated: offline tool must not reject any complete code');

// the room code UI must be five letter boxes, never a single free-text field
assert(app.includes('room-digit'), 'room code contract missing: app must render room-digit boxes');
assert(!app.includes('id="room" class="text-input'), 'room code contract must not allow the old single-field fallback');

assert(index.includes('src="room-code-enhancement.js"'), 'room code enhancement must be loaded');
assert(smoke.includes("step !== 4"), 'room code smoke must verify wizard advancement');
assert(smoke.includes('QWRTY'), 'room code smoke must cover accept-any behavior with a non-fixture code');

console.log('ROOM CODE CONTRACT PASSED');

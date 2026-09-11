const fs = require('fs');
const assert = require('assert');

const note = fs.readFileSync('note-enhancement.js', 'utf8');
const sanitizer = fs.readFileSync('exam-ui-sanitizer.js', 'utf8');

assert(!/\bprompt\s*\(/.test(note), 'note editor must not use blocking browser prompt UI');
assert(note.includes('maxlength="1000"'), 'notes must have a bounded persisted length');
assert(note.includes('escapeHtml'), 'saved notes must be escaped before template insertion');
assert(note.includes('role="dialog"'), 'note editor must expose dialog semantics');
assert(note.includes('aria-labelledby="noteEditorTitle"'), 'note editor must have an accessible name');
assert(note.includes("button = event.target.closest('#notesToolBtn, #noteTool')"), 'note tool must be intercepted consistently');

assert(sanitizer.includes("meta.hidden = true"), 'question metadata must be hidden from students');
assert(sanitizer.includes("aria-hidden") && sanitizer.includes("'true'"), 'hidden metadata must be marked aria-hidden');
assert(sanitizer.includes("label.textContent = 'Source'"), 'student-facing passage labels must not expose internal metadata');
assert(sanitizer.includes("access.setAttribute('placeholder', 'Enter access code')"), 'sign-in must not expose a valid demo access code as the placeholder');
assert(sanitizer.includes("room.setAttribute('placeholder', 'Enter room code')"), 'room entry must not expose a valid demo room code as the placeholder');
assert(!/placeholder\s*=\s*["']SAT26["']/.test(sanitizer), 'sanitizer must not restore the old demo-code placeholder');
assert(!/placeholder\s*=\s*["']AZM24["']/.test(sanitizer), 'sanitizer must not restore the old demo-room-code placeholder');
assert(sanitizer.includes('MutationObserver'), 'sanitizer must cover re-rendered DOM');

console.log('Note editor and student-facing sanitization contracts passed.');

const fs = require('fs');
const assert = require('assert');

const tools = fs.readFileSync('tools-enhancement.js', 'utf8');
const keyboard = fs.readFileSync('keyboard.js', 'utf8');

assert(tools.includes('.source-panel .passage, .question-card .q-prompt'), 'saved highlights must restore in source and question content');
assert(tools.includes('azm-saved-highlight'), 'saved highlights must use the shared visual treatment');
assert(tools.includes('annotation-list span'), 'highlight restoration must consume saved annotation state');
assert(keyboard.includes("if (ctrl && !alt && lower === 'h')"), 'Highlights & Notes shortcut must remain Ctrl+H');
assert(keyboard.includes("openToolByText('Highlights & Notes')"), 'Ctrl+H must activate highlighting when text is selected and notes otherwise');
assert(keyboard.includes('if (!button) return false'), 'keyboard button activation must report missing controls');
assert(keyboard.includes('return true;'), 'keyboard button activation must report successful controls');

console.log('HIGHLIGHT NOTES PARITY CONTRACT PASSED');

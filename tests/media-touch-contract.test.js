const fs = require('fs');
const assert = require('assert');

const script = fs.readFileSync('media-touch-enhancement.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

assert(script.includes('pointerId'), 'touch media support must track individual pointers');
assert(script.includes('pointers.size === 2'), 'touch media support must recognize two-finger gestures');
assert(script.includes('Math.hypot'), 'touch media support must measure pinch distance');
assert(script.includes('clampZoom'), 'touch media support must clamp zoom');
assert(script.includes('overlay.__azmMediaState'), 'touch media support must share the viewer state');
assert(script.includes('state.scale = clampZoom'), 'touch media support must update real viewer scale');
assert(script.includes('event.preventDefault()'), 'touch zoom gesture must prevent page gesture interference');
assert(index.includes('media-touch-enhancement.js'), 'touch media enhancement must be loaded');
console.log('MEDIA TOUCH CONTRACT PASSED');

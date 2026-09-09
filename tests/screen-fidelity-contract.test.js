const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const tokens = fs.readFileSync('styles-tokens.css', 'utf8');
const smoke = fs.readFileSync('tests/browser-smoke.html', 'utf8');
const keyboard = fs.readFileSync('keyboard.js', 'utf8');

// finish screen mirrors the real Bluebook "Test Complete" reference capture
assert(app.includes('Congratulations!'), 'finish screen must greet with Congratulations!');
assert(app.includes('The test is complete, and your answers have been submitted.'), 'finish screen must state the test is complete');
assert(app.includes("Please <strong>be quiet</strong>; other students may still be testing."), 'finish screen must keep the proctor dismissal copy');
assert(app.includes('finish-page'), 'finish screen must use the navy finish page');
assert(app.includes('Return to Homepage'), 'finish CTA must read Return to Homepage');
assert(app.includes('cta-yellow'), 'finish CTA must use the yellow pill style');
assert(app.includes('laptopArt()'), 'finish card must include the laptop illustration');

// practice score reporting stays attached for the results layers
assert(app.includes('>Practice complete</div>'), 'practice complete kicker must remain for the results layers');
assert(app.includes('id="restartBtn"'), 'restart control must remain wired');
assert(smoke.includes("restartBtn") === false, 'no smoke coupling to the restart control label');

// sign-in screen carries the app-like blue backdrop
assert(app.includes('access-page'), 'access screen must opt into the sign-in backdrop');
assert(app.includes('access-active'), 'render must toggle the sign-in backdrop class');

// directions live as a dropdown under the section title, like the real app header
assert(app.includes('id="directionsBtn"'), 'test header must expose directions');
assert(app.includes('directions-toggle'), 'directions control must sit under the section title, not beside test tools');
assert(app.includes('function directionsModal()'), 'directions modal must exist');
assert(app.includes('"directionsModal"'), 'directions modal must close with the other overlays');

// timer keeps a dedicated Hide/Show pill beside it, like the real exam header
assert(app.includes('id="hideTimerBtn"'), 'timer must have an adjacent Hide/Show control');
assert(app.includes('function toggleTimerHidden()'), 'toggleTimerHidden helper must exist');
assert(app.includes('timer-wrap'), 'timer and its hide control must be grouped visually');

// Mark for Review + the ABC eliminator badge live in the question card header, not the footer
assert(app.includes('q-header-row'), 'question card must carry a header row for mark/eliminator controls');
assert(app.includes('id="markBtn" class="q-mark-btn"'), 'mark-for-review control must live in the question header');
assert(app.includes('Mark for review'), 'mark-for-review tool text must remain for the keyboard shortcut contract');
assert(app.includes('id="eliminatorBadge" class="abc-badge"'), 'ABC eliminator badge must live in the question header for MCQ items');
assert(app.includes('function toggleEliminatorMode()'), 'eliminator badge must toggle the shared eliminator mode class');
assert(app.includes("classList.toggle(\"option-eliminator-mode\")"), 'eliminator badge must reuse the existing eliminator mode class');

// footer matches the real layout: student name left, question pill center, back/next right
assert(app.includes('footer-student'), 'footer-left must show the student name like the real test footer');
assert(app.includes('class="question-pill"'), 'footer-center must render a Question N of M pill');
assert(app.includes('aria-label="Question menu"'), 'the question pill must carry the Question menu accessible name');
assert(app.includes('<div class="footer-right">'), 'back/next controls must live in a dedicated footer-right region');
assert(keyboard.includes("getAttribute('aria-label')"), 'keyboard shortcut lookup must also match by aria-label so the Question menu shortcut keeps working');

// room code uses individual letter boxes like the real check-in screen
assert(app.includes('room-digit'), 'room code must use individual character boxes');
assert(!app.includes('id="room" class="text-input'), 'room code must not fall back to a single free-text field');

// tokens stay centralized for the new palette
for (const token of ['--color-finish-bg', '--confetti-yellow', '--confetti-pink', '--confetti-blue', '--color-cta-yellow', '--color-access-bg-a', '--color-access-bg-b', '--color-access-art']) {
  assert(tokens.includes(token), `styles-tokens.css must define ${token}`);
}
const rootEnd = css.indexOf('}');
const raw = (css.slice(rootEnd + 1).match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || []);
assert.strictEqual(raw.length, 0, 'styles.css must keep colors tokenized outside :root');

console.log('Bluebook screen fidelity contract passed.');

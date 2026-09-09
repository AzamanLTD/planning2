const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const tokens = fs.readFileSync('styles-tokens.css', 'utf8');
const smoke = fs.readFileSync('tests/browser-smoke.html', 'utf8');

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

// directions stay reachable from the exam header like the real app
assert(app.includes('id="directionsBtn"'), 'test header must expose directions');
assert(app.includes('function directionsModal()'), 'directions modal must exist');
assert(app.includes('"directionsModal"'), 'directions modal must close with the other overlays');

// tokens stay centralized for the new palette
for (const token of ['--color-finish-bg', '--confetti-yellow', '--confetti-pink', '--confetti-blue', '--color-cta-yellow', '--color-access-bg-a', '--color-access-bg-b', '--color-access-art']) {
  assert(tokens.includes(token), `styles-tokens.css must define ${token}`);
}
const rootEnd = css.indexOf('}');
const raw = (css.slice(rootEnd + 1).match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || []);
assert.strictEqual(raw.length, 0, 'styles.css must keep colors tokenized outside :root');

console.log('Bluebook screen fidelity contract passed.');

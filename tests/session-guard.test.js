const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('session-guard.js', 'utf8');
const NOW = 1_000_000;

function run(initial, bank = {}) {
  let raw = JSON.stringify(initial);
  const sandbox = {
    Date: { now: () => NOW }, JSON, Math, String, Number, Array, Object, Set,
    window: { SAT_QUESTIONS: bank },
    localStorage: { getItem: () => raw, setItem: (_, value) => { raw = value; } }
  };
  sandbox.window.localStorage = sandbox.localStorage;
  vm.runInNewContext(source, sandbox);
  return JSON.parse(raw);
}

function base() {
  return {
    v: 3, screen: 'test', mi: 0, qi: 4, endAt: NOW + 60_000, breakEndAt: null,
    submitted: false, completed: {}, answers: {}, marked: {}, eliminated: {}, notes: {},
    highlights: {}, warning: {}, adaptive: { rw: 'easy', math: 'easy' }
  };
}

let state = run({ ...base(), submitted: true, screen: 'test', mi: 0 });
assert.equal(state.screen, 'finish');
assert.equal(state.endAt, null);
assert.equal(state.breakEndAt, null);

state = run({ ...base(), completed: { rw1: true } });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 1);
assert.equal(state.qi, 0);

state = run({ ...base(), screen: 'directions', completed: { rw1: true }, mi: 0 });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 1);
assert.equal(state.qi, 0);

state = run({ ...base(), screen: 'directions', completed: { rw1: true, rw2: true }, mi: 1 });
assert.equal(state.screen, 'break');
assert.equal(state.mi, 2);
assert.ok(state.breakEndAt > NOW);

state = run({ ...base(), screen: 'directions', completed: { rw1: true, rw2: true, math1: true }, mi: 2 });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 3);
assert.equal(state.qi, 0);

state = run({ ...base(), mi: 2, endAt: null });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 2);

state = run({ ...base(), screen: 'break', mi: 1, breakEndAt: NOW - 1 });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 0);
assert.equal(state.breakEndAt, null);

state = run({ ...base(), screen: 'break', mi: 1, breakEndAt: NOW - 1, completed: { rw1: true, rw2: true } });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 2);
assert.equal(state.breakEndAt, null);

state = run({ ...base(), mi: 0, qi: 500, endAt: NOW - 1 }, {
  rw1: Array.from({ length: 27 }, (_, i) => ({ answer: i === 0 ? 'A' : 'B' }))
});
assert.equal(state.completed.rw1, true);
assert.equal(state.mi, 1);
assert.equal(state.screen, 'directions');
assert.equal(state.adaptive.rw, 'easy');

state = run({ ...base(), mi: 3, endAt: NOW - 1 });
assert.equal(state.completed.math2, true);
assert.equal(state.submitted, true);
assert.equal(state.screen, 'finish');

state = run({ ...base(), screen: 'test', endAt: null });
assert.equal(state.screen, 'directions');

state = run({ ...base(), screen: 'not-a-real-screen', mi: 99, qi: -4, completed: { rw1: 'false', math2: 1 }, marked: { 'rw1-1': 'yes' }, warning: { rw1: 'true' }, timerHidden: 'yes', rules: 1 });
assert.equal(state.screen, 'access');
assert.equal(state.mi, 3);
assert.equal(state.qi, 0);
assert.deepEqual(state.completed, { rw2: false, math1: false, math2: false });
assert.deepEqual(state.marked, {});
assert.deepEqual(state.warning, {});
assert.equal(state.timerHidden, false);
assert.equal(state.rules, false);

state = run({ ...base(), submitted: false, screen: 'break', mi: 0, breakEndAt: NOW + 10_000, completed: { rw1: true, rw2: true }, adaptive: { rw: 'garbage', math: 'hard' } });
assert.equal(state.screen, 'break');
assert.equal(state.mi, 2);
assert.equal(state.adaptive.rw, 'easy');
assert.equal(state.adaptive.math, 'hard');
assert.ok(state.breakEndAt > NOW);

state = run({ ...base(), screen: 'break', mi: 0, breakEndAt: NOW + 10_000, completed: {} });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 0);
assert.equal(state.qi, 0);
assert.equal(state.breakEndAt, null);

state = run({ ...base(), screen: 'break', mi: 1, breakEndAt: NOW + 10_000, completed: { rw1: true } });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 1);
assert.equal(state.qi, 0);
assert.equal(state.breakEndAt, null);

state = run({ ...base(), screen: 'directions', mi: 1, completed: { rw1: true, math1: true, math2: true } });
assert.equal(state.completed.rw1, true);
assert.equal(state.completed.rw2, false);
assert.equal(state.completed.math1, false);
assert.equal(state.completed.math2, false);
assert.equal(state.mi, 1);
assert.equal(state.screen, 'directions');

state = run({ ...base(), screen: 'test', mi: 1, completed: { rw1: true, rw2: true, math2: true }, endAt: NOW + 60_000 });
assert.equal(state.completed.rw1, true);
assert.equal(state.completed.rw2, true);
assert.equal(state.completed.math1, false);
assert.equal(state.completed.math2, false);
assert.equal(state.screen, 'break');
assert.equal(state.mi, 2);

console.log('Session recovery guard tests passed.');

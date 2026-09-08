const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const source = fs.readFileSync('session-guard.js', 'utf8');
const NOW = 1_000_000;

function run(initial, bank = {}) {
  let raw = JSON.stringify(initial);
  const sandbox = {
    Date: { now: () => NOW },
    JSON,
    Math,
    String,
    Number,
    Array,
    Object,
    Set,
    window: { SAT_QUESTIONS: bank },
    localStorage: {
      getItem: () => raw,
      setItem: (_, value) => { raw = value; }
    }
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

state = run({ ...base(), mi: 2, endAt: null });
assert.equal(state.screen, 'directions');
assert.equal(state.mi, 2);

state = run({ ...base(), screen: 'break', mi: 1, breakEndAt: NOW - 1 });
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

console.log('Session recovery guard tests passed.');

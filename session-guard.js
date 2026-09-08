(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', count: 27 },
    { id: 'rw2', count: 27 },
    { id: 'math1', count: 22 },
    { id: 'math2', count: 22 },
  ];

  const normalizeObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

  function read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return parsed && parsed.v === 3 ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function write(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function score(moduleId, state) {
    const bank = window.SAT_QUESTIONS?.[moduleId] || [];
    let correct = 0;
    let answered = 0;
    bank.forEach((question, index) => {
      const answer = state.answers[`${moduleId}-${index}`];
      if (answer === undefined || String(answer).trim() === '') return;
      answered += 1;
      if (String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase()) correct += 1;
    });
    return bank.length ? correct / bank.length : (answered ? 0 : 0);
  }

  function repair(state) {
    state.answers = normalizeObject(state.answers);
    state.marked = normalizeObject(state.marked);
    state.eliminated = normalizeObject(state.eliminated);
    state.notes = normalizeObject(state.notes);
    state.highlights = normalizeObject(state.highlights);
    state.completed = normalizeObject(state.completed);
    state.warning = normalizeObject(state.warning);
    state.adaptive = normalizeObject(state.adaptive);
    state.adaptive.rw = state.adaptive.rw === 'hard' ? 'hard' : 'easy';
    state.adaptive.math = state.adaptive.math === 'hard' ? 'hard' : 'easy';

    state.mi = Number.isInteger(state.mi) ? state.mi : 0;
    state.mi = Math.max(0, Math.min(MODULES.length - 1, state.mi));
    const count = MODULES[state.mi].count;
    state.qi = Number.isInteger(state.qi) ? state.qi : 0;
    state.qi = Math.max(0, Math.min(count - 1, state.qi));

    if (state.submitted) {
      state.screen = 'finish';
      state.mi = MODULES.length - 1;
      state.qi = 0;
      state.endAt = null;
      state.breakEndAt = null;
      return;
    }

    if (state.screen === 'break') {
      state.mi = 2;
      state.qi = 0;
      if (!Number.isFinite(state.breakEndAt) || state.breakEndAt <= Date.now()) {
        state.breakEndAt = null;
        state.screen = 'directions';
      }
      return;
    }

    if (state.screen === 'test') {
      const current = MODULES[state.mi];
      if (state.completed[current.id]) {
        state.endAt = null;
        if (current.id === 'rw2') {
          state.mi = 2;
          state.qi = 0;
          state.breakEndAt = state.breakEndAt && state.breakEndAt > Date.now()
            ? state.breakEndAt
            : Date.now() + 600000;
          state.screen = 'break';
        } else if (current.id === 'math2') {
          state.screen = 'finish';
          state.submitted = true;
        } else {
          state.mi += 1;
          state.qi = 0;
          state.screen = 'directions';
        }
        return;
      }

      if (!Number.isFinite(state.endAt)) {
        state.qi = 0;
        state.screen = 'directions';
        return;
      }

      if (state.endAt <= Date.now()) {
        state.completed[current.id] = true;
        state.endAt = null;
        if (current.id === 'rw1') state.adaptive.rw = score('rw1', state) >= 0.7 ? 'hard' : 'easy';
        if (current.id === 'math1') state.adaptive.math = score('math1', state) >= 0.7 ? 'hard' : 'easy';

        if (current.id === 'rw2') {
          state.mi = 2;
          state.qi = 0;
          state.breakEndAt = Date.now() + 600000;
          state.screen = 'break';
        } else if (current.id === 'math2') {
          state.screen = 'finish';
          state.submitted = true;
        } else {
          state.mi += 1;
          state.qi = 0;
          state.screen = 'directions';
        }
      }
    }
  }

  const state = read();
  if (!state) return;
  const before = JSON.stringify(state);
  repair(state);
  if (JSON.stringify(state) !== before) write(state);
})();

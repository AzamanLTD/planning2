(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';
  const BREAK_MS = 600000;
  const MODULES = [
    { id: 'rw1', count: 27 },
    { id: 'rw2', count: 27 },
    { id: 'math1', count: 22 },
    { id: 'math2', count: 22 },
  ];
  const SCREENS = new Set(['access', 'setup', 'room', 'startcode', 'directions', 'test', 'break', 'finish']);

  const normalizeObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
  const normalizeBooleanMap = (value) => Object.fromEntries(
    Object.entries(normalizeObject(value)).filter(([, enabled]) => enabled === true).map(([key]) => [key, true])
  );
  const normalizeAnswerMap = (value) => Object.fromEntries(
    Object.entries(normalizeObject(value))
      .map(([key, entry]) => {
        if (typeof entry === 'string') return [key, entry];
        if (typeof entry === 'number' && Number.isFinite(entry)) return [key, String(entry)];
        return null;
      })
      .filter(Boolean)
  );
  const normalizeStringMap = (value) => Object.fromEntries(
    Object.entries(normalizeObject(value)).filter(([, entry]) => typeof entry === 'string')
  );
  const normalizeArrayMap = (value, itemGuard) => Object.fromEntries(
    Object.entries(normalizeObject(value)).map(([key, entries]) => [
      key,
      Array.isArray(entries) ? [...new Set(entries.filter(itemGuard))] : []
    ])
  );
  const normalizeFiniteTime = (value) => Number.isFinite(value) ? value : null;

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
    bank.forEach((question, index) => {
      const answer = state.answers[`${moduleId}-${index}`];
      if (answer !== undefined && String(answer).trim() !== '' && String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase()) correct += 1;
    });
    return bank.length ? correct / bank.length : 0;
  }

  function normalizeCompletionChain(state) {
    let priorComplete = true;
    for (const module of MODULES) {
      if (!priorComplete) state.completed[module.id] = false;
      priorComplete = state.completed[module.id] === true;
    }
  }

  function allModulesComplete(state) {
    return MODULES.every((module) => state.completed[module.id] === true);
  }

  function firstIncompleteModuleIndex(state) {
    const index = MODULES.findIndex((module) => state.completed[module.id] !== true);
    return index >= 0 ? index : MODULES.length - 1;
  }

  function advancePastCompleted(state) {
    const current = MODULES[state.mi];
    if (!current || !state.completed[current.id]) return false;

    state.endAt = null;
    state.qi = 0;
    if (current.id === 'rw1') {
      state.mi = 1;
      state.screen = 'directions';
    } else if (current.id === 'rw2') {
      state.mi = 2;
      state.breakEndAt = Number.isFinite(state.breakEndAt) && state.breakEndAt > Date.now()
        ? state.breakEndAt : Date.now() + BREAK_MS;
      state.screen = 'break';
    } else if (current.id === 'math1') {
      state.mi = 3;
      state.screen = 'directions';
    } else {
      state.mi = 3;
      state.submitted = true;
      state.screen = 'finish';
    }
    return true;
  }

  function expireModule(state) {
    const current = MODULES[state.mi];
    state.completed[current.id] = true;
    state.endAt = null;
    state.qi = 0;
    if (current.id === 'rw1') state.adaptive.rw = score('rw1', state) >= 0.7 ? 'hard' : 'easy';
    if (current.id === 'math1') state.adaptive.math = score('math1', state) >= 0.7 ? 'hard' : 'easy';

    if (current.id === 'rw2') {
      state.mi = 2;
      state.breakEndAt = Date.now() + BREAK_MS;
      state.screen = 'break';
    } else if (current.id === 'math2') {
      state.mi = 3;
      state.submitted = true;
      state.screen = 'finish';
    } else {
      state.mi += 1;
      state.screen = 'directions';
    }
  }

  function repair(state) {
    state.answers = normalizeAnswerMap(state.answers);
    state.marked = normalizeBooleanMap(state.marked);
    state.eliminated = normalizeArrayMap(state.eliminated, (entry) => Number.isInteger(entry) && entry >= 0 && entry <= 3);
    state.notes = normalizeStringMap(state.notes);
    state.highlights = normalizeArrayMap(state.highlights, (entry) => typeof entry === 'string' && entry.trim() !== '');
    state.completed = normalizeBooleanMap(state.completed);
    state.warning = normalizeBooleanMap(state.warning);
    state.adaptive = normalizeObject(state.adaptive);
    state.adaptive.rw = state.adaptive.rw === 'hard' ? 'hard' : 'easy';
    state.adaptive.math = state.adaptive.math === 'hard' ? 'hard' : 'easy';
    state.submitted = state.submitted === true;
    state.timerHidden = state.timerHidden === true;
    state.lineReader = state.lineReader === true;
    state.rules = state.rules === true;
    state.desk = state.desk === true;
    state.endAt = normalizeFiniteTime(state.endAt);
    state.breakEndAt = normalizeFiniteTime(state.breakEndAt);

    normalizeCompletionChain(state);
    state.screen = SCREENS.has(state.screen) ? state.screen : 'access';
    state.mi = Number.isInteger(state.mi) ? state.mi : 0;
    state.mi = Math.max(0, Math.min(MODULES.length - 1, state.mi));
    const count = MODULES[state.mi].count;
    state.qi = Number.isInteger(state.qi) ? state.qi : 0;
    state.qi = Math.max(0, Math.min(count - 1, state.qi));

    if (allModulesComplete(state)) {
      state.submitted = true;
      state.screen = 'finish';
      state.mi = 3;
      state.qi = 0;
      state.endAt = null;
      state.breakEndAt = null;
      return;
    }

    if (state.submitted) {
      state.screen = 'finish';
      state.mi = 3;
      state.qi = 0;
      state.endAt = null;
      state.breakEndAt = null;
      return;
    }

    if (state.screen === 'break') {
      const rw1Complete = state.completed.rw1 === true;
      const rw2Complete = state.completed.rw2 === true;
      if (rw1Complete && rw2Complete) {
        state.completed.rw1 = true;
        state.completed.rw2 = true;
        state.completed.math1 = false;
        state.completed.math2 = false;
        state.mi = 2;
        state.qi = 0;
        state.endAt = null;
        if (!Number.isFinite(state.breakEndAt) || state.breakEndAt <= Date.now()) {
          state.breakEndAt = null;
          state.screen = 'directions';
        }
        return;
      }
      state.breakEndAt = null;
      state.endAt = null;
      state.mi = firstIncompleteModuleIndex(state);
      state.qi = 0;
      state.screen = 'directions';
      return;
    }

    const firstIncomplete = firstIncompleteModuleIndex(state);
    if ((state.screen === 'directions' || state.screen === 'test') && state.mi > firstIncomplete) {
      state.mi = firstIncomplete;
      state.qi = 0;
      state.endAt = null;
      state.screen = 'directions';
      return;
    }
    if (state.screen !== 'finish' && state.screen !== 'directions' && state.screen !== 'test' && state.mi > firstIncomplete) {
      state.mi = firstIncomplete;
      state.qi = 0;
      state.endAt = null;
      return;
    }

    if ((state.screen === 'directions' || state.screen === 'test') && advancePastCompleted(state)) return;

    if (state.screen === 'test') {
      if (!Number.isFinite(state.endAt)) {
        state.qi = 0;
        state.screen = 'directions';
        return;
      }
      if (state.endAt <= Date.now()) expireModule(state);
    }
  }

  const state = read();
  if (!state) return;
  const before = JSON.stringify(state);
  repair(state);
  if (JSON.stringify(state) !== before) write(state);
})();

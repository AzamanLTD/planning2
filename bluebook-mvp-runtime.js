(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const demo = params.get('demo') === '1';
  if (!demo) return;

  const getState = () => window.AZAMAN_APP?.getState?.();
  const save = () => window.AZAMAN_APP?.save?.();
  const render = () => window.AZAMAN_APP?.render?.();
  const DEMO_MODULE_MS = Math.max(5000, Number(params.get('moduleSec')) * 1000 || 20000);
  const DEMO_BREAK_MS = Math.max(3000, Number(params.get('breakSec')) * 1000 || 8000);
  let lastApplied = '';

  function apply() {
    const state = getState();
    if (!state || state.harness) return;

    if (state.screen === 'test' && state.endAt) {
      const key = `module:${state.mi}`;
      if (lastApplied !== key) {
        lastApplied = key;
        const target = Date.now() + DEMO_MODULE_MS;
        if (state.endAt > target) {
          state.endAt = target;
          save();
          render();
          return;
        }
      }
    }

    if (state.screen === 'break' && state.breakEndAt) {
      const key = `break:${state.mi}`;
      if (lastApplied !== key) {
        lastApplied = key;
        const target = Date.now() + DEMO_BREAK_MS;
        if (state.breakEndAt > target) {
          state.breakEndAt = target;
          save();
          render();
        }
      }
    }

    if (state.screen !== 'test' && state.screen !== 'break') lastApplied = '';
  }

  function hookRender() {
    const api = window.AZAMAN_APP;
    if (!api?.render || api.render.__azmMvpDemoWrapped) return;
    const original = api.render;
    const wrapped = function wrappedRender(...args) {
      const result = original.apply(this, args);
      queueMicrotask(apply);
      return result;
    };
    Object.defineProperty(wrapped, '__azmMvpDemoWrapped', { value: true });
    api.render = wrapped;
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.body, { childList: true, subtree: true });
  hookRender();
  apply();
})();

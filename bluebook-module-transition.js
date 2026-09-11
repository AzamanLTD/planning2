(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();
  let shownKey = '';

  function actual() {
    const state = getState();
    return !!state && !state.harness;
  }

  function completedModuleForScreen(state) {
    if (state.screen === 'break' && state.completed?.rw2) return 'rw2';
    if (state.screen === 'finish' && state.completed?.math2) return 'math2';
    return '';
  }

  function show(state) {
    const moduleId = completedModuleForScreen(state);
    if (!moduleId) return;
    const key = `${moduleId}:${state.screen}`;
    if (shownKey === key || sessionStorage.getItem(`azm-transition-${key}`) === '1') return;
    shownKey = key;
    sessionStorage.setItem(`azm-transition-${key}`, '1');

    const overlay = document.createElement('div');
    overlay.className = 'azm-module-transition';
    overlay.innerHTML = '<div class="azm-module-transition-inner"><h1>This Module Is Over</h1><p>All your work has been saved.</p><p>You’ll move on automatically in just a moment.</p><p>Do not refresh this page or quit the app.</p><div class="azm-loading-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div>';
    document.body.appendChild(overlay);
    window.setTimeout(() => overlay.remove(), 1800);
  }

  function maintain() {
    if (actual()) show(getState());
  }

  const observer = new MutationObserver(maintain);
  observer.observe(document.body, { childList: true, subtree: true });
  maintain();
})();

(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();

  function syncModeClass() {
    const state = getState();
    document.body.classList.toggle('azm-harness', !!state?.harness);
  }

  function actualModeReviewCopy() {
    const state = getState();
    if (!state || state.harness) return;
    const modal = document.getElementById('reviewModal');
    const copy = modal?.querySelector('.modal > p.small');
    if (copy) copy.textContent = 'You can return to any question in this module. The module ends automatically when time expires.';
  }

  function actualModeAdvanceGuard(event) {
    const state = getState();
    const button = event.target?.closest?.('#nextBtn');
    if (!state || state.harness || !button || state.screen !== 'test') return;
    if (!/Review module/i.test(button.textContent || '')) return;
    if (!state.endAt || state.endAt <= Date.now()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    showBlockedMessage();
  }

  function showBlockedMessage() {
    if (document.getElementById('azmExamGate')) return;
    const n = document.createElement('div');
    n.id = 'azmExamGate';
    n.className = 'azm-exam-gate';
    n.innerHTML = '<div class="azm-exam-gate-inner" role="status" aria-live="polite"><strong>This module is not over yet.</strong><span>You cannot move to the next module until the timer expires.</span></div>';
    document.body.appendChild(n);
    window.setTimeout(() => n.remove(), 2200);
  }

  document.addEventListener('click', actualModeAdvanceGuard, true);

  const observer = new MutationObserver(() => {
    syncModeClass();
    actualModeReviewCopy();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  syncModeClass();
})();

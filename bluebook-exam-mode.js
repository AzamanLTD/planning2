(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();

  function syncModeClass() {
    const state = getState();
    document.body.classList.toggle('azm-harness', !!state?.harness);
  }

  function actualModeExamHeader() {
    const state = getState();
    const title = document.querySelector('.test-top .test-title');
    if (!state || state.harness || state.screen !== 'test' || !title) return;
    const index = Math.max(0, Math.min(3, Number(state.mi) || 0));
    const section = index < 2 ? '1' : '2';
    const name = index < 2 ? 'Reading and Writing' : 'Math';
    const text = `Section ${section}: ${name}`;
    if (title.textContent.trim() !== text) title.textContent = text;
  }

  function actualModeDirections() {
    const state = getState();
    const page = document.getElementById('azmDirectionsPage');
    const panel = page?.querySelector('.azm-directions-panel');
    if (!state || state.harness || state.screen !== 'directions' || !page || !panel) return;
    const index = Math.max(0, Math.min(3, Number(state.mi) || 0));
    const section = index < 2 ? '1' : '2';
    const module = (index % 2) + 1;
    const name = index < 2 ? 'Reading and Writing' : 'Math';
    const heading = panel.querySelector('h2');
    if (heading) heading.textContent = `Section ${section}, Module ${module}: ${name}`;

    const bullets = index < 2
      ? [
          'This module is made up of multiple-choice questions.',
          'You can move back and forth between questions until time expires.',
          'At the end of the module, you can review your answers until time expires.',
          'Once the next module begins, you cannot return to these questions.'
        ]
      : [
          'This module is made up of multiple-choice questions.',
          'You can move back and forth between questions until time expires.',
          'At the end of the module, you can review your answers until time expires.',
          'Once the next module begins, you cannot return to these questions.'
        ];
    const list = panel.querySelector('ul');
    if (list) {
      const html = bullets.map((text) => `<li>${text}</li>`).join('');
      if (list.innerHTML !== html) list.innerHTML = html;
    }
    panel.querySelector('.azm-official-directions-copy')?.remove();
  }

  function actualModeReviewCopy() {
    const state = getState();
    if (!state || state.harness) return;
    const modal = document.getElementById('reviewModal');
    const copy = modal?.querySelector('.modal > p.small');
    const text = 'You can return to any question in this module. The module ends automatically when time expires.';
    if (copy && copy.textContent !== text) copy.textContent = text;
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
    actualModeExamHeader();
    actualModeDirections();
    actualModeReviewCopy();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  syncModeClass();
  actualModeExamHeader();
  actualModeDirections();
})();

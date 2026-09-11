(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();
  const save = () => window.AZAMAN_APP?.save?.();
  const render = () => window.AZAMAN_APP?.render?.();
  let directionsTimer = null;

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

  function fmt(seconds) {
    seconds = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function syncDirectionsTimer() {
    const state = getState();
    const timer = document.querySelector('#azmDirectionsPage .azm-directions-timer');
    if (!state || state.harness || state.screen !== 'directions' || !timer) {
      if (directionsTimer) window.clearInterval(directionsTimer);
      directionsTimer = null;
      return;
    }

    const minutes = state.mi >= 2 ? 35 : 32;
    const moduleId = state.mi === 0 ? 'rw1' : state.mi === 1 ? 'rw2' : state.mi === 2 ? 'math1' : 'math2';
    if (!state.endAt && !state.completed?.[moduleId]) {
      state.endAt = Date.now() + minutes * 60 * 1000;
      state.qi = 0;
      save();
    }

    const update = () => {
      const current = getState();
      if (!current || current.screen !== 'directions') return;
      const seconds = current.endAt ? Math.max(0, Math.ceil((current.endAt - Date.now()) / 1000)) : minutes * 60;
      const textNode = [...timer.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.nodeValue = `${fmt(seconds)} `;
      if (seconds <= 0 && current.endAt) {
        if (directionsTimer) window.clearInterval(directionsTimer);
        directionsTimer = null;
        render();
      }
    };

    if (!directionsTimer) directionsTimer = window.setInterval(update, 250);
    update();
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

    const bullets = [
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
    syncDirectionsTimer();
  }

  function actualModeDirectionsContinue(event) {
    const state = getState();
    const button = event.target?.closest?.('#beginModuleBtn');
    if (!state || state.harness || !button || state.screen !== 'directions') return;
    if (!state.endAt || state.endAt <= Date.now()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    state.qi = 0;
    save();
    render();
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

  document.addEventListener('click', actualModeDirectionsContinue, true);
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

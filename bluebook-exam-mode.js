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
    const section = index < 2 ? 'I' : 'II';
    const module = (index % 2) + 1;
    const name = index < 2 ? 'Reading and Writing' : 'Math';
    const text = `Section ${section}, Module ${module}: ${name}`;
    if (title.textContent.trim() !== text) title.textContent = text;
  }

  function actualModeDirections() {
    const state = getState();
    const page = document.getElementById('azmDirectionsPage');
    const panel = page?.querySelector('.azm-directions-panel');
    if (!state || state.harness || state.screen !== 'directions' || !page || !panel) return;
    const index = Math.max(0, Math.min(3, Number(state.mi) || 0));
    const section = index < 2 ? 'I' : 'II';
    const module = (index % 2) + 1;
    const name = index < 2 ? 'Reading and Writing' : 'Math';
    const heading = panel.querySelector('h2');
    if (heading) heading.textContent = `Section ${section}, Module ${module}: ${name}`;

    const prose = index < 2
      ? '<p>The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).</p><p>All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.</p>'
      : '<p>The questions in this section address a number of important math skills. Use of a calculator is permitted for all questions. A reference sheet, calculator, and these directions can be accessed throughout the test.</p><p>Some questions ask you to enter your answer. For these questions, solve the problem and enter your answer in the response field.</p>';
    let content = panel.querySelector('.azm-official-directions-copy');
    if (!content) {
      content = document.createElement('div');
      content.className = 'azm-official-directions-copy';
      const button = panel.querySelector('#beginModuleBtn');
      panel.insertBefore(content, button || null);
    }
    if (content.innerHTML !== prose) content.innerHTML = prose;
    panel.querySelector('ul')?.remove();
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

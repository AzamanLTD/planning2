(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();
  const save = () => window.AZAMAN_APP?.save?.();
  const render = () => window.AZAMAN_APP?.render?.();
  let wasBreak = false;
  let readyShown = false;

  function actual() {
    const state = getState();
    return !!state && !state.harness;
  }

  function mountBreak() {
    const state = getState();
    if (!actual() || state.screen !== 'break' || document.querySelector('.azm-module-transition')) return;
    const app = document.getElementById('app');
    if (!app || document.getElementById('azmBreakPage')) return;

    wasBreak = true;
    const remaining = state.breakEndAt ? Math.max(0, Math.ceil((state.breakEndAt - Date.now()) / 1000)) : 0;
    readyShown = !state.breakEndAt || remaining <= 0;
    app.innerHTML = `<main id="azmBreakPage" class="azm-break-page" aria-labelledby="azmBreakTitle">
      <section class="azm-break-timer" aria-label="Scheduled break timer">
        <div class="azm-break-label">Time remaining</div>
        <div id="breakClock" class="azm-break-clock">${fmt(remaining)}</div>
      </section>
      <section class="azm-break-content">
        <h1 id="azmBreakTitle">Take a Break: Do Not Close Your Device</h1>
        <p class="lead">You have 10 minutes for your break. You must stay in the testing room. When the break is over, you'll be able to resume testing.</p>
        <h2>During your break:</h2>
        <ol>
          <li>Keep your testing device with you.</li>
          <li>You may have a snack or drink.</li>
          <li>Do not access your phone or other prohibited devices.</li>
          <li>Do not leave the testing room unless your proctor gives you permission.</li>
          <li>Return to your seat before the break ends.</li>
        </ol>
        <div class="azm-break-ready" ${readyShown ? '' : 'hidden'}>
          <button id="azmResumeBtn" class="btn">Resume Testing Now</button>
        </div>
      </section>
      <div class="azm-break-footer">${escapeHtml(state.student || 'Student')}</div>
    </main>`;
    bindResume();
  }

  function fmt(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }

  function bindResume() {
    const state = getState();
    const btn = document.getElementById('azmResumeBtn');
    if (!btn || !state || state.breakEndAt) return;
    btn.focus();
    btn.addEventListener('click', () => {
      const current = getState();
      if (!current || current.harness || current.screen !== 'break') return;
      current.mi = 2;
      current.qi = 0;
      current.breakEndAt = null;
      current.endAt = null;
      save();
      wasBreak = false;
      readyShown = false;
      render();
    });
  }

  function maintain() {
    if (!actual()) return;
    const state = getState();
    if (!state) return;

    // app.js historically auto-routes from break -> directions at 00:00.
    // Convert that internal routing into the Bluebook-style paused handoff
    // so the student explicitly presses Resume Testing Now.
    if (wasBreak && state.screen === 'directions' && state.mi === 2 && state.completed?.rw2 && !state.breakEndAt) {
      state.screen = 'break';
      state.breakEndAt = null;
      save();
      readyShown = true;
      render();
      return;
    }

    if (state.screen !== 'break') {
      wasBreak = false;
      readyShown = false;
      return;
    }

    wasBreak = true;
    mountBreak();

    const page = document.getElementById('azmBreakPage');
    if (!page) return;
    const clock = document.getElementById('breakClock');
    const left = state.breakEndAt ? Math.max(0, Math.ceil((state.breakEndAt - Date.now()) / 1000)) : 0;
    if (clock) clock.textContent = fmt(left);

    if (left <= 0 && !readyShown) {
      readyShown = true;
      if (state.breakEndAt) {
        state.breakEndAt = null;
        save();
      }
      const ready = page.querySelector('.azm-break-ready');
      if (ready) ready.hidden = false;
      bindResume();
    }
  }

  const observer = new MutationObserver(maintain);
  observer.observe(document.body, { childList: true, subtree: true });
  maintain();
})();

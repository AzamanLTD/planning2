(() => {
  'use strict';

  let recoveryCountdown = null;

  const getState = () => window.AZAMAN_APP?.getState?.();
  const save = () => window.AZAMAN_APP?.save?.();

  function isActualRuntime() {
    const state = getState();
    return !!state && !state.harness;
  }

  function recoveryIsValid(recovery) {
    return Number.isFinite(recovery?.remainingMs) && recovery.remainingMs > 0 && Number.isFinite(recovery?.expiresAt) && Date.now() < recovery.expiresAt;
  }

  function clearRecoveryCountdown() {
    if (recoveryCountdown) window.clearInterval(recoveryCountdown);
    recoveryCountdown = null;
  }

  function expireRecovery() {
    const state = getState();
    if (!state?.recovery || recoveryIsValid(state.recovery)) return false;
    clearRecoveryCountdown();
    state.recovery = null;
    state.screen = 'access';
    state.endAt = null;
    save();
    window.AZAMAN_APP?.render?.();
    return true;
  }

  function mountRecoveryNotice() {
    const state = getState();
    if (!isActualRuntime() || state.screen !== 'signin' || !state.recovery || document.getElementById('azmRecoveryNotice')) return;
    if (!recoveryIsValid(state.recovery)) { expireRecovery(); return; }
    const page = document.querySelector('.access-page');
    if (!page) return;
    const notice = document.createElement('div');
    notice.id = 'azmRecoveryNotice';
    notice.className = 'azm-recovery-notice';
    notice.setAttribute('role', 'status');
    notice.innerHTML = '<strong>Testing was interrupted.</strong><span>Your answers are saved on this device. Sign in again to continue testing.</span><span id="azmRecoveryCountdown" class="azm-recovery-countdown"></span>';
    page.insertBefore(notice, page.firstChild);
    const update = () => {
      const current = getState();
      if (!current?.recovery) { clearRecoveryCountdown(); return; }
      const left = Math.max(0, current.recovery.expiresAt - Date.now());
      const mins = Math.ceil(left / 60000);
      const countdown = document.getElementById('azmRecoveryCountdown');
      if (countdown) countdown.textContent = `Recovery window: about ${mins} min remaining.`;
      if (left <= 0) expireRecovery();
    };
    clearRecoveryCountdown();
    update();
    recoveryCountdown = window.setInterval(update, 1000);
  }

  function resumeFromRecovery(event) {
    const state = getState();
    const button = event.target?.closest?.('#signinBtn');
    if (!state || !state.recovery || state.screen !== 'signin' || !button || !isActualRuntime()) return;
    if (!recoveryIsValid(state.recovery)) { event.preventDefault(); event.stopImmediatePropagation(); expireRecovery(); return; }
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!email?.value.trim() || !password?.value.trim()) return;
    event.preventDefault(); event.stopImmediatePropagation();
    state.student = document.getElementById('student')?.value.trim() || state.student || 'Student';
    state.email = email.value.trim();
    state.password = '';
    state.endAt = Date.now() + state.recovery.remainingMs;
    state.recovery = null;
    state.screen = 'test';
    clearRecoveryCountdown();
    save();
    window.AZAMAN_APP?.render?.();
  }

  function laptopArt() {
    return `<svg viewBox="0 0 220 180" class="azm-congrats-laptop" aria-hidden="true">
      <circle cx="110" cy="82" r="55" fill="#eef5fc" stroke="#dbe7f4" stroke-width="2"/>
      <rect x="54" y="38" width="112" height="82" rx="8" fill="#fff" stroke="#59616a" stroke-width="4"/>
      <rect x="65" y="49" width="90" height="58" fill="#fff" stroke="#59616a" stroke-width="3"/>
      <circle cx="110" cy="78" r="17" fill="#8fd4f5" stroke="#59616a" stroke-width="2.5"/>
      <path d="M100 74q3-5 6 0M114 74q3-5 6 0" fill="none" stroke="#59616a" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M99 84q11 10 22 0" fill="none" stroke="#59616a" stroke-width="3" stroke-linecap="round"/>
      <path d="M48 122h124l13 13H35z" fill="#d9e0e7" stroke="#59616a" stroke-width="4" stroke-linejoin="round"/>
      <path d="M56 127h108" stroke="#9da5ad" stroke-width="2"/>
    </svg>`;
  }

  function mountSubmissionScreen() {
    const state = getState();
    if (!isActualRuntime() || state.screen !== 'finish' || document.getElementById('azmSubmissionScreen')) return;
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `<main id="azmSubmissionScreen" class="azm-submission-page azm-congrats-page"><section class="azm-congrats-card" role="status" aria-live="polite" aria-atomic="true"><h1>Congratulations!</h1><p class="azm-congrats-sub">The test is complete, and your answers have been submitted.</p><div class="azm-congrats-panel"><div class="azm-congrats-art">${laptopArt()}</div><div class="azm-congrats-copy"><p>Your proctor will dismiss you when it’s time to go.</p><p>Please <strong>be quiet</strong>; other students may still be testing.</p></div></div><button type="button" id="azmReturnHome" class="azm-congrats-home">Return to Homepage</button></section></main>`;
    document.getElementById('azmReturnHome')?.addEventListener('click', () => { try { localStorage.removeItem('azaman-sat-practice-v3'); } catch (_) {} location.reload(); });
  }

  function maintain() {
    if (!isActualRuntime()) { clearRecoveryCountdown(); return; }
    if (getState()?.recovery) { mountRecoveryNotice(); return; }
    clearRecoveryCountdown();
    mountSubmissionScreen();
  }

  function installRenderHook() {
    const api = window.AZAMAN_APP;
    if (!api?.render || api.render.__azmExamFinalizationWrapped) return;
    const originalRender = api.render;
    const wrappedRender = function wrappedRender(...args) { const result = originalRender.apply(this, args); queueMicrotask(maintain); return result; };
    Object.defineProperty(wrappedRender, '__azmExamFinalizationWrapped', { value: true });
    api.render = wrappedRender;
  }

  document.addEventListener('click', resumeFromRecovery, true);
  installRenderHook();
  maintain();
})();

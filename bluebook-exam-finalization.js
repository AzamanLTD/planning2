(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';
  let recoveryCountdown = null;
  let submissionTimer = null;

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
    if (!recoveryIsValid(state.recovery)) {
      expireRecovery();
      return;
    }

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
      if (!current?.recovery) {
        clearRecoveryCountdown();
        return;
      }
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

    if (!recoveryIsValid(state.recovery)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      expireRecovery();
      return;
    }

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!email?.value.trim() || !password?.value.trim()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
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

  function mountSubmissionScreen() {
    const state = getState();
    if (!isActualRuntime() || state.screen !== 'finish' || document.getElementById('azmSubmissionScreen')) return;
    const app = document.getElementById('app');
    if (!app) return;

    if (submissionTimer) window.clearTimeout(submissionTimer);
    app.innerHTML = `<main id="azmSubmissionScreen" class="azm-submission-page"><section class="azm-submission-card" role="status" aria-live="polite" aria-atomic="true"><div class="azm-submission-spinner" aria-hidden="true"><span></span><span></span><span></span></div><p class="azm-submission-kicker">Digital SAT</p><h1 id="azmSubmissionTitle">Submitting your answers</h1><p id="azmSubmissionCopy">Your answers are being saved on this device. Please don't close Bluebook.</p><div class="azm-submission-rule" aria-hidden="true"></div><p class="azm-submission-foot" id="azmSubmissionFoot">Your proctor will let you know when you may leave.</p></section></main>`;

    submissionTimer = window.setTimeout(() => {
      const current = getState();
      const title = document.getElementById('azmSubmissionTitle');
      const copy = document.getElementById('azmSubmissionCopy');
      const spinner = document.querySelector('.azm-submission-spinner');
      if (!current || current.screen !== 'finish' || current.harness || !title || !copy) return;
      title.textContent = 'Answers submitted';
      copy.textContent = 'Your test responses have been recorded successfully on this device.';
      spinner?.setAttribute('data-complete', '1');
      const foot = document.getElementById('azmSubmissionFoot');
      if (foot) foot.textContent = 'Do not close your device until your proctor dismisses you.';
    }, 1200);
  }

  function maintain() {
    if (!isActualRuntime()) {
      clearRecoveryCountdown();
      return;
    }
    if (getState()?.recovery) {
      mountRecoveryNotice();
      return;
    }
    clearRecoveryCountdown();
    mountSubmissionScreen();
  }

  document.addEventListener('click', resumeFromRecovery, true);
  const observer = new MutationObserver(maintain);
  observer.observe(document.body, { childList: true, subtree: true });
  maintain();
})();

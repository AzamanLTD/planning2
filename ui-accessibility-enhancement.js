(() => {
  'use strict';

  function enhanceChoices(root = document) {
    root.querySelectorAll('.choices').forEach((group) => {
      group.querySelectorAll('.choice').forEach((button) => {
        const selected = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', String(selected));
      });
    });
  }

  function enhanceReview(modal) {
    if (!modal || modal.dataset.a11yReady === '1') return;
    modal.dataset.a11yReady = '1';
    const title = modal.querySelector('.modal-head h3');
    if (title) {
      title.id = title.id || 'reviewDialogTitle';
      modal.setAttribute('aria-labelledby', title.id);
    }
    modal.querySelector('#closeReview')?.setAttribute('aria-label', 'Close question review');
    modal.querySelector('#closeReview2')?.setAttribute('aria-label', 'Return to current question');
    modal.querySelector('#submitModule')?.setAttribute('aria-label', 'Finish this module');
    modal.querySelectorAll('.review-q').forEach((button) => {
      const number = button.textContent.trim();
      const states = [button.classList.contains('answered') ? 'answered' : 'unanswered'];
      if (button.classList.contains('marked')) states.push('marked for review');
      button.setAttribute('aria-label', `Question ${number}, ${states.join(', ')}`);
    });
  }

  function enhanceTools(popover) {
    if (!popover || popover.dataset.a11yReady === '1') return;
    popover.dataset.a11yReady = '1';
    popover.setAttribute('role', 'menu');
    const title = popover.querySelector('.tool-head b');
    if (title) {
      title.id = title.id || 'toolMenuTitle';
      popover.setAttribute('aria-labelledby', title.id);
    }
    popover.querySelector('#closeTools')?.setAttribute('aria-label', 'Close test tools');
    popover.querySelectorAll('.tool-item').forEach((item) => item.setAttribute('role', 'menuitem'));
  }

  function enhanceStartCode(root = document) {
    const fields = [...root.querySelectorAll('.start-digit')];
    fields.forEach((field, index) => {
      field.setAttribute('aria-label', `Start code digit ${index + 1} of ${fields.length || 6}`);
      field.setAttribute('aria-posinset', String(index + 1));
      field.setAttribute('aria-setsize', String(fields.length || 6));
    });
  }

  function installReducedMotionSupport() {
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (document.getElementById('azmReducedMotion')) return;
    const style = document.createElement('style');
    style.id = 'azmReducedMotion';
    style.textContent = '*,:before,:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}';
    document.head.appendChild(style);
  }

  function enhance() {
    enhanceChoices();
    enhanceReview(document.getElementById('reviewModal'));
    enhanceTools(document.getElementById('toolPopover'));
    enhanceStartCode();
    installReducedMotionSupport();
  }

  const observer = new MutationObserver(enhance);
  observer.observe(document.body, { childList: true, subtree: true });
  enhance();
})();

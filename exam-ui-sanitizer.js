(() => {
  'use strict';

  function sanitize() {
    const isTest = !!document.querySelector('.test-shell');
    if (!isTest) return;

    const meta = document.querySelector('.q-meta');
    if (meta) {
      meta.hidden = true;
      meta.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.source-panel .source-label').forEach((label) => {
      label.textContent = 'Source';
    });
  }

  const observer = new MutationObserver(sanitize);
  observer.observe(document.body, { childList: true, subtree: true });
  sanitize();
})();

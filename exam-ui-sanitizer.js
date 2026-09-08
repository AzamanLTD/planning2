(() => {
  'use strict';

  function sanitize() {
    const title = document.querySelector('.test-title')?.textContent || '';
    const isTest = !!document.querySelector('.test-shell');
    if (!isTest || !title) return;

    const meta = document.querySelector('.q-meta');
    if (meta) {
      const counter = document.querySelector('.test-counter')?.textContent?.trim() || '';
      meta.textContent = counter || 'Question';
      meta.setAttribute('aria-label', meta.textContent);
    }

    document.querySelectorAll('.source-panel .source-label').forEach((label) => {
      label.textContent = 'Source';
    });
  }

  const observer = new MutationObserver(sanitize);
  observer.observe(document.body, { childList: true, subtree: true });
  sanitize();
})();

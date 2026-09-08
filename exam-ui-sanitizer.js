(() => {
  'use strict';

  function sanitize() {
    if (!document.querySelector('.test-shell')) return;

    const meta = document.querySelector('.q-meta');
    if (meta && meta.hidden !== true) meta.hidden = true;
    if (meta && meta.getAttribute('aria-hidden') !== 'true') meta.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('.source-panel .source-label').forEach((label) => {
      if (label.textContent.trim() !== 'Source') label.textContent = 'Source';
    });
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector('.test-shell')) sanitize();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  sanitize();
})();

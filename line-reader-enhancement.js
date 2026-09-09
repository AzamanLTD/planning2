(() => {
  'use strict';

  const state = { installed: false };

  function enhance(reader) {
    if (!reader || state.installed) return;
    state.installed = true;
    reader.setAttribute('aria-hidden', 'true');
    reader.setAttribute('data-line-reader-active', 'true');
    reader.innerHTML = '';

    const frame = document.createElement('div');
    frame.className = 'line-reader-frame';
    frame.setAttribute('aria-hidden', 'true');
    reader.appendChild(frame);

    const update = () => {
      const prompt = document.getElementById('questionPrompt');
      if (!prompt) return;
      const rect = prompt.getBoundingClientRect();
      const top = Math.max(8, Math.min(window.innerHeight - 56, rect.top - 8));
      frame.style.top = `${top}px`;
      frame.style.height = `${Math.max(48, Math.min(96, rect.height + 16))}px`;
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    reader._azmUpdate = update;
  }

  function observe() {
    const reader = document.querySelector('.line-reader');
    if (reader) enhance(reader);
    const app = document.getElementById('app');
    if (!app) return;
    new MutationObserver(() => {
      const current = document.querySelector('.line-reader');
      if (!current) {
        state.installed = false;
        return;
      }
      enhance(current);
      current._azmUpdate?.();
    }).observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe, { once: true });
  else observe();
})();

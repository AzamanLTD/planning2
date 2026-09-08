(() => {
  'use strict';

  const visibleButton = (label) => [...document.querySelectorAll('button')]
    .find((button) => button.getClientRects().length > 0 && button.textContent.trim().toLowerCase() === label.toLowerCase());

  document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey) || !event.altKey || event.shiftKey) {
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'p') {
        const mark = visibleButton('Mark for review');
        if (mark) { event.preventDefault(); mark.click(); }
      } else if (event.altKey && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'c') {
        const tools = visibleButton('Test tools');
        if (tools) { event.preventDefault(); tools.click(); requestAnimationFrame(() => visibleButton('Calculator')?.click()); }
      }
      return;
    }

    if (event.key.toLowerCase() === 'h') {
      event.preventDefault();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F1', bubbles: true }));
    }
  }, true);
})();

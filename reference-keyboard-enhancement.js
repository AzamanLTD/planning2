(() => {
  'use strict';

  function bind(panel) {
    if (!panel || panel.dataset.referenceKeyboardReady === '1') return;
    const viewport = panel.querySelector('.reference-viewport');
    const content = panel.querySelector('.reference-sheet-content');
    if (!viewport || !content) return;

    panel.dataset.referenceKeyboardReady = '1';
    viewport.dataset.referenceKeyboard = 'true';
    viewport.setAttribute('aria-describedby', 'referenceSheetPanHelp');

    if (!document.getElementById('referenceSheetPanHelp')) {
      const help = document.createElement('span');
      help.id = 'referenceSheetPanHelp';
      help.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      help.textContent = 'At greater than 100 percent zoom, use the arrow keys to pan the reference sheet. Hold Shift to pan farther. Home resets the view.';
      viewport.insertAdjacentElement('afterend', help);
    }

    const zoomLevel = () => Number(panel.querySelector('.reference-zoom-value')?.textContent?.replace('%', '')) || 100;
    const applyOffset = (dx, dy) => {
      const transform = getComputedStyle(content).transform;
      const match = transform.match(/^matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*([^,]+)\)$/);
      if (!match) return;
      const scale = zoomLevel() / 100;
      if (scale <= 1) return;
      const minX = Math.min(0, viewport.clientWidth - content.offsetWidth * scale);
      const minY = Math.min(0, viewport.clientHeight - content.offsetHeight * scale);
      const x = Math.max(minX, Math.min(0, Number(match[1]) + dx));
      const y = Math.max(minY, Math.min(0, Number(match[2]) + dy));
      content.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };

    viewport.addEventListener('keydown', (event) => {
      const step = event.shiftKey ? 72 : 24;
      if (event.key === 'Home') {
        event.preventDefault();
        panel.querySelector('[data-reference-action="reset"]')?.click();
        return;
      }
      if (zoomLevel() <= 100) return;
      const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step]
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      applyOffset(move[0], move[1]);
    });
  }

  const observer = new MutationObserver(() => bind(document.getElementById('referencePanel')));
  observer.observe(document.body, { childList: true, subtree: true });
  bind(document.getElementById('referencePanel'));
})();

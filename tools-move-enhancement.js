(() => {
  'use strict';

  const MOVE_LABELS = {
    calculatorPanel: 'Move calculator',
    referencePanel: 'Move reference sheet'
  };
  const STEP = 24;

  function visible(el) {
    return !!el && el.getClientRects().length > 0;
  }

  function clampPosition(panel, left, top) {
    const width = panel.offsetWidth || 320;
    const height = panel.offsetHeight || 240;
    return {
      left: Math.max(8, Math.min(window.innerWidth - width - 8, left)),
      top: Math.max(8, Math.min(window.innerHeight - height - 8, top))
    };
  }

  function setPosition(panel, left, top) {
    const next = clampPosition(panel, left, top);
    panel.style.left = `${next.left}px`;
    panel.style.top = `${next.top}px`;
    panel.style.right = 'auto';
    panel.dataset.azmMovePosition = '1';
  }

  function ensurePosition(panel) {
    if (panel.dataset.azmMovePosition === '1') return;
    const rect = panel.getBoundingClientRect();
    setPosition(panel, rect.left, rect.top);
  }

  function addMoveControl(panel) {
    if (panel.dataset.azmMoveReady === '1') return;
    const head = panel.querySelector('.panel-head');
    if (!head) return;
    const close = head.querySelector('button');
    const move = document.createElement('button');
    move.type = 'button';
    move.className = 'icon-btn azm-move-button';
    move.setAttribute('aria-label', MOVE_LABELS[panel.id] || 'Move dialog');
    move.setAttribute('aria-pressed', 'false');
    move.title = 'Move with arrow keys';
    move.textContent = '↕';
    if (close) head.insertBefore(move, close); else head.appendChild(move);

    move.addEventListener('click', () => {
      ensurePosition(panel);
      const pressed = move.getAttribute('aria-pressed') === 'true';
      move.setAttribute('aria-pressed', String(!pressed));
      if (!pressed) move.focus();
    });

    move.addEventListener('keydown', (event) => {
      if (move.getAttribute('aria-pressed') !== 'true') return;
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        move.setAttribute('aria-pressed', 'false');
        if (event.key !== 'Escape') move.focus();
        return;
      }
      const deltas = {
        ArrowLeft: [-STEP, 0],
        ArrowRight: [STEP, 0],
        ArrowUp: [0, -STEP],
        ArrowDown: [0, STEP]
      };
      const delta = deltas[event.key];
      if (!delta) return;
      const rect = panel.getBoundingClientRect();
      setPosition(panel, rect.left + delta[0], rect.top + delta[1]);
      event.preventDefault();
    });

    panel.dataset.azmMoveReady = '1';
  }

  function enhance(panel) {
    if (!visible(panel)) return;
    addMoveControl(panel);
  }

  const observer = new MutationObserver(() => {
    enhance(document.getElementById('calculatorPanel'));
    enhance(document.getElementById('referencePanel'));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', () => {
    document.querySelectorAll('#calculatorPanel, #referencePanel').forEach((panel) => {
      if (panel.dataset.azmMovePosition !== '1') return;
      const rect = panel.getBoundingClientRect();
      setPosition(panel, rect.left, rect.top);
    });
  });
})();

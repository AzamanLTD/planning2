(() => {
  'use strict';

  const shortcuts = [
    ['F1', 'Keyboard shortcuts'],
    ['F6 / Shift+F6', 'Move between exam regions'],
    ['Ctrl + + / Ctrl + - / Ctrl + 0', 'Zoom in / out / reset'],
    ['Ctrl + Alt + B', 'Back'],
    ['Ctrl + Alt + X', 'Next'],
    ['Ctrl + Alt + G', 'Question menu'],
    ['Ctrl + Alt + Shift + D', 'Directions'],
    ['Ctrl + L', 'Line reader'],
    ['Ctrl + Alt + T', 'Hide/show timer or close the 5-minute message'],
    ['Ctrl + Alt + V', 'Mark for review'],
    ['Ctrl + H', 'Highlights & Notes'],
    ['Ctrl + Alt + C', 'Calculator'],
    ['Ctrl + Alt + R', 'Reference sheet'],
    ['Ctrl + Alt + O', 'Option eliminator'],
    ['Ctrl + Alt + 1–4', 'Eliminate option A–D'],
    ['Ctrl + Shift + 1–4', 'Select option A–D'],
  ];

  const isTyping = (target) => {
    if (!target) return false;
    const tag = target.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || target.isContentEditable;
  };

  const click = (selector) => document.querySelector(selector)?.click();
  const visible = (el) => !!el && el.getClientRects().length > 0;

  const buttonsByText = (label) => [...document.querySelectorAll('button')]
    .find((b) => visible(b) && b.textContent.trim().toLowerCase() === label.toLowerCase());

  const clickText = (label) => buttonsByText(label)?.click();

  function regionNodes() {
    return [
      document.querySelector('.test-top'),
      document.querySelector('.source-panel'),
      document.querySelector('.question-panel'),
      document.querySelector('.test-footer')
    ].filter(Boolean);
  }

  function focusRegion(direction) {
    const nodes = regionNodes();
    if (!nodes.length) return;
    nodes.forEach((node) => { node.tabIndex = node.tabIndex < 0 ? 0 : node.tabIndex; });
    const active = document.activeElement;
    let index = nodes.indexOf(active);
    if (index < 0) {
      index = direction > 0 ? -1 : 0;
    }
    const next = nodes[(index + direction + nodes.length) % nodes.length];
    next.focus({ preventScroll: false });
    next.scrollIntoView({ block: 'nearest' });
  }

  function openShortcuts() {
    document.getElementById('shortcutHelp')?.remove();
    const n = document.createElement('div');
    n.id = 'shortcutHelp';
    n.className = 'modal-backdrop';
    n.innerHTML = `<div class="modal shortcut-help" role="dialog" aria-modal="true" aria-labelledby="shortcutTitle">
      <div class="modal-head"><h3 id="shortcutTitle">Keyboard shortcuts</h3><button class="icon-btn" id="shortcutClose" aria-label="Close">×</button></div>
      <div class="shortcut-list">${shortcuts.map(([key, desc]) => `<div class="shortcut-row"><kbd>${key}</kbd><span>${desc}</span></div>`).join('')}</div>
      <div class="modal-actions"><button class="btn" id="shortcutDone">Done</button></div>
    </div>`;
    document.body.appendChild(n);
    const close = () => n.remove();
    n.querySelector('#shortcutClose').onclick = close;
    n.querySelector('#shortcutDone').onclick = close;
    n.querySelector('#shortcutDone').focus();
  }

  function closeModal() {
    const modal = document.querySelector('.modal-backdrop[role="dialog"]');
    if (!modal) return false;
    const close = modal.querySelector('#shortcutClose, #closeReview, #closeReview2, #dismissWarn');
    if (close) { close.click(); return true; }
    return false;
  }

  function triggerOption(number, mode) {
    const buttons = [...document.querySelectorAll(mode === 'select' ? '[data-answer]' : '[data-eliminate]')]
      .filter(visible);
    if (mode === 'select') {
      const target = buttons[number - 1];
      if (target) target.click();
    } else {
      const target = document.querySelector(`[data-eliminate="${number - 1}"]`);
      target?.click();
    }
  }

  function onKeydown(event) {
    const key = event.key;
    const lower = key.toLowerCase();
    const mod = event.ctrlKey || event.metaKey;

    if (key === 'Escape' && closeModal()) {
      event.preventDefault();
      return;
    }

    if (key === 'F1') {
      event.preventDefault();
      openShortcuts();
      return;
    }

    if (!document.querySelector('.test-shell')) return;

    if (key === 'F6') {
      event.preventDefault();
      focusRegion(event.shiftKey ? -1 : 1);
      return;
    }

    if (mod && key === '+') {
      event.preventDefault();
      click('#zoomIn');
      if (!document.querySelector('#zoomIn')) document.documentElement.style.setProperty('--zoom-scale', String(Math.min(1.25, (Number(getComputedStyle(document.documentElement).getPropertyValue('--zoom-scale')) || 1) + 0.05)));
      return;
    }

    if (mod && (key === '-' || key === '_')) {
      event.preventDefault();
      click('#zoomOut');
      if (!document.querySelector('#zoomOut')) document.documentElement.style.setProperty('--zoom-scale', String(Math.max(0.85, (Number(getComputedStyle(document.documentElement).getPropertyValue('--zoom-scale')) || 1) - 0.05)));
      return;
    }

    if (mod && key === '0') {
      event.preventDefault();
      document.documentElement.style.setProperty('--zoom-scale', '1');
      return;
    }

    const alt = event.altKey;
    if (mod && alt && lower === 'b' && !isTyping(event.target)) { event.preventDefault(); clickText('Back'); return; }
    if (mod && alt && lower === 'x' && !isTyping(event.target)) { event.preventDefault(); clickText('Next'); return; }
    if (mod && alt && lower === 'g' && !isTyping(event.target)) { event.preventDefault(); clickText('Review'); return; }
    if (mod && alt && lower === 'v' && !isTyping(event.target)) { event.preventDefault(); clickText('Mark for review'); return; }
    if (mod && alt && lower === 'c' && !isTyping(event.target)) { event.preventDefault(); click('#calcTool'); return; }
    if (mod && alt && lower === 'r' && !isTyping(event.target)) { event.preventDefault(); click('#refTool'); return; }
    if (mod && alt && lower === 'o' && !isTyping(event.target)) { event.preventDefault(); document.body.classList.toggle('option-eliminator-mode'); return; }
    if (mod && lower === 'l' && !isTyping(event.target)) { event.preventDefault(); click('#lineTool'); return; }
    if (mod && alt && lower === 't' && !isTyping(event.target)) { event.preventDefault(); click('#timerTool'); return; }
    if (mod && lower === 'h' && !isTyping(event.target)) { event.preventDefault(); click('#noteTool'); return; }

    if (mod && alt && event.shiftKey && lower === 'd' && !isTyping(event.target)) {
      event.preventDefault();
      return;
    }

    if (mod && event.shiftKey && /^[1-4]$/.test(key) && !isTyping(event.target)) {
      event.preventDefault();
      triggerOption(Number(key), 'select');
      return;
    }

    if (mod && alt && /^[1-4]$/.test(key) && !isTyping(event.target)) {
      event.preventDefault();
      triggerOption(Number(key), 'eliminate');
      return;
    }
  }

  document.addEventListener('keydown', onKeydown, true);
  new MutationObserver(() => {
    if (!document.querySelector('.test-shell')) return;
    regionNodes().forEach((node) => { if (node.tabIndex < 0) node.tabIndex = 0; });
  }).observe(document.getElementById('app'), { childList: true, subtree: true });
})();

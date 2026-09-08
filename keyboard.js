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
    ['Ctrl + Alt + V', 'Mark for Review'],
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

  const visible = (el) => !!el && el.getClientRects().length > 0;
  const buttonsByText = (label) => [...document.querySelectorAll('button')]
    .find((b) => visible(b) && b.textContent.trim().toLowerCase() === label.toLowerCase());
  const clickText = (label) => buttonsByText(label)?.click();

  function openToolsThen(label, fallback) {
    const direct = document.getElementById(label);
    if (visible(direct)) { direct.click(); return; }
    const tools = buttonsByText('Test tools');
    if (!tools) { fallback?.(); return; }
    tools.click();
    requestAnimationFrame(() => {
      const target = document.getElementById(label);
      if (visible(target)) target.click(); else fallback?.();
    });
  }

  function openToolByText(label, fallback) {
    const direct = buttonsByText(label);
    if (direct) { direct.click(); return; }
    const tools = buttonsByText('Test tools');
    if (!tools) { fallback?.(); return; }
    tools.click();
    requestAnimationFrame(() => clickText(label) || fallback?.());
  }

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
    nodes.forEach((node) => { if (node.tabIndex < 0) node.tabIndex = 0; });
    const active = document.activeElement;
    let index = nodes.indexOf(active);
    if (index < 0) index = direction > 0 ? -1 : 0;
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
    const target = mode === 'select'
      ? [...document.querySelectorAll('[data-answer]')].filter(visible)[number - 1]
      : document.querySelector(`[data-eliminate="${number - 1}"]`);
    target?.click();
  }

  function onKeydown(event) {
    const key = event.key;
    const lower = key.toLowerCase();
    const mod = event.ctrlKey || event.metaKey;
    const alt = event.altKey;

    if (key === 'Escape' && closeModal()) { event.preventDefault(); return; }
    if (key === 'F1') { event.preventDefault(); openShortcuts(); return; }
    if (!document.querySelector('.test-shell')) return;

    if (key === 'F6') { event.preventDefault(); focusRegion(event.shiftKey ? -1 : 1); return; }

    if (mod && (key === '+' || key === '=')) {
      event.preventDefault();
      document.documentElement.style.setProperty('--zoom-scale', String(Math.min(1.25, (Number(getComputedStyle(document.documentElement).getPropertyValue('--zoom-scale')) || 1) + 0.05)));
      return;
    }
    if (mod && (key === '-' || key === '_')) {
      event.preventDefault();
      document.documentElement.style.setProperty('--zoom-scale', String(Math.max(0.85, (Number(getComputedStyle(document.documentElement).getPropertyValue('--zoom-scale')) || 1) - 0.05)));
      return;
    }
    if (mod && key === '0') { event.preventDefault(); document.documentElement.style.setProperty('--zoom-scale', '1'); return; }

    if (isTyping(event.target)) return;

    if (mod && alt && lower === 'b') { event.preventDefault(); clickText('Back'); return; }
    if (mod && alt && lower === 'x') { event.preventDefault(); clickText('Next'); return; }
    if (mod && alt && lower === 'g') { event.preventDefault(); clickText('Review'); return; }
    if (mod && alt && lower === 'v') { event.preventDefault(); clickText('Mark for review'); return; }
    if (mod && alt && lower === 'c') { event.preventDefault(); openToolByText('Calculator'); return; }
    if (mod && alt && lower === 'r') { event.preventDefault(); openToolByText('Reference sheet'); return; }
    if (mod && lower === 'l') { event.preventDefault(); openToolByText('Line reader'); return; }
    if (mod && alt && lower === 't') { event.preventDefault(); openToolByText('Hide timer', () => openToolByText('Show timer')); return; }
    if (mod && lower === 'h') { event.preventDefault(); openToolByText('Note'); return; }
    if (mod && alt && lower === 'o') { event.preventDefault(); document.body.classList.toggle('option-eliminator-mode'); return; }

    if (mod && alt && event.shiftKey && lower === 'd') {
      event.preventDefault();
      openShortcuts();
      return;
    }

    if (mod && event.shiftKey && /^[1-4]$/.test(key)) {
      event.preventDefault();
      triggerOption(Number(key), 'select');
      return;
    }

    if (mod && alt && /^[1-4]$/.test(key)) {
      event.preventDefault();
      triggerOption(Number(key), 'eliminate');
    }
  }

  document.addEventListener('keydown', onKeydown, true);
  const app = document.getElementById('app');
  if (app) new MutationObserver(() => {
    if (!document.querySelector('.test-shell')) return;
    regionNodes().forEach((node) => { if (node.tabIndex < 0) node.tabIndex = 0; });
  }).observe(app, { childList: true, subtree: true });
})();

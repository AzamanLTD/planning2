(() => {
  'use strict';

  const FORMULAS = `
    <h4>Reference</h4>
    <section><strong>Circle</strong><p>Area: A = πr²</p><p>Circumference: C = 2πr</p></section>
    <section><strong>Rectangle</strong><p>Area: A = lw</p></section>
    <section><strong>Triangle</strong><p>Area: A = ½bh</p></section>
    <section><strong>Right triangle</strong><p>c² = a² + b²</p></section>
    <section><strong>Special Right Triangles</strong><p>30°–60°–90°: short leg = x, long leg = x√3, hypotenuse = 2x</p><p>45°–45°–90°: legs = s, hypotenuse = s√2</p></section>
    <section><strong>Rectangular prism</strong><p>V = lwh</p></section>
    <section><strong>Cylinder</strong><p>V = πr²h</p></section>
    <section><strong>Sphere</strong><p>V = 4/3πr³</p></section>
    <section><strong>Cone</strong><p>V = 1/3πr²h</p></section>
    <section><strong>Pyramid</strong><p>V = 1/3lwh</p></section>
    <section><p>Circle arc: 360° = 2π radians</p><p>Triangle angle sum: 180°</p></section>`;

  function visible(el) { return !!el && el.getClientRects().length > 0; }

  function closeOnEscape(event) {
    if (event.key !== 'Escape') return;
    const panel = document.querySelector('#calculatorPanel, #referencePanel');
    if (!panel) return;
    panel.querySelector('.panel-head .icon-btn')?.click();
    event.preventDefault();
  }

  function makeDraggable(panel) {
    if (panel.dataset.dragReady === '1') return;
    const head = panel.querySelector('.panel-head');
    if (!head) return;
    panel.dataset.dragReady = '1';
    head.style.cursor = 'move';
    let drag = null;
    head.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      const rect = panel.getBoundingClientRect();
      drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
      head.setPointerCapture?.(event.pointerId);
    });
    head.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const left = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, drag.left + event.clientX - drag.x));
      const top = Math.max(8, Math.min(window.innerHeight - panel.offsetHeight - 8, drag.top + event.clientY - drag.y));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = 'auto';
    });
    head.addEventListener('pointerup', () => { drag = null; });
    head.addEventListener('pointercancel', () => { drag = null; });
  }

  function makeResizable(panel) {
    if (panel.dataset.resizeReady === '1') return;
    panel.dataset.resizeReady = '1';
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'resize-handle';
    handle.setAttribute('aria-label', 'Resize calculator');
    handle.setAttribute('title', 'Drag to resize');
    handle.textContent = '↘';
    panel.appendChild(handle);
    let drag = null;
    handle.addEventListener('pointerdown', (event) => {
      const rect = panel.getBoundingClientRect();
      drag = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener('pointermove', (event) => {
      if (!drag) return;
      panel.style.width = `${Math.max(280, Math.min(720, drag.width + event.clientX - drag.x))}px`;
      panel.style.maxHeight = `${Math.max(260, Math.min(window.innerHeight - 24, drag.height + event.clientY - drag.y))}px`;
    });
    handle.addEventListener('pointerup', () => { drag = null; });
    handle.addEventListener('pointercancel', () => { drag = null; });
  }

  function wrapHighlightInTextNode(node, text) {
    if (!text || !node.nodeValue) return false;
    const source = node.nodeValue;
    const start = source.indexOf(text);
    if (start < 0) return false;
    const end = start + text.length;
    const before = source.slice(0, start);
    const after = source.slice(end);
    const mark = document.createElement('mark');
    mark.className = 'azm-saved-highlight';
    mark.textContent = text;
    const parent = node.parentNode;
    if (!parent) return false;
    if (before) parent.insertBefore(document.createTextNode(before), node);
    parent.insertBefore(mark, node);
    if (after) parent.insertBefore(document.createTextNode(after), node);
    parent.removeChild(node);
    return true;
  }

  function restoreSavedHighlights() {
    document.querySelectorAll('.source-panel .passage').forEach((passage) => {
      if (passage.dataset.highlightsRestored === '1') return;
      const saved = [...document.querySelectorAll('.annotation-list span')]
        .map((el) => el.textContent.replace(/^“|”$/g, '').trim())
        .filter(Boolean);
      if (!saved.length) {
        passage.dataset.highlightsRestored = '1';
        return;
      }
      const walker = document.createTreeWalker(passage, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);
      for (const text of saved) {
        for (const candidate of nodes) {
          if (candidate.parentElement?.closest('mark')) continue;
          if (wrapHighlightInTextNode(candidate, text)) break;
        }
      }
      passage.dataset.highlightsRestored = '1';
    });
  }

  function enhance(panel) {
    if (!visible(panel)) return;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    if (panel.id === 'referencePanel' && panel.dataset.referenceReady !== '1') {
      const head = panel.querySelector('.panel-head');
      panel.dataset.dragReady = '0';
      panel.innerHTML = `${head?.outerHTML || ''}${FORMULAS}`;
      panel.setAttribute('aria-labelledby', 'referencePanelTitle');
      const title = panel.querySelector('.panel-head b');
      if (title) {
        title.id = 'referencePanelTitle';
        title.textContent = 'Reference sheet';
      }
      const close = panel.querySelector('#closeRef');
      close?.setAttribute('aria-label', 'Close reference sheet');
      close?.addEventListener('click', () => panel.remove());
      panel.dataset.referenceReady = '1';
      makeDraggable(panel);
      close?.focus();
      return;
    }

    makeDraggable(panel);
    if (panel.id === 'calculatorPanel') {
      panel.setAttribute('aria-labelledby', 'calculatorPanelTitle');
      const title = panel.querySelector('.panel-head b');
      if (title) title.id = 'calculatorPanelTitle';
      const close = panel.querySelector('#closeCalc');
      close?.setAttribute('aria-label', 'Close calculator');
      makeResizable(panel);
      if (panel.dataset.focusReady !== '1') {
        panel.dataset.focusReady = '1';
        panel.querySelector('#calcDisplay')?.focus();
      }
    }
  }

  document.addEventListener('keydown', closeOnEscape, true);

  const observer = new MutationObserver(() => {
    enhance(document.getElementById('calculatorPanel'));
    enhance(document.getElementById('referencePanel'));
    restoreSavedHighlights();
  });

  const app = document.getElementById('app');
  if (app) observer.observe(document.body, { childList: true, subtree: true });
})();

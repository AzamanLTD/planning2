(() => {
  'use strict';

  const FORMULAS = `
    <h4>Reference</h4>
    <section><strong>Circle</strong><p>Area: A = πr²</p><p>Circumference: C = 2πr</p></section>
    <section><strong>Rectangle</strong><p>Area: A = lw</p></section>
    <section><strong>Triangle</strong><p>Area: A = ½bh</p></section>
    <section><strong>Right triangle</strong><p>c² = a² + b²</p></section>
    <section><strong>Special right triangles</strong><p>30°–60°–90°: x, x√3, 2x</p><p>45°–45°–90°: s, s, s√2</p></section>
    <section><strong>Rectangular prism</strong><p>V = lwh</p></section>
    <section><strong>Cylinder</strong><p>V = πr²h</p></section>
    <section><strong>Sphere</strong><p>V = 4/3πr³</p></section>
    <section><strong>Cone</strong><p>V = 1/3πr²h</p></section>
    <section><strong>Pyramid</strong><p>V = 1/3lwh</p></section>
    <section><p>Circle arc: 360° = 2π radians</p><p>Triangle angle sum: 180°</p></section>`;

  function visible(el) { return !!el && el.getClientRects().length > 0; }

  function makeDraggable(panel) {
    if (panel.dataset.dragReady === '1') return;
    const head = panel.querySelector('.panel-head');
    if (!head) return;
    panel.dataset.dragReady = '1';
    let drag = null;
    head.style.cursor = 'move';
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

  function enhance(panel) {
    if (!visible(panel)) return;
    makeDraggable(panel);
    if (panel.id === 'referencePanel' && panel.dataset.referenceReady !== '1') {
      const head = panel.querySelector('.panel-head');
      panel.innerHTML = `${head?.outerHTML || ''}${FORMULAS}`;
      const close = panel.querySelector('#closeRef');
      close?.addEventListener('click', () => panel.remove());
      panel.dataset.referenceReady = '1';
    }
    if (panel.id === 'calculatorPanel') makeResizable(panel);
  }

  const observer = new MutationObserver(() => {
    enhance(document.getElementById('calculatorPanel'));
    enhance(document.getElementById('referencePanel'));
  });

  const app = document.getElementById('app');
  if (app) observer.observe(document.body, { childList: true, subtree: true });
})();

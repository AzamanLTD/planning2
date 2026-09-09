(() => {
  'use strict';

  const installed = new WeakSet();

  function install(overlay) {
    if (!overlay || installed.has(overlay)) return;
    const viewport = overlay.querySelector('.azm-media-viewport');
    const image = overlay.querySelector('.azm-media-lightbox-image');
    if (!viewport || !image) return;
    installed.add(overlay);

    const pointers = new Map();
    let pinch = null;
    const clampZoom = (value) => Math.max(1, Math.min(3, value));

    viewport.addEventListener('pointerdown', (event) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      viewport.setPointerCapture?.(event.pointerId);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { distance: Math.hypot(a.x - b.x, a.y - b.y) };
      }
    }, { passive: true });

    viewport.addEventListener('pointermove', (event) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size !== 2 || !pinch) return;
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (!Number.isFinite(distance) || pinch.distance <= 0) return;
      const overlayState = overlay.__azmMediaGestureState;
      if (!overlayState) return;
      overlayState.scale = clampZoom(overlayState.scale * (distance / pinch.distance));
      pinch.distance = distance;
      overlayState.render();
      event.preventDefault();
    }, { passive: false });

    const stop = (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
    };
    viewport.addEventListener('pointerup', stop);
    viewport.addEventListener('pointercancel', stop);
  }

  const observer = new MutationObserver(() => {
    const overlay = document.getElementById('azmMediaLightbox');
    if (!overlay) return;
    const zoom = overlay.querySelector('.azm-media-zoom');
    const image = overlay.querySelector('.azm-media-lightbox-image');
    if (!zoom || !image || overlay.__azmMediaGestureState) return;
    overlay.__azmMediaGestureState = {
      get scale() { return Number.parseFloat(zoom.textContent) / 100 || 1; },
      set scale(value) { zoom.textContent = `${Math.round(value * 100)}%`; },
      render() {
        const scale = this.scale;
        image.style.transform = image.style.transform.replace(/scale\([^)]*\)/, `scale(${scale})`);
      }
    };
    install(overlay);
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

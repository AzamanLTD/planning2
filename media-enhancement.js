(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 1;

  const esc = (value) => String(value ?? '').replace(/[&<>'\"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;'
  }[c]));

  function state() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return value?.v === 3 ? value : null;
    } catch (_) { return null; }
  }

  function currentQuestion() {
    const s = state();
    const all = window.SAT_QUESTIONS;
    if (!s || !all) return null;
    const mods = [
      { id: 'rw1', bank: () => all.rw1 || [] },
      { id: 'rw2', bank: () => all.rw2?.[s.adaptive?.rw] || [] },
      { id: 'math1', bank: () => all.math1 || [] },
      { id: 'math2', bank: () => all.math2?.[s.adaptive?.math] || [] },
    ];
    const mod = mods[s.mi];
    return mod ? mod.bank()[s.qi] || null : null;
  }

  function isSafeSrc(src) {
    try {
      const url = new URL(src, location.href);
      return url.origin === location.origin && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/media/'));
    } catch (_) { return false; }
  }

  function renderMedia() {
    const card = document.querySelector('.question-card');
    const marker = document.getElementById('azm-question-media');
    if (!card) return;
    marker?.remove();
    const media = currentQuestion()?.media;
    if (!media || media.type !== 'image' || !isSafeSrc(media.src) || !media.alt) return;

    const wrap = document.createElement('figure');
    wrap.id = 'azm-question-media';
    wrap.className = 'azm-media';
    wrap.innerHTML = `<button type="button" class="azm-media-trigger" aria-label="Enlarge image: ${esc(media.alt)}"><img class="azm-media-image" src="${esc(media.src)}" alt="${esc(media.alt)}" loading="eager"><span class="azm-media-hint">Open image</span></button>${media.caption ? `<figcaption>${esc(media.caption)}</figcaption>` : ''}`;
    const prompt = document.getElementById('questionPrompt');
    const choices = card.querySelector('.choices, .spr-wrap');
    if (prompt?.parentNode === card) {
      prompt.insertAdjacentElement('afterend', wrap);
    } else if (choices) {
      card.insertBefore(wrap, choices);
    } else {
      card.appendChild(wrap);
    }
    wrap.querySelector('.azm-media-trigger').addEventListener('click', () => openLightbox(media));
  }

  function openLightbox(media) {
    document.getElementById('azmMediaLightbox')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'azmMediaLightbox';
    overlay.className = 'azm-media-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = `<div class="azm-media-dialog"><div class="azm-media-toolbar" role="toolbar" aria-label="Image controls"><button type="button" class="btn" data-media-action="zoom-out" aria-label="Zoom out">−</button><span class="azm-media-zoom" aria-live="polite">100%</span><button type="button" class="btn" data-media-action="zoom-in" aria-label="Zoom in">+</button><button type="button" class="btn" data-media-action="reset">Reset</button><button type="button" class="icon-btn" data-media-action="close" aria-label="Close image">×</button></div><div class="azm-media-viewport" tabindex="0" aria-label="Image viewport"><img class="azm-media-lightbox-image" src="${esc(media.src)}" alt="${esc(media.alt)}"></div>${media.caption ? `<p class="small azm-media-caption">${esc(media.caption)}</p>` : ''}</div>`;
    document.body.appendChild(overlay);

    const viewport = overlay.querySelector('.azm-media-viewport');
    const image = overlay.querySelector('.azm-media-lightbox-image');
    const zoomText = overlay.querySelector('.azm-media-zoom');
    const state = { scale: 1, x: 0, y: 0 };
    const render = () => {
      image.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
      zoomText.textContent = `${Math.round(state.scale * 100)}%`;
      viewport.classList.toggle('panning', state.scale > 1);
    };
    const applyZoom = (delta) => {
      state.scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(state.scale + delta).toFixed(1)));
      if (state.scale === 1) { state.x = 0; state.y = 0; }
      render();
    };

    overlay.querySelectorAll('[data-media-action]').forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.mediaAction;
      if (action === 'zoom-in') applyZoom(.25);
      else if (action === 'zoom-out') applyZoom(-.25);
      else if (action === 'reset') { state.scale = 1; state.x = 0; state.y = 0; render(); }
      else if (action === 'close') overlay.remove();
    }));

    let pan = null;
    viewport.addEventListener('pointerdown', (event) => {
      if (state.scale <= 1 || event.target !== image) return;
      pan = { x: event.clientX, y: event.clientY, ox: state.x, oy: state.y };
      viewport.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    viewport.addEventListener('pointermove', (event) => {
      if (!pan) return;
      state.x = pan.ox + event.clientX - pan.x;
      state.y = pan.oy + event.clientY - pan.y;
      render();
    });
    ['pointerup', 'pointercancel'].forEach((name) => viewport.addEventListener(name, () => { pan = null; }));

    const close = () => overlay.remove();
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === '+' || event.key === '=') { event.preventDefault(); applyZoom(.25); return; }
      if (event.key === '-') { event.preventDefault(); applyZoom(-.25); return; }
      if (event.key === '0') { event.preventDefault(); state.scale = 1; state.x = 0; state.y = 0; render(); return; }
      if (state.scale > 1 && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const step = 24;
        state.x += event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0;
        state.y += event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0;
        render();
      }
    });
    render();
    overlay.querySelector('[data-media-action="close"]').focus();
  }

  const observer = new MutationObserver(renderMedia);
  const app = document.getElementById('app');
  if (app) observer.observe(app, { childList: true, subtree: true });
  renderMedia();
})();

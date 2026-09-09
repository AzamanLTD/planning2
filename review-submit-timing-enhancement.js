(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
      return parsed && parsed.v === 3 ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function remaining(state) {
    const endAt = Number(state?.endAt);
    return Number.isFinite(endAt) ? endAt - Date.now() : 0;
  }

  function sync() {
    const modal = document.getElementById('reviewModal');
    const button = document.getElementById('submitModule');
    if (!modal || !button) return;
    const locked = remaining(readState()) > 0;
    button.disabled = locked;
    button.setAttribute('aria-disabled', String(locked));
    button.title = locked ? 'This module remains open until time expires.' : '';
    let note = modal.querySelector('#reviewTimingNote');
    if (locked) {
      if (!note) {
        note = document.createElement('p');
        note.id = 'reviewTimingNote';
        note.className = 'small';
        modal.querySelector('.modal-actions')?.before(note);
      }
      note.textContent = 'The module will finish when time expires. You can keep reviewing your answers until then.';
    } else {
      note?.remove();
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target?.id !== 'submitModule') return;
    if (remaining(readState()) <= 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    sync();
  }, true);

  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
  window.setInterval(sync, 100);
  sync();
})();

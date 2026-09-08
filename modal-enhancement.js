(() => {
  'use strict';

  const FOCUSABLE = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let previous = null;

  function activeDialog() {
    const dialogs = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')]
      .filter((el) => el.getClientRects().length > 0);
    return dialogs.at(-1) || null;
  }

  function focusFirst(dialog) {
    const items = [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    (items[0] || dialog).focus?.();
  }

  function removeOrphanedWarning() {
    if (document.querySelector('.test-shell')) return;
    document.querySelectorAll('.warning-modal').forEach((modal) => {
      modal.closest('.modal-backdrop')?.remove();
    });
  }

  document.addEventListener('click', (event) => {
    const dialog = activeDialog();
    if (!dialog || dialog.contains(event.target)) return;
    if (event.target.closest('.modal-backdrop') && dialog.closest('.modal-backdrop')) {
      event.preventDefault();
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    const dialog = activeDialog();
    if (!dialog || event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);

  const observer = new MutationObserver(() => {
    removeOrphanedWarning();
    const dialog = activeDialog();
    if (!dialog) {
      if (previous && previous.isConnected) previous.focus?.();
      previous = null;
      return;
    }
    if (dialog !== previous) {
      previous = document.activeElement && document.activeElement !== document.body ? document.activeElement : previous;
      requestAnimationFrame(() => {
        if (!dialog.contains(document.activeElement)) focusFirst(dialog);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  removeOrphanedWarning();
})();

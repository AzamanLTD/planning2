(() => {
  'use strict';
  // Runtime sentinel: keeps the fidelity layer idempotent and records its build marker.
  // No network access is used.
  window.AZAMAN_FIDELITY = { version: '2026-09-11-r1', offline: true };
})();

(() => {
  'use strict';

  function normalizeFraction(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw.includes('/')) return null;
    if (!/^\d+\/\d+$/.test(raw)) return null;
    const [n, d] = raw.split('/').map(Number);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
    return String(Number((n / d).toPrecision(12)));
  }

  function normalizeDecimal(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw) return '';
    if (!/^\d+(?:\.\d+)?$/.test(raw)) return null;
    return String(Number(Number(raw).toPrecision(12)));
  }

  function normalize(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw) return '';
    if (raw.includes('/')) return normalizeFraction(raw);
    return normalizeDecimal(raw);
  }

  document.addEventListener('input', (event) => {
    const field = event.target;
    if (!field?.matches('.spr-input')) return;
    const normalized = normalize(field.value);
    if (normalized === null) {
      field.setCustomValidity('Enter a nonnegative integer, decimal, or fraction such as 3/4.');
      return;
    }
    field.setCustomValidity('');
    if (normalized !== field.value.trim()) {
      field.value = normalized;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, true);
})();

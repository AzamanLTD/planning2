(() => {
  'use strict';

  const MAX_POSITIVE_CHARS = 5;
  const MAX_NEGATIVE_CHARS = 6;
  const VALIDITY_MESSAGE = 'Enter an integer, decimal, or fraction; omit symbols such as % or $.';

  function normalizeFraction(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw.includes('/')) return null;
    if (!/^-?\d+\/\d+$/.test(raw)) return null;
    const [n, d] = raw.split('/').map(Number);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
    const out = n / d;
    if (!Number.isFinite(out)) return null;
    return String(Number(out.toPrecision(12)));
  }

  function normalizeDecimal(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw) return '';
    if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) return null;
    const number = Number(raw);
    if (!Number.isFinite(number)) return null;
    return String(Number(number.toPrecision(12)));
  }

  function normalize(value) {
    const raw = String(value || '').trim().replace(/\s+/g, '');
    if (!raw) return '';
    if (raw.includes('/')) return normalizeFraction(raw);
    return normalizeDecimal(raw);
  }

  function applyLengthLimit(field) {
    const max = field.value.startsWith('-') ? MAX_NEGATIVE_CHARS : MAX_POSITIVE_CHARS;
    if (field.value.length > max) field.value = field.value.slice(0, max);
    field.maxLength = max;
  }

  function handleField(field, commit) {
    if (!field?.matches('.spr-input')) return;
    applyLengthLimit(field);
    const normalized = normalize(field.value);
    if (normalized === null) {
      field.setCustomValidity(VALIDITY_MESSAGE);
      return;
    }
    field.setCustomValidity('');
    if (commit && normalized !== field.value.trim()) {
      field.value = normalized;
      applyLengthLimit(field);
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  document.addEventListener('input', (event) => handleField(event.target, false), true);
  document.addEventListener('blur', (event) => handleField(event.target, true), true);
})();

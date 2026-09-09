(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';
  const ROOM_CODE_LENGTH = 5;

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { return null; }
  }

  function configure() {
    const input = document.getElementById('room');
    const button = document.getElementById('roomBtn');
    if (!input || !button || document.querySelector('.test-shell')) return;

    input.maxLength = ROOM_CODE_LENGTH;
    input.autocomplete = 'off';
    input.inputMode = 'text';
    input.pattern = '[A-Za-z]{5}';
    input.placeholder = 'AZMPR';
    input.setAttribute('aria-describedby', 'roomCodeHint');

    if (!document.getElementById('roomCodeHint')) {
      const hint = document.createElement('span');
      hint.id = 'roomCodeHint';
      hint.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      hint.textContent = 'Enter the 5-letter practice room code.';
      input.insertAdjacentElement('afterend', hint);
    }

    if (input.dataset.roomCodeEnhancer === '1') return;
    input.dataset.roomCodeEnhancer = '1';
    input.addEventListener('input', () => {
      const normalized = input.value.replace(/[^A-Za-z]/g, '').slice(0, ROOM_CODE_LENGTH).toUpperCase();
      if (input.value !== normalized) input.value = normalized;
      input.setCustomValidity(normalized.length === ROOM_CODE_LENGTH ? '' : 'Enter the 5-letter room code.');
    });

    button.addEventListener('click', (event) => {
      const code = input.value.trim().toUpperCase();
      if (!/^[A-Z]{5}$/.test(code)) return;
      const state = readState();
      if (!state || state.v !== 3 || state.screen !== 'room') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      state.roomCode = code;
      state.startCode = '';
      state.screen = 'startcode';
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { return; }
      location.reload();
    }, true);
  }

  const observer = new MutationObserver(configure);
  observer.observe(document.body, { childList: true, subtree: true });
  configure();
})();

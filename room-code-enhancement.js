(() => {
  'use strict';

  const INTERNAL_ROOM_CODE = 'AZM24';
  const PRACTICE_ROOM_CODE = 'AZMPR';
  const ROOM_CODE_LENGTH = 5;

  function configure() {
    const input = document.getElementById('room');
    const button = document.getElementById('roomBtn');
    if (!input || !button || document.querySelector('.test-shell')) return;

    input.maxLength = ROOM_CODE_LENGTH;
    input.autocomplete = 'off';
    input.inputMode = 'text';
    input.pattern = '[A-Za-z]{5}';
    input.placeholder = PRACTICE_ROOM_CODE;
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

    let bridging = false;
    button.addEventListener('click', (event) => {
      if (bridging || input.value.trim().toUpperCase() !== PRACTICE_ROOM_CODE) return;
      bridging = true;
      input.value = INTERNAL_ROOM_CODE;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      bridging = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  const observer = new MutationObserver(configure);
  observer.observe(document.body, { childList: true, subtree: true });
  configure();
})();

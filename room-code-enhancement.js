(() => {
  'use strict';

  const INTERNAL_ROOM_CODE = 'AZM24';
  const PRACTICE_ROOM_CODE = 'AZMPR';
  const ROOM_CODE_LENGTH = 5;

  function configure() {
    const boxes = [...document.querySelectorAll('.room-digit')];
    if (boxes.length !== ROOM_CODE_LENGTH || document.querySelector('.test-shell')) return;
    if (boxes.some((box) => box.dataset.roomReady === '1')) return;

    if (!document.getElementById('roomCodeHint')) {
      const hint = document.createElement('span');
      hint.id = 'roomCodeHint';
      hint.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      hint.textContent = 'Enter the five-letter room code. The room code contains letters only.';
      document.body.append(hint);
    }

    boxes.forEach((box) => {
      box.dataset.roomReady = '1';
      box.maxLength = 1;
      box.autocomplete = 'off';
      box.inputMode = 'text';
      box.setAttribute('pattern', '[A-Za-z]');
      box.setAttribute('aria-describedby', 'roomCodeHint');
    });
  }

  const observer = new MutationObserver(configure);
  observer.observe(document.body, { childList: true, subtree: true });
  configure();
})();

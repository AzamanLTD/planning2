(() => {
  'use strict';

  function closeMenu() {
    document.getElementById('toolPopover')?.remove();
  }

  function openBreak() {
    closeMenu();
    if (document.getElementById('unscheduledBreakModal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'unscheduledBreakModal';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="unscheduledBreakTitle"><div class="modal-head"><h3 id="unscheduledBreakTitle">Unscheduled break</h3><button type="button" class="icon-btn" id="closeUnscheduledBreak" aria-label="End unscheduled break">×</button></div><p>You can take a quick break. The test timer will keep running while you are away.</p><p class="small">Return to the test when you are ready to continue.</p><div class="modal-actions"><button type="button" class="btn primary-action" id="returnFromUnscheduledBreak">Return to test</button></div></div>';
    document.body.appendChild(backdrop);

    const close = () => {
      backdrop.remove();
      document.getElementById('testTop')?.focus?.();
      document.getElementById('questionPrompt')?.focus?.();
    };
    backdrop.querySelector('#closeUnscheduledBreak')?.addEventListener('click', close);
    backdrop.querySelector('#returnFromUnscheduledBreak')?.addEventListener('click', close);
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    backdrop.querySelector('#returnFromUnscheduledBreak')?.focus();
  }

  function install() {
    const menu = document.getElementById('toolPopover');
    if (!menu || menu.querySelector('#unscheduledBreakTool')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'unscheduledBreakTool';
    button.className = 'tool-item';
    button.textContent = 'Unscheduled break';
    button.insertAdjacentHTML('afterbegin', (window.AZAMAN_BREAK_ICON ? window.AZAMAN_BREAK_ICON() : ''));
    button.setAttribute('aria-describedby', 'unscheduledBreakHint');
    const hint = document.createElement('span');
    hint.id = 'unscheduledBreakHint';
    hint.className = 'visually-hidden';
    hint.textContent = 'The module timer continues while you are away.';
    menu.append(button, hint);
    button.addEventListener('click', openBreak);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.getElementById('unscheduledBreakModal')?.querySelector('#closeUnscheduledBreak')?.click();
  }, true);

  const observer = new MutationObserver(install);
  observer.observe(document.body, { childList: true, subtree: true });
  install();
})();

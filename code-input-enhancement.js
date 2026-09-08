(() => {
  'use strict';

  function install() {
    const fields = [...document.querySelectorAll('.start-digit')];
    if (fields.length !== 6 || fields.some((field) => field.dataset.codeReady === '1')) return;
    fields.forEach((field, index) => {
      field.dataset.codeReady = '1';
      field.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && !field.value && fields[index - 1]) {
          event.preventDefault();
          fields[index - 1].focus();
          fields[index - 1].select();
        }
        if (event.key === 'ArrowLeft' && fields[index - 1]) {
          event.preventDefault();
          fields[index - 1].focus();
        }
        if (event.key === 'ArrowRight' && fields[index + 1]) {
          event.preventDefault();
          fields[index + 1].focus();
        }
      });
      field.addEventListener('paste', (event) => {
        const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || '';
        if (text.length < 2) return;
        event.preventDefault();
        text.split('').forEach((digit, offset) => {
          if (fields[index + offset]) fields[index + offset].value = digit;
        });
        fields[Math.min(index + text.length, fields.length - 1)].focus();
        fields[Math.min(index + text.length, fields.length - 1)].select();
        fields[0].dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  }

  const observer = new MutationObserver(install);
  observer.observe(document.body, { childList: true, subtree: true });
  install();
})();

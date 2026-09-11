(() => {
  'use strict';

  const getState = () => window.AZAMAN_APP?.getState?.();

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
  }

  function logoSvg() {
    return `<svg class="ref2-logo" viewBox="0 0 400 400" aria-hidden="true"><rect width="400" height="400" rx="88" fill="#384bbf"/><path d="M150 61 147 67 169 336 174 338 229 252 328 274 331 269 154 62Z" fill="#fff"/><path d="M315 100 244 128 278 169 317 106Z" fill="#fff"/><path d="M131 176 62 204 60 208 65 212 135 228Z" fill="#fff"/></svg>`;
  }

  function speakerSvg() {
    return `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 13h6l7-6v18l-7-6H5z" fill="currentColor"/><path d="M22 11c2 2 2 8 0 10M25 8c4 4 4 12 0 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  function bellSvg() {
    return `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M8 22h16l-2.2-3V13a5.8 5.8 0 0 0-11.6 0v6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13 25c1.8 1.8 4.2 1.8 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  function deviceButton() {
    if (!document.querySelector('.access-page') || document.getElementById('deviceTestBtn')) return;
    const button = document.createElement('button');
    button.id = 'deviceTestBtn';
    button.type = 'button';
    button.textContent = 'Test Your Device';
    button.addEventListener('click', openDeviceDialog);
    document.body.appendChild(button);
  }

  function openDeviceDialog() {
    document.getElementById('ref2DeviceDialog')?.remove();
    const items = [
      ['Device viewport', `${window.innerWidth} × ${window.innerHeight}`, window.innerWidth >= 800 && window.innerHeight >= 500],
      ['JavaScript', 'Enabled', true],
      ['Local storage', 'Available', !!window.localStorage],
      ['Touch input', navigator.maxTouchPoints > 0 ? 'Detected' : 'Not detected', true],
    ];
    const dialog = document.createElement('div');
    dialog.id = 'ref2DeviceDialog';
    dialog.className = 'modal-backdrop';
    dialog.innerHTML = `<div class="modal ref2-device-dialog" role="dialog" aria-modal="true" aria-labelledby="ref2DeviceTitle"><div class="modal-head"><h3 id="ref2DeviceTitle">Test Your Device</h3><button class="icon-btn" id="ref2DeviceClose" aria-label="Close">×</button></div><p>Check that this device is ready to run the exam interface.</p><div class="ref2-device-list">${items.map(([name,value,ok]) => `<div class="ref2-device-row"><span>${escapeHtml(name)}</span><span>${escapeHtml(value)}</span><strong>${ok ? '✓' : '!'}</strong></div>`).join('')}</div><p class="small">All checks run locally. No network connection is required for this simulator.</p><div class="modal-actions"><button class="btn cta-yellow" id="ref2DeviceDone">Done</button></div></div>`;
    document.body.appendChild(dialog);
    const close = () => dialog.remove();
    dialog.querySelector('#ref2DeviceClose').onclick = close;
    dialog.querySelector('#ref2DeviceDone').onclick = close;
    dialog.querySelector('#ref2DeviceDone').focus();
  }

  function accessBrand() {
    const page = document.querySelector('.access-page');
    if (!page || page.querySelector('.ref2-access-brand')) return;
    const brand = document.createElement('div');
    brand.className = 'ref2-access-brand';
    brand.innerHTML = `${logoSvg()}<span>Bluebook</span>`;
    page.prepend(brand);
  }

  function normalizeAccountForm() {
    const page = document.querySelector('.access-page');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const student = document.getElementById('student');
    if (!page || !email || !password || !student) return;

    const emailLabel = email.closest('.field')?.querySelector('label');
    const passwordLabel = password.closest('.field')?.querySelector('label');
    if (emailLabel) emailLabel.textContent = 'Email Address';
    if (passwordLabel) passwordLabel.textContent = 'Password';

    const syncStudent = () => {
      if (student.value.trim()) return;
      const local = email.value.trim().split('@')[0].replace(/[._-]+/g, ' ').trim();
      student.value = local || 'Student';
      student.dispatchEvent(new Event('input', { bubbles: true }));
    };
    if (email.dataset.ref2Ready !== '1') {
      email.dataset.ref2Ready = '1';
      email.addEventListener('input', syncStudent, { passive: true });
    }
    syncStudent();
  }

  function dashboardPolish() {
    const page = document.querySelector('.yourtests-page');
    if (!page) return;
    const name = page.querySelector('.test-name');
    if (name && name.textContent.trim() === 'SAT') name.textContent = 'Digital SAT';
  }

  function polishRail() {
    const rail = document.getElementById('azmA11yRail');
    if (!rail || rail.dataset.ref2Ready === '1') return;
    rail.dataset.ref2Ready = '1';
    rail.querySelector('#railVolume')?.replaceChildren();
    const volume = rail.querySelector('#railVolume');
    const bell = rail.querySelector('#railBell');
    if (volume) {
      volume.insertAdjacentHTML('beforeend', `<span class="rail-level" aria-hidden="true"></span><span class="rail-speaker">${speakerSvg()}</span>`);
      volume.setAttribute('aria-label', 'Volume');
    }
    if (bell) {
      bell.replaceChildren();
      bell.insertAdjacentHTML('beforeend', `<span class="rail-bell">${bellSvg()}</span>`);
      bell.setAttribute('aria-label', 'Notifications');
    }
  }

  function patchAssistiveTechnology() {
    const modal = document.getElementById('atModal');
    if (!modal || modal.dataset.ref2Ready === '1') return;
    modal.dataset.ref2Ready = '1';
    modal.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="atRef2Title"><div class="modal-head"><h3 id="atRef2Title">Assistive Technology</h3><button class="icon-btn" id="atRef2Close" aria-label="Close">×</button></div><div class="at-tools-bar"><button class="btn link small" id="atRef2Expand">Expand All</button><button class="btn link small" id="atRef2Collapse">Collapse All</button></div><div class="at-body"><details open><summary>Speech-to-Text</summary><div class="at-copy"><details open><summary>Chromebook Dictation</summary><div class="at-copy"><p>Chromebook provides dictation from the accessibility menu for text-entry questions.</p><ul><li>Open the floating accessibility menu and select <strong>Dictation</strong>.</li><li>For the onscreen keyboard, select <strong>Speak</strong> (microphone) when available.</li><li>The onscreen keyboard can be moved, floated, docked, and resized.</li></ul><p>Select the response field before speaking.</p></div></details><details><summary>Windows Speech</summary><div class="at-copy"><p>Use the Windows accessibility speech controls from <strong>Settings → Accessibility → Speech</strong>.</p></div></details></div></details><details><summary>Magnification</summary><div class="at-copy"><p>Use supported operating-system or application magnification tools to enlarge readable test content.</p></div></details><details><summary>Keyboard access</summary><div class="at-copy"><p>Use the exam's keyboard shortcuts and focus movement commands to reach major regions and tools without a mouse.</p></div></details></div><div class="modal-actions"><button class="btn cta-yellow" id="atRef2Done">Close</button></div></div>`;
    const close = () => modal.remove();
    modal.querySelector('#atRef2Close').onclick = close;
    modal.querySelector('#atRef2Done').onclick = close;
    modal.querySelector('#atRef2Expand').onclick = () => modal.querySelectorAll('details').forEach((d) => { d.open = true; });
    modal.querySelector('#atRef2Collapse').onclick = () => modal.querySelectorAll('details').forEach((d) => { d.open = false; });
    modal.querySelector('#atRef2Done').focus();
  }

  function moreExitIcon() {
    const button = document.getElementById('refExitExam');
    if (!button || button.dataset.ref2Ready === '1') return;
    button.dataset.ref2Ready = '1';
    button.innerHTML = `<svg class="ico-tool" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 21 20H3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9v5M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Exit the exam</span>`;
  }

  let seenRw2 = false;
  let seenMath2 = false;
  let initialized = false;

  function moduleTransitions() {
    const s = getState();
    if (!s || !s.completed) return;
    if (!initialized) {
      seenRw2 = !!s.completed.rw2;
      seenMath2 = !!s.completed.math2;
      initialized = true;
      return;
    }
    if (s.completed.rw2 && !seenRw2) {
      seenRw2 = true;
      showModuleTransition();
    }
    if (s.completed.math2 && !seenMath2) {
      seenMath2 = true;
      showModuleTransition();
    }
  }

  function showModuleTransition() {
    if (document.querySelector('.azm-module-transition')) return;
    const overlay = document.createElement('div');
    overlay.className = 'azm-module-transition';
    overlay.innerHTML = '<div class="azm-module-transition-inner"><h1>This Module Is Over</h1><p>All your work has been saved.</p><p>You’ll move on automatically in just a moment.</p><p>Do not refresh this page or quit the app.</p><div class="azm-loading-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div>';
    document.body.appendChild(overlay);
    const state = getState();
    const targetScreen = state?.screen === 'break' ? 'break' : state?.screen === 'finish' ? 'finish' : state?.screen;
    setTimeout(() => {
      overlay.remove();
      const current = getState();
      if (current && targetScreen && current.screen === targetScreen) {
        window.AZAMAN_APP?.render?.();
      }
    }, 1800);
  }

  function maintain() {
    accessBrand();
    deviceButton();
    normalizeAccountForm();
    dashboardPolish();
    polishRail();
    patchAssistiveTechnology();
    moreExitIcon();
    moduleTransitions();
  }

  const observer = new MutationObserver(maintain);
  observer.observe(document.body, { childList: true, subtree: true });
  window.setInterval(moduleTransitions, 250);
  maintain();
})();

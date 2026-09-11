(() => {
  'use strict';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'\"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;'
  }[c]));

  function patchDeviceDialog(dialog) {
    if (!dialog || dialog.dataset.finalCalibration === '1') return;
    const card = dialog.querySelector('.modal, .ref2-device-dialog');
    if (!card) return;
    dialog.dataset.finalCalibration = '1';
    card.classList.add('bb-final-device-card');
    card.innerHTML = `<h2 class="bb-final-device-title">This Device Meets the Requirements</h2><p class="bb-final-device-lead">We recommend running this check as close to test day as possible.</p><div class="ref2-device-list">${['Memory', 'Operating system', 'Disk space', 'Device lock', 'Verified mode'].map((name, i) => `<div class="bb-final-device-row" data-device-final-row="${i}"><span>${escapeHtml(name)}</span><strong aria-hidden="true">✓</strong></div>`).join('')}</div><div class="modal-actions"><button class="btn cta-yellow" id="bbFinalDeviceDone" type="button">Done</button></div>`;
    const close = () => dialog.remove();
    card.querySelector('#bbFinalDeviceDone').onclick = close;
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); }, { once: true });
  }

  const AT_ITEMS = [
    ['Assistive Technology', 'This section explains assistive technology options available for Bluebook testing.'],
    ['Text-to-Speech', 'Use supported text-to-speech settings to have test content read aloud. Bluebook supports embedded text-to-speech for eligible testing configurations.'],
    ['Speech-to-Text', '<p>Use supported dictation tools for typed responses.</p><ul><li>Chromebook Dictation can be opened from the accessibility menu.</li><li>Windows speech tools can be enabled from Accessibility settings.</li></ul>'],
    ['Screen Readers', 'Use a supported screen reader with the testing-device guidance provided for your administration.'],
    ['Zoom and Magnification', 'Use supported zoom and magnification controls to enlarge readable test content.'],
    ['MathJax', 'Math content is presented in accessible mathematical notation when supported by the testing environment.'],
    ['Link to Referenced Content', 'Referenced passages and supporting content can be opened from the links provided in the question interface.']
  ];

  function patchAssistiveTechnology(modal) {
    if (!modal || modal.dataset.finalCalibration === '1') return;
    const inner = modal.querySelector('.modal');
    if (!inner) return;
    const title = inner.querySelector('#atRef2Title, #atReferenceTitle, h3');
    if (!title || !/Assistive Technology/i.test(title.textContent || '')) return;
    modal.dataset.finalCalibration = '1';
    inner.classList.add('bb-final-at-card');
    inner.innerHTML = `<div class="modal-head"><h3 id="atFinalTitle">Assistive Technology</h3><button class="icon-btn" id="atFinalClose" aria-label="Close">×</button></div><div class="at-tools-bar"><button class="btn link small" id="atFinalExpand">Expand All</button><button class="btn link small" id="atFinalCollapse">Collapse All</button></div><div class="at-body">${AT_ITEMS.map(([name, copy], index) => `<details${index === 0 ? ' open' : ''}><summary>${escapeHtml(name)}</summary><div class="at-copy">${copy.startsWith('<') ? copy : `<p>${copy}</p>`}</div></details>`).join('')}</div><div class="modal-actions"><button class="btn cta-yellow" id="atFinalDone" type="button">Close</button></div>`;
    const close = () => modal.remove();
    inner.querySelector('#atFinalClose').onclick = close;
    inner.querySelector('#atFinalDone').onclick = close;
    inner.querySelector('#atFinalExpand').onclick = () => inner.querySelectorAll('details').forEach((d) => { d.open = true; });
    inner.querySelector('#atFinalCollapse').onclick = () => inner.querySelectorAll('details').forEach((d) => { d.open = false; });
    inner.querySelector('#atFinalDone').focus();
  }

  function scan() {
    patchDeviceDialog(document.getElementById('ref2DeviceDialog'));
    patchDeviceDialog(document.getElementById('deviceTestDialog'));
    patchAssistiveTechnology(document.getElementById('atModal'));
  }

  scan();
  const observer = new MutationObserver((records) => {
    if (records.some((record) => record.addedNodes && record.addedNodes.length)) scan();
  });
  observer.observe(document.body, { childList: true });
})();

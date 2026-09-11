(() => {
  'use strict';

  const state = () => window.AZAMAN_APP?.getState?.();
  const save = () => window.AZAMAN_APP?.save?.();
  const render = () => window.AZAMAN_APP?.render?.();
  const esc = (v) => String(v ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  let screenKey = '';

  function isActual() {
    const s = state();
    return !!s && !s.harness;
  }

  function startCodeSurface() {
    const s = state();
    if (!isActual() || s.screen !== 'checkin' || s.step !== 8) return false;
    const existing = document.getElementById('azmStartCodePage');
    if (existing) return true;

    const app = document.getElementById('app');
    if (!app) return false;
    const code = String(s.startCode || '');
    app.innerHTML = `<main id="azmStartCodePage" class="azm-start-code-page">
      <header class="azm-flow-header"><button id="azmStartHelp" type="button" class="azm-flow-link">? Help</button><button id="azmStartHome" type="button" class="azm-flow-link">Return to Home <span aria-hidden="true" class="azm-home-icon">⌂</span></button></header>
      <section class="azm-start-code-content">
        <h1>Start Code</h1>
        <p>Enter your start code now to begin testing. Good luck!</p>
        <p>The start code contains <strong>numbers only.</strong></p>
        <div class="azm-start-code-boxes" aria-label="Start code">${Array.from({length:6},(_,i)=>`<input class="azm-start-digit" maxlength="1" inputmode="numeric" autocomplete="off" data-pos="${i}" aria-label="Start code digit ${i+1} of 6" value="${esc(code[i]||'')}">`).join('')}</div>
        <button id="azmStartTest" type="button" class="azm-start-test">Start Test</button>
      </section>
      <p class="azm-start-note">You can <button id="azmReviewInstructions" type="button">review the instructions</button> that the proctor reads aloud.</p>
    </main>`;

    document.getElementById('azmStartHelp')?.addEventListener('click', () => window.AZAMAN_HELP?.() || alert('Ask your proctor for help.'));
    document.getElementById('azmStartHome')?.addEventListener('click', () => window.AZAMAN_APP?.getState && (s.screen='yourtests', save(), render()));
    document.getElementById('azmReviewInstructions')?.addEventListener('click', () => alert('Your proctor will read the test instructions aloud before the test begins.'));

    const boxes = [...document.querySelectorAll('.azm-start-digit')];
    boxes.forEach((box) => {
      box.addEventListener('input', (e) => {
        box.value = e.target.value.replace(/\D/g,'').slice(-1);
        const i = Number(box.dataset.pos);
        s.startCode = boxes.map((x) => x.value).join('');
        save();
        if (box.value && i < boxes.length - 1) boxes[i+1].focus();
      });
      box.addEventListener('keydown', (e) => {
        const i = Number(box.dataset.pos);
        if (e.key === 'Backspace' && !box.value && i > 0) { boxes[i-1].focus(); e.preventDefault(); }
      });
      box.addEventListener('focus', () => box.select());
    });
    document.getElementById('azmStartTest')?.addEventListener('click', () => {
      s.startCode = boxes.map((x) => x.value).join('');
      if (s.startCode.length !== 6) return;
      s.step = 10;
      save();
      render();
    });
    boxes.find((x) => !x.value)?.focus();
    return true;
  }

  function directionsSurface() {
    const s = state();
    if (!isActual() || s.screen !== 'directions') return false;
    const existing = document.getElementById('azmDirectionsPage');
    if (existing) return true;
    const x = window.SAT_QUESTIONS ? null : null;
    const modules = [
      {id:'rw1',section:'Reading and Writing',label:'Module 1',minutes:32,count:27},
      {id:'rw2',section:'Reading and Writing',label:'Module 2',minutes:32,count:27},
      {id:'math1',section:'Math',label:'Module 1',minutes:35,count:22},
      {id:'math2',section:'Math',label:'Module 2',minutes:35,count:22},
    ];
    const m = modules[Math.max(0, Math.min(3, Number(s.mi)||0))];
    const secNum = m.section === 'Math' ? '2' : '1';
    const math = m.section === 'Math';
    const app = document.getElementById('app');
    if (!app) return false;
    app.innerHTML = `<main id="azmDirectionsPage" class="azm-directions-page">
      <header class="azm-directions-top">
        <div class="azm-directions-left"><strong>Section ${secNum}: ${esc(m.section)}</strong><button id="azmDirectionsMenu" class="azm-directions-link">Directions <span aria-hidden="true">⌄</span></button></div>
        <div class="azm-directions-timer">${m.minutes}:00<button id="azmDirectionsHide" type="button">Hide</button></div>
        <div class="azm-directions-tools">${math?'<button type="button">▣<span>Calculator</span></button><button type="button">▤<span>Reference</span></button>':'<button type="button">✎<span>Highlights &amp; Notes</span></button>'}<button type="button">⋮<span>More</span></button></div>
      </header>
      <div class="azm-directions-stripe" aria-hidden="true"></div>
      <section class="azm-directions-panel">
        <h2>Section ${secNum}, ${esc(m.label)}: ${m.count} Questions</h2>
        <ul>
          <li>This module is made up of multiple-choice questions.</li>
          <li>You can move back and forth between questions until time expires.</li>
          <li>At the end of the module, you can review your answers until time expires.</li>
          <li>Once the next module begins, you cannot return to these questions.</li>
        </ul>
        <button id="beginModuleBtn" type="button" class="azm-directions-continue">Continue</button>
      </section>
    </main>`;
    document.getElementById('azmDirectionsHide')?.addEventListener('click', (e) => { e.currentTarget.textContent = e.currentTarget.textContent === 'Hide' ? 'Show' : 'Hide'; });
    document.getElementById('azmDirectionsMenu')?.addEventListener('click', () => alert('These directions explain how this module works.'));
    document.getElementById('beginModuleBtn')?.addEventListener('click', () => {
      const current = state();
      if (!current || current.screen !== 'directions') return;
      current.endAt = Date.now() + m.minutes * 60000;
      current.qi = 0;
      save();
      render();
    });
    return true;
  }

  function maintain() {
    const s = state();
    if (!isActual()) return;
    const key = `${s.screen}:${s.step ?? ''}:${s.mi ?? ''}`;
    if (screenKey === key && (document.getElementById('azmStartCodePage') || document.getElementById('azmDirectionsPage') || s.screen !== 'checkin')) return;
    screenKey = key;
    if (s.screen === 'checkin' && s.step === 8) startCodeSurface();
    else if (s.screen === 'directions') directionsSurface();
  }

  const observer = new MutationObserver(maintain);
  observer.observe(document.body, {childList:true, subtree:true});
  maintain();
})();

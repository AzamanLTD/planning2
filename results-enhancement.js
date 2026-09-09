(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', label: 'Reading and Writing · Module 1', source: 'rw1' },
    { id: 'rw2', label: 'Reading and Writing · Module 2', section: 'rw2' },
    { id: 'math1', label: 'Math · Module 1', source: 'math1' },
    { id: 'math2', label: 'Math · Module 2', section: 'math2' },
  ];

  function state() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; }
  }

  function bankFor(module, current) {
    if (module.section === 'rw2') return window.SAT_QUESTIONS?.rw2?.[current.adaptive?.rw || 'easy'] || [];
    if (module.section === 'math2') return window.SAT_QUESTIONS?.math2?.[current.adaptive?.math || 'easy'] || [];
    return window.SAT_QUESTIONS?.[module.source] || [];
  }

  function sameAnswer(value, expected) {
    const a = String(value ?? '').trim();
    const b = String(expected ?? '').trim();
    if (!a || !b) return false;
    const na = Number(a);
    const nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na === nb;
    return a.toLowerCase() === b.toLowerCase();
  }

  function score(module, current) {
    const bank = bankFor(module, current);
    let answered = 0;
    let correct = 0;
    bank.forEach((question, index) => {
      const value = current.answers?.[`${module.id}-${index}`];
      if (value === undefined || String(value).trim() === '') return;
      answered += 1;
      if (sameAnswer(value, question.answer)) correct += 1;
    });
    return { answered, correct, total: bank.length, accuracy: bank.length ? Math.round(correct / bank.length * 100) : 0 };
  }

  function render() {
    const heading = [...document.querySelectorAll('.kicker')].find((el) => el.textContent.trim() === 'Practice complete');
    const current = state();
    if (!heading || !current || current.v !== 3) return;
    const card = heading.closest('.card');
    if (!card || card.dataset.resultsEnhanced === '1') return;
    card.dataset.resultsEnhanced = '1';

    const rows = MODULES.map((module) => ({ ...module, result: score(module, current) }));
    const rw = rows.slice(0, 2).reduce((a, x) => ({ answered: a.answered + x.result.answered, correct: a.correct + x.result.correct, total: a.total + x.result.total }), { answered: 0, correct: 0, total: 0 });
    const math = rows.slice(2).reduce((a, x) => ({ answered: a.answered + x.result.answered, correct: a.correct + x.result.correct, total: a.total + x.result.total }), { answered: 0, correct: 0, total: 0 });

    const section = document.createElement('section');
    section.className = 'results-detail';
    section.setAttribute('aria-labelledby', 'resultsDetailTitle');
    section.innerHTML = `<h2 id="resultsDetailTitle">Practice report</h2>
      <div class="results-section-grid">
        <article class="results-section-card"><h3>Reading and Writing</h3><div class="results-big">${rw.correct}/${rw.total}</div><p>${rw.answered}/${rw.total} answered · ${rw.total ? Math.round(rw.correct / rw.total * 100) : 0}% accuracy</p></article>
        <article class="results-section-card"><h3>Math</h3><div class="results-big">${math.correct}/${math.total}</div><p>${math.answered}/${math.total} answered · ${math.total ? Math.round(math.correct / math.total * 100) : 0}% accuracy</p></article>
      </div>
      <div class="results-module-list">${rows.map((row) => `<div class="results-module-row"><span>${row.label}</span><strong>${row.result.correct}/${row.result.total}</strong><span>${row.result.accuracy}%</span></div>`).join('')}</div>
      <p class="small results-note">These are raw practice-test results only. They are not an official SAT scaled score, percentile, or College Board result.</p>`;
    const actions = card.querySelector('.btn-row');
    card.insertBefore(section, actions || null);
  }

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true });
  render();
})();

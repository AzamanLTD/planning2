(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', label: 'Reading and Writing · Module 1', source: 'rw1' },
    { id: 'rw2', label: 'Reading and Writing · Module 2', section: 'rw2' },
    { id: 'math1', label: 'Math · Module 1', source: 'math1' },
    { id: 'math2', label: 'Math · Module 2', section: 'math2' },
  ];
  const DOMAINS = {
    'Reading and Writing': ['Craft and Structure', 'Information and Ideas', 'Standard English Conventions', 'Expression of Ideas'],
    Math: ['Algebra', 'Advanced Math', 'Problem Solving and Data Analysis', 'Geometry and Trigonometry']
  };

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

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
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

  function domainAccuracy(current, modules) {
    const groups = Object.fromEntries(Object.entries(DOMAINS).map(([section, domains]) => [section, Object.fromEntries(domains.map((domain) => [domain, { answered: 0, correct: 0, total: 0 }]))]));
    modules.forEach((module) => {
      const bank = bankFor(module, current);
      bank.forEach((question, index) => {
        const bucket = groups[question.section]?.[question.domain];
        if (!bucket) return;
        bucket.total += 1;
        const value = current.answers?.[`${module.id}-${index}`];
        if (value === undefined || String(value).trim() === '') return;
        bucket.answered += 1;
        if (sameAnswer(value, question.answer)) bucket.correct += 1;
      });
    });
    return groups;
  }

  function renderDomainBreakdown(section, values) {
    return `<section class="results-domain-breakdown" aria-labelledby="${section.replace(/\W+/g, '').toLowerCase()}DomainTitle"><h3 id="${section.replace(/\W+/g, '').toLowerCase()}DomainTitle">${section} domains</h3><div class="results-domain-list">${Object.entries(values).map(([domain, result]) => {
      const percent = result.answered ? Math.round(result.correct / result.answered * 100) : 0;
      const weight = result.total ? Math.round(result.total / (section === 'Reading and Writing' ? 54 : 44) * 100) : 0;
      const detail = result.answered ? `${result.correct}/${result.answered} correct` : 'No responses';
      return `<div class="results-domain-row"><div><span class="results-domain-name">${escapeHtml(domain)}</span><span class="results-domain-weight">${weight}% of section · ${detail}</span></div><div class="results-domain-track" role="progressbar" aria-label="${escapeHtml(domain)} accuracy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="results-domain-bar" style="width:${percent}%"></div></div><span class="results-domain-score">${result.answered ? `${percent}%` : '—'}</span></div>`;
    }).join('')}</div></section>`;
  }

  function renderQuestionReview(current) {
    const items = MODULES.flatMap((module) => bankFor(module, current).map((question, index) => ({ module, question, index, value: current.answers?.[`${module.id}-${index}`] })));
    const answered = items.filter((item) => item.value !== undefined && String(item.value).trim() !== '');
    const incorrectCount = answered.filter((item) => !sameAnswer(item.value, item.question.answer)).length;
    const sectionOptions = `<option value="all">All questions (${items.length})</option><option value="Reading and Writing">Reading and Writing</option><option value="Math">Math</option><option value="incorrect">Incorrect only (${incorrectCount})</option>`;
    const rows = items.map((item, position) => {
      const value = item.value;
      const hasAnswer = value !== undefined && String(value).trim() !== '';
      const correct = hasAnswer && sameAnswer(value, item.question.answer);
      const selected = hasAnswer ? String(value) : 'No answer';
      const optionIndex = ['A', 'B', 'C', 'D'].indexOf(item.question.answer);
      const correctText = item.question.type === 'spr' ? String(item.question.answer) : `${item.question.answer}. ${item.question.options?.[optionIndex] ?? item.question.answer}`;
      return `<article class="results-review-item ${correct ? 'is-correct' : hasAnswer ? 'is-wrong' : ''}" data-section="${escapeHtml(item.question.section)}" data-result="${correct ? 'correct' : hasAnswer ? 'incorrect' : 'unanswered'}"><div class="results-review-meta"><span>${escapeHtml(item.module.label)} · Question ${position + 1}</span><span class="results-review-status ${correct ? 'correct' : 'wrong'}">${correct ? 'Correct' : hasAnswer ? 'Incorrect' : 'Unanswered'}</span></div><div class="results-review-prompt">${escapeHtml(item.question.prompt)}</div><div class="results-review-answer"><strong>Your answer:</strong> ${escapeHtml(selected)} <span>·</span> <strong>Correct:</strong> ${escapeHtml(correctText)}</div><details class="results-review-details"><summary>Review answer</summary><div class="results-review-explanation">${escapeHtml(item.question.explanation)}</div></details></article>`;
    }).join('');
    return `<section class="results-review" aria-labelledby="resultsReviewTitle"><div class="results-review-head"><h3 id="resultsReviewTitle">Review your answers</h3><div class="results-review-controls"><label class="visually-hidden" for="resultsReviewFilter">Filter review questions</label><select id="resultsReviewFilter" class="results-review-select">${sectionOptions}</select></div></div><div class="results-review-list" id="resultsReviewList">${rows}</div></section>`;
  }

  function bindQuestionReview(section) {
    const filter = section.querySelector('#resultsReviewFilter');
    const list = section.querySelector('#resultsReviewList');
    if (!filter || !list || filter.dataset.ready === '1') return;
    filter.dataset.ready = '1';
    filter.addEventListener('change', () => {
      const value = filter.value;
      list.querySelectorAll('.results-review-item').forEach((item) => {
        const matches = value === 'all' || (value === 'incorrect' ? item.dataset.result === 'incorrect' : item.dataset.section === value);
        item.hidden = !matches;
      });
    });
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
    const domains = domainAccuracy(current, MODULES);

    const section = document.createElement('section');
    section.className = 'results-detail';
    section.setAttribute('aria-labelledby', 'resultsDetailTitle');
    section.innerHTML = `<h2 id="resultsDetailTitle">Practice report</h2>
      <div class="results-section-grid">
        <article class="results-section-card"><h3>Reading and Writing</h3><div class="results-big">${rw.correct}/${rw.total}</div><p>${rw.answered}/${rw.total} answered · ${rw.total ? Math.round(rw.correct / rw.total * 100) : 0}% accuracy</p></article>
        <article class="results-section-card"><h3>Math</h3><div class="results-big">${math.correct}/${math.total}</div><p>${math.answered}/${math.total} answered · ${math.total ? Math.round(math.correct / math.total * 100) : 0}% accuracy</p></article>
      </div>
      <div class="results-module-list">${rows.map((row) => `<div class="results-module-row"><span>${escapeHtml(row.label)}</span><strong>${row.result.correct}/${row.result.total}</strong><span>${row.result.accuracy}%</span></div>`).join('')}</div>
      <div class="results-domain-report" aria-label="Domain performance">${renderDomainBreakdown('Reading and Writing', domains['Reading and Writing'])}${renderDomainBreakdown('Math', domains.Math)}</div>
      ${renderQuestionReview(current)}
      <p class="small results-note">These are raw practice-test results only. The domain bars are a practice accuracy view, not an official SAT scaled score, percentile, or College Board result.</p>`;
    const actions = card.querySelector('.btn-row');
    card.insertBefore(section, actions || null);
    bindQuestionReview(section.querySelector('.results-review'));
  }

  const observer = new MutationObserver(render);
  observer.observe(document.body, { childList: true, subtree: true });
  render();
})();

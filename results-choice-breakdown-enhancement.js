(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', source: 'rw1' },
    { id: 'rw2', section: 'rw2' },
    { id: 'math1', source: 'math1' },
    { id: 'math2', section: 'math2' }
  ];

  function readState() {
    try { const value = JSON.parse(localStorage.getItem(KEY) || 'null'); return value && value.v === 3 ? value : null; } catch (_) { return null; }
  }

  function bankFor(module, current) {
    if (module.section === 'rw2') return window.SAT_QUESTIONS?.rw2?.[current.adaptive?.rw || 'easy'] || [];
    if (module.section === 'math2') return window.SAT_QUESTIONS?.math2?.[current.adaptive?.math || 'easy'] || [];
    return window.SAT_QUESTIONS?.[module.source] || [];
  }

  function decorate() {
    const current = readState();
    const articles = [...document.querySelectorAll('.results-review-item')];
    if (!current || current.screen !== 'finish' || !articles.length) return;
    const questions = MODULES.flatMap((module) => bankFor(module, current).map((question, index) => ({ module, question, index })));
    articles.forEach((article, articleIndex) => {
      if (article.dataset.choiceBreakdownReady === '1') return;
      const item = questions[articleIndex];
      if (!item || item.question.type === 'spr' || !Array.isArray(item.question.options)) return;
      const selected = String(current.answers?.[`${item.module.id}-${item.index}`] || '').trim().toUpperCase();
      const correct = String(item.question.answer || '').trim().toUpperCase();
      const list = document.createElement('div');
      list.className = 'results-choice-breakdown';
      list.setAttribute('aria-label', 'Answer choice breakdown');
      item.question.options.slice(0, 4).forEach((text, optionIndex) => {
        const letter = String.fromCharCode(65 + optionIndex);
        const row = document.createElement('div');
        row.className = 'results-choice-row';
        const isSelected = selected === letter;
        const isCorrect = correct === letter;
        if (isSelected) row.classList.add('is-selected');
        if (isCorrect) row.classList.add('is-correct');
        const label = document.createElement('span');
        label.className = 'results-choice-label';
        label.textContent = letter;
        const body = document.createElement('span');
        body.className = 'results-choice-text';
        body.textContent = text;
        const status = document.createElement('span');
        status.className = 'results-choice-status';
        status.textContent = isCorrect && isSelected ? 'Correct · Your answer' : isCorrect ? 'Correct answer' : isSelected ? 'Your answer' : '';
        status.setAttribute('aria-hidden', status.textContent ? 'false' : 'true');
        row.append(label, body, status);
        list.appendChild(row);
      });
      const details = article.querySelector('.results-review-details');
      if (details) details.before(list); else article.appendChild(list);
      article.dataset.choiceBreakdownReady = '1';
    });
  }

  const observer = new MutationObserver(decorate);
  observer.observe(document.body, { childList: true, subtree: true });
  decorate();
})();

(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', label: 'Reading and Writing · Module 1', source: 'rw1' },
    { id: 'rw2', label: 'Reading and Writing · Module 2', section: 'rw2' },
    { id: 'math1', label: 'Math · Module 1', source: 'math1' },
    { id: 'math2', label: 'Math · Module 2', section: 'math2' }
  ];
  const DOMAINS = {
    'Reading and Writing': ['Craft and Structure', 'Information and Ideas', 'Standard English Conventions', 'Expression of Ideas'],
    Math: ['Algebra', 'Advanced Math', 'Problem Solving and Data Analysis', 'Geometry and Trigonometry']
  };

  function readState() {
    try { const value = JSON.parse(localStorage.getItem(KEY) || 'null'); return value && value.v === 3 ? value : null; } catch (_) { return null; }
  }
  function bankFor(module, current) {
    if (module.section === 'rw2') return window.SAT_QUESTIONS?.rw2?.[current.adaptive?.rw || 'easy'] || [];
    if (module.section === 'math2') return window.SAT_QUESTIONS?.math2?.[current.adaptive?.math || 'easy'] || [];
    return window.SAT_QUESTIONS?.[module.source] || [];
  }
  function numericAnswer(value) {
    const raw = String(value ?? '').trim().replace(/\s+/g, '');
    if (/^-?\d+\/\d+$/.test(raw)) { const [n, d] = raw.split('/').map(Number); return d && Number.isFinite(n) && Number.isFinite(d) ? n / d : null; }
    if (/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) return Number(raw);
    return null;
  }
  function equivalent(left, right) {
    const a = String(left ?? '').trim().toLowerCase(), b = String(right ?? '').trim().toLowerCase();
    if (!a || !b) return false;
    if (a === b) return true;
    const an = numericAnswer(a), bn = numericAnswer(b);
    return an !== null && bn !== null && Math.abs(an - bn) <= 1e-9;
  }
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function score(module, current) {
    const bank = bankFor(module, current); let answered = 0, correct = 0;
    bank.forEach((question, index) => { const answer = current.answers?.[`${module.id}-${index}`]; if (answer === undefined || String(answer).trim() === '') return; answered += 1; if (equivalent(answer, question.answer)) correct += 1; });
    return { total: bank.length, answered, correct, accuracy: bank.length ? Math.round(correct / bank.length * 100) : 0 };
  }
  function domainRows(current) {
    const data = Object.fromEntries(Object.entries(DOMAINS).map(([section, domains]) => [section, Object.fromEntries(domains.map((domain) => [domain, { total: 0, answered: 0, correct: 0 }]))]));
    MODULES.forEach((module) => bankFor(module, current).forEach((question, index) => {
      const bucket = data[question.section]?.[question.domain]; if (!bucket) return; bucket.total += 1;
      const answer = current.answers?.[`${module.id}-${index}`]; if (answer === undefined || String(answer).trim() === '') return;
      bucket.answered += 1; if (equivalent(answer, question.answer)) bucket.correct += 1;
    }));
    return data;
  }
  function domainTable(section, data) {
    const rows = Object.entries(data).map(([domain, result]) => { const pct = result.answered ? Math.round(result.correct / result.answered * 100) : 0; return `<tr><td>${esc(domain)}</td><td>${result.correct}/${result.answered}</td><td>${result.total}</td><td>${result.answered ? `${pct}%` : '—'}</td></tr>`; }).join('');
    return `<h3>${esc(section)} domains</h3><table><thead><tr><th>Domain</th><th>Correct</th><th>Total</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function reviewTable(current) {
    const rows = MODULES.flatMap((module) => bankFor(module, current).map((question, index) => {
      const answer = current.answers?.[`${module.id}-${index}`];
      const hasAnswer = answer !== undefined && String(answer).trim() !== '';
      const correct = hasAnswer && equivalent(answer, question.answer);
      const status = correct ? 'Correct' : hasAnswer ? 'Incorrect' : 'Unanswered';
      const optionIndex = ['A', 'B', 'C', 'D'].indexOf(question.answer);
      const correctAnswer = question.type === 'spr' ? String(question.answer) : `${question.answer}. ${question.options?.[optionIndex] ?? question.answer}`;
      const choices = question.type === 'spr'
        ? `Enter your answer (e.g. ${esc(String(question.answer))})`
        : (question.options?.slice(0, 4) || []).map((text, i) => `${String.fromCharCode(65 + i)}. ${text}`).join('<br>');
      return `<tr><td>${esc(module.label)} · Q${index + 1}</td><td>${esc(status)}</td><td>${esc(hasAnswer ? answer : 'No answer')}</td><td>${esc(choices)}</td><td>${esc(correctAnswer)}</td><td>${esc(question.explanation)}</td></tr>`;
    })).join('');
    return `<h2>Question review</h2><p class="meta">Every question from your completed test is included below.</p><table><thead><tr><th>Question</th><th>Result</th><th>Your answer</th><th>Choices</th><th>Correct answer</th><th>Explanation</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function buildReport(current) {
    const results = MODULES.map((module) => ({ ...module, result: score(module, current) }));
    const correct = results.reduce((sum, row) => sum + row.result.correct, 0);
    const answered = results.reduce((sum, row) => sum + row.result.answered, 0);
    const total = results.reduce((sum, row) => sum + row.result.total, 0);
    const rows = results.map((row) => `<tr><td>${esc(row.label)}</td><td>${row.result.correct}/${row.result.total}</td><td>${row.result.answered}/${row.result.total}</td><td>${row.result.accuracy}%</td></tr>`).join('');
    const domains = domainRows(current);
    const title = `Azaman SAT Results Report · ${new Date().toLocaleDateString()}`;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:1100px;margin:40px auto;padding:0 20px;line-height:1.45;color:#111}h1{margin-bottom:4px}.meta{color:#555}.summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px 0}.summary div{border:1px solid #ccc;padding:14px;border-radius:6px}.summary strong{font-size:1.35rem}table{width:100%;border-collapse:collapse;margin:12px 0 24px}th,td{border:1px solid #ccc;padding:8px;text-align:left;vertical-align:top}th{background:#f4f4f4}.print{margin-top:22px}td:last-child{min-width:260px}@media(max-width:620px){.summary{grid-template-columns:1fr 1fr}body{margin:20px auto;padding:0 10px}table{font-size:.78rem}}@media print{.print{display:none}body{margin:10mm auto}}</style></head><body><h1>Your results</h1><p class="meta">Student: ${esc(current.student || 'Student')} · Generated ${esc(new Date().toLocaleString())}</p><div class="summary"><div><strong>${correct}</strong><br>Correct</div><div><strong>${answered}</strong><br>Answered</div><div><strong>${total ? Math.round(correct / total * 100) : 0}%</strong><br>Accuracy</div></div><h2>Module performance</h2><table><thead><tr><th>Module</th><th>Correct</th><th>Answered</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table><h2>Domain performance</h2>${domainTable('Reading and Writing', domains['Reading and Writing'])}${domainTable('Math', domains.Math)}${reviewTable(current)}<p class="meta">This is an Azaman results report using raw accuracy. It is not an official SAT scaled score, percentile, or College Board score report.</p><p class="print"><button onclick="window.print()">Print / Save as PDF</button></p></body></html>`;
  }
  function download() {
    const current = readState(); if (!current || current.screen !== 'finish') return;
    const html = buildReport(current); const blob = new Blob([html], { type: 'text/html;charset=utf-8' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); const name = String(current.student || 'student').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'student';
    link.href = url; link.download = `azaman-sat-report-${name}.html`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function install() {
    const heading = [...document.querySelectorAll('.kicker')].find((el) => el.textContent.trim() === 'Test complete');
    if (!heading) return;
    const card = heading.closest('.card'); if (!card || card.querySelector('#downloadPracticeReport')) return;
    const button = document.createElement('button'); button.id = 'downloadPracticeReport'; button.type = 'button'; button.className = 'btn'; button.textContent = 'Download results report'; button.addEventListener('click', download);
    (card.querySelector('.btn-row') || card).prepend(button);
  }
  const observer = new MutationObserver(install); observer.observe(document.body, { childList: true, subtree: true }); install();
})();

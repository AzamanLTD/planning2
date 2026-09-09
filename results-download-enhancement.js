(() => {
  'use strict';

  const KEY = 'azaman-sat-practice-v3';
  const MODULES = [
    { id: 'rw1', label: 'Reading and Writing · Module 1', source: 'rw1' },
    { id: 'rw2', label: 'Reading and Writing · Module 2', section: 'rw2' },
    { id: 'math1', label: 'Math · Module 1', source: 'math1' },
    { id: 'math2', label: 'Math · Module 2', section: 'math2' }
  ];

  function readState() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      return value && value.v === 3 ? value : null;
    } catch (_) {
      return null;
    }
  }

  function bankFor(module, current) {
    if (module.section === 'rw2') return window.SAT_QUESTIONS?.rw2?.[current.adaptive?.rw || 'easy'] || [];
    if (module.section === 'math2') return window.SAT_QUESTIONS?.math2?.[current.adaptive?.math || 'easy'] || [];
    return window.SAT_QUESTIONS?.[module.source] || [];
  }

  function numericAnswer(value) {
    const raw = String(value ?? '').trim().replace(/\s+/g, '');
    if (/^-?\d+\/\d+$/.test(raw)) {
      const [n, d] = raw.split('/').map(Number);
      return d && Number.isFinite(n) && Number.isFinite(d) ? n / d : null;
    }
    if (/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)) return Number(raw);
    return null;
  }

  function equivalent(left, right) {
    const a = String(left ?? '').trim().toLowerCase();
    const b = String(right ?? '').trim().toLowerCase();
    if (!a || !b) return false;
    if (a === b) return true;
    const an = numericAnswer(a);
    const bn = numericAnswer(b);
    return an !== null && bn !== null && Math.abs(an - bn) <= 1e-9;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function buildReport(current) {
    let correct = 0;
    let answered = 0;
    let total = 0;
    const modules = MODULES.map((module) => {
      const bank = bankFor(module, current);
      let moduleCorrect = 0;
      let moduleAnswered = 0;
      bank.forEach((question, index) => {
        const answer = current.answers?.[`${module.id}-${index}`];
        if (answer === undefined || String(answer).trim() === '') return;
        moduleAnswered += 1;
        if (equivalent(answer, question.answer)) moduleCorrect += 1;
      });
      correct += moduleCorrect;
      answered += moduleAnswered;
      total += bank.length;
      return { ...module, total: bank.length, answered: moduleAnswered, correct: moduleCorrect };
    });

    const rows = modules.map((module) => `<tr><td>${esc(module.label)}</td><td>${module.correct}/${module.total}</td><td>${module.answered}/${module.total}</td><td>${module.total ? Math.round(module.correct / module.total * 100) : 0}%</td></tr>`).join('');
    const title = `Azaman SAT Practice Report · ${new Date().toLocaleDateString()}`;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:920px;margin:40px auto;padding:0 20px;line-height:1.45;color:#111}h1{margin-bottom:4px}.meta{color:#555}.summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px 0}.summary div{border:1px solid #ccc;padding:14px;border-radius:6px}.summary strong{font-size:1.35rem}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ccc;padding:9px;text-align:left}th{background:#f4f4f4}.print{margin-top:22px}@media(max-width:620px){.summary{grid-template-columns:1fr 1fr}}@media print{.print{display:none}body{margin:10mm auto}}</style></head><body><h1>Practice score report</h1><p class="meta">Student: ${esc(current.student || 'Student')} · Generated ${esc(new Date().toLocaleString())}</p><div class="summary"><div><strong>${correct}</strong><br>Correct</div><div><strong>${answered}</strong><br>Answered</div><div><strong>${total ? Math.round(correct / total * 100) : 0}%</strong><br>Accuracy</div></div><h2>Module performance</h2><table><thead><tr><th>Module</th><th>Correct</th><th>Answered</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table><p class="meta">This is an Azaman practice report using raw practice accuracy. It is not an official SAT scaled score, percentile, or College Board score report.</p><p class="print"><button onclick="window.print()">Print / Save as PDF</button></p></body></html>`;
  }

  function download() {
    const current = readState();
    if (!current || current.screen !== 'finish') return;
    const html = buildReport(current);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const name = String(current.student || 'student').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'student';
    link.href = url;
    link.download = `azaman-sat-practice-report-${name}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function install() {
    if (!document.querySelector('.kicker') || ![...document.querySelectorAll('.kicker')].some((el) => el.textContent.trim() === 'Practice complete')) return;
    const card = [...document.querySelectorAll('.kicker')].find((el) => el.textContent.trim() === 'Practice complete')?.closest('.card');
    if (!card || card.querySelector('#downloadPracticeReport')) return;
    const button = document.createElement('button');
    button.id = 'downloadPracticeReport';
    button.type = 'button';
    button.className = 'btn';
    button.textContent = 'Download practice report';
    button.addEventListener('click', download);
    (card.querySelector('.btn-row') || card).prepend(button);
  }

  const observer = new MutationObserver(install);
  observer.observe(document.body, { childList: true, subtree: true });
  install();
})();

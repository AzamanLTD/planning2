(() => {
  'use strict';

  // Progressive enhancement layer. It deliberately survives the app's DOM rerenders.
  const KEY = 'azaman-sat-practice-enhancements-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } };
  const save = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (_) {} };
  const data = load();

  function addToolItems() {
    const menu = document.getElementById('toolPopover');
    if (!menu || menu.dataset.enhanced) return;
    menu.dataset.enhanced = '1';
    const tools = [
      ['Highlight selection', highlightSelection],
      ['Add note', addNote],
      ['Line reader', lineReader],
      ['Option eliminator', toggleEliminator]
    ];
    tools.forEach(([label, fn]) => {
      const b = document.createElement('button'); b.className = 'tool-item'; b.textContent = label;
      b.addEventListener('click', fn); menu.appendChild(b);
    });
  }

  function toast(text) {
    let el = document.getElementById('azm-toast');
    if (!el) { el = document.createElement('div'); el.id='azm-toast'; document.body.appendChild(el); }
    el.textContent = text; el.className = 'azm-toast';
    clearTimeout(el._t); el._t = setTimeout(() => el.remove(), 1800);
  }

  function highlightSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) { toast('Select passage text first.'); return; }
    const range = sel.getRangeAt(0);
    if (!range.commonAncestorContainer.parentElement.closest('.source-panel,.question-card')) { toast('Select text in the question area.'); return; }
    const mark = document.createElement('mark'); mark.className='azm-highlight';
    try { range.surroundContents(mark); sel.removeAllRanges(); toast('Text highlighted.'); } catch (_) { toast('Highlight that text again.'); }
  }

  function addNote() {
    const id = `note-${Date.now()}`;
    const existing = data.notes || {};
    const current = Object.values(existing).find(n => n.module === document.querySelector('.test-title')?.textContent && n.question === document.querySelector('.q-meta')?.textContent);
    const text = window.prompt('Note for this question:', current?.text || '');
    if (text === null) return;
    existing[id] = { module: document.querySelector('.test-title')?.textContent || '', question: document.querySelector('.q-meta')?.textContent || '', text };
    data.notes = existing; save(data); toast('Note saved locally.');
  }

  function lineReader() {
    let line = document.getElementById('azm-line-reader');
    if (line) { line.remove(); return; }
    line = document.createElement('div'); line.id='azm-line-reader';
    line.innerHTML='<span>Line reader</span>';
    document.body.appendChild(line);
    document.addEventListener('mousemove', moveLine, {passive:true});
    toast('Move the pointer over text.');
  }
  function moveLine(e) { const line=document.getElementById('azm-line-reader'); if(line) line.style.top=`${e.clientY-14}px`; }

  function toggleEliminator() {
    document.body.classList.toggle('azm-eliminate-mode');
    document.querySelectorAll('.choice').forEach(choice => {
      if (choice.dataset.elimBound) return;
      choice.dataset.elimBound='1';
      choice.addEventListener('contextmenu', e => { e.preventDefault(); choice.classList.toggle('azm-eliminated'); toast(choice.classList.contains('azm-eliminated') ? 'Choice eliminated.' : 'Choice restored.'); });
    });
    toast('Right-click an option to eliminate or restore it.');
  }

  const style = document.createElement('style');
  style.textContent = `.azm-toast{position:fixed;left:50%;bottom:82px;transform:translateX(-50%);background:#18212a;color:#fff;padding:9px 14px;border-radius:5px;font-size:13px;z-index:100}.azm-highlight{background:#ffe58a}.azm-eliminate-mode .choice{user-select:none}.choice.azm-eliminated{opacity:.42;text-decoration:line-through}.choice.azm-eliminated .choice-letter{text-decoration:line-through}#azm-line-reader{position:fixed;left:0;right:0;height:28px;border-top:2px solid #18212a;border-bottom:2px solid #18212a;background:rgba(255,255,255,.72);pointer-events:none;z-index:90;top:40%;display:flex;align-items:center;justify-content:flex-end;padding-right:12px;font-size:10px;color:#18212a}`;
  document.head.appendChild(style);

  new MutationObserver(addToolItems).observe(document.body, {childList:true,subtree:true});
  addToolItems();
})();

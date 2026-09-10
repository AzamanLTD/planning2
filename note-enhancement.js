(() => {
  'use strict';

  const STORAGE_KEY = 'azaman-sat-practice-v3';

  function state() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) { return null; }
  }

  function questionKey() {
    const data = state();
    if (data && Number.isFinite(data.mi)) {
      const modules = ['rw1', 'rw2', 'math1', 'math2'];
      const module = modules[data.mi] || 'rw1';
      return `${module}-${Math.max(0, data.qi || 0)}`;
    }
    const title = document.querySelector('.test-title')?.textContent || '';
    const counter = document.querySelector('.test-counter')?.textContent || '';
    const module = title.includes('Reading and Writing') ? (title.includes('Module 2') ? 'rw2' : 'rw1')
      : (title.includes('Module 2') ? 'math2' : 'math1');
    const match = counter.match(/Question\s+(\d+)/i);
    const index = match ? Number(match[1]) - 1 : 0;
    return `${module}-${Math.max(0, index)}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function saveNote(text) {
    const data = state();
    if (!data || data.v !== 3) return false;
    data.notes ||= {};
    const key = questionKey();
    if (text.trim()) data.notes[key] = text.trim();
    else delete data.notes[key];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (_) { return false; }
  }

  function closeModal(modal) {
    modal?.remove();
  }

  function openEditor() {
    if (document.getElementById('azmNoteEditor')) return;
    const data = state() || {};
    const existing = data.notes?.[questionKey()] || '';
    const backdrop = document.createElement('div');
    backdrop.id = 'azmNoteEditor';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal note-editor" role="dialog" aria-modal="true" aria-labelledby="noteEditorTitle">
      <div class="modal-head"><h3 id="noteEditorTitle">Notes</h3><button class="icon-btn" id="noteEditorClose" aria-label="Close notes">×</button></div>
      <p class="small">Write a private note for this question. Your note is saved with this test.</p>
      <textarea id="noteEditorText" rows="8" maxlength="1000" aria-label="Question note" style="width:100%;resize:vertical;padding:12px;border:1px solid var(--color-border-strong);border-radius:6px;background:var(--color-surface);color:var(--color-text)">${escapeHtml(existing)}</textarea>
      <div class="modal-actions"><button class="btn" id="noteEditorCancel">Cancel</button><button class="btn primary-action" id="noteEditorSave">Save note</button></div>
    </div>`;
    document.body.appendChild(backdrop);
    const close = () => closeModal(backdrop);
    const save = () => {
      const value = backdrop.querySelector('#noteEditorText').value;
      if (!saveNote(value)) return;
      close();
      const marker = document.createElement('span');
      marker.className = 'annotation-chip';
      marker.textContent = value.trim() ? 'Note saved' : 'Note removed';
      document.querySelector('.footer-left')?.append(marker);
      setTimeout(() => marker.remove(), 1600);
    };
    backdrop.querySelector('#noteEditorClose').onclick = close;
    backdrop.querySelector('#noteEditorCancel').onclick = close;
    backdrop.querySelector('#noteEditorSave').onclick = save;
    backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
    backdrop.querySelector('#noteEditorText').focus();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('#noteTool');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openEditor();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const modal = document.getElementById('azmNoteEditor');
    if (!modal) return;
    event.preventDefault();
    closeModal(modal);
  }, true);
})();

import React, { useMemo, useState } from "react";
import { blankResponse } from "../exam/session.js";
import Calculator from "./Calculator.jsx";
import ReferenceSheet from "./ReferenceSheet.jsx";
import QuestionMenu from "./QuestionMenu.jsx";
import LineReader from "./LineReader.jsx";
import AnnotateModal from "./AnnotateModal.jsx";

const ICONS = {
  annotate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
  ),
  lineReader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" opacity="0.25" /><path d="M3 5h18M3 19h18" /></svg>
  ),
  eliminator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h13M10 18h10M4 5l6 14" /></svg>
  ),
  mark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12v18l-6-4.5L6 21z" /></svg>
  ),
  calculator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01M8 19h8" /></svg>
  ),
  reference: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5z" /><path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" /></svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
  )
};

function renderWithHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return text;
  let nodes = [{ text }];
  for (const hl of highlights) {
    const next = [];
    for (const node of nodes) {
      if (React.isValidElement(node) || !node.text.includes(hl)) { next.push(node); continue; }
      const parts = node.text.split(hl);
      parts.forEach((part, i) => {
        if (part) next.push({ text: part });
        if (i < parts.length - 1) next.push(<mark className="hl" key={`${hl}-${node.text.length}-${i}`}>{hl}</mark>);
      });
    }
    nodes = next;
  }
  return nodes.map((n, i) => (React.isValidElement(n) ? n : <React.Fragment key={i}>{n.text}</React.Fragment>));
}

export default function QuestionScreen({ session, module, questions, onRespond, onGoIndex, onGoReview }) {
  const idx = Math.min(session.questionIndex, questions.length - 1);
  const q = questions[idx];
  const resp = session.responses[q.id] || blankResponse();

  const [showCalc, setShowCalc] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAnnotate, setShowAnnotate] = useState(false);
  const [eliminateMode, setEliminateMode] = useState(false);
  const [lineReader, setLineReader] = useState(false);

  const isLast = idx === questions.length - 1;
  const answered = q.type === "mcq" ? resp.choice !== null : resp.spr !== null && resp.spr !== "";

  const toggleEliminated = (i) => {
    const set = new Set(resp.eliminated || []);
    if (set.has(i)) set.delete(i); else set.add(i);
    onRespond(q.id, (r) => ({ ...r, eliminated: [...set] }));
  };

  const qTextParts = useMemo(
    () => renderWithHighlights(q.prompt, resp.highlights),
    [q.prompt, resp.highlights]
  );

  return (
    <div>
      <div className="q-layout">
        {module.section === "rw" && (
          <div className="q-panel passage">
            <div className="q-doc">
              <h4>Passage</h4>
              {q.passageParagraphs ? (
                q.passageParagraphs.map((p, i) => (
                  <p key={i}>{renderWithHighlights(p, resp.highlights)}</p>
                ))
              ) : (
                <p>{renderWithHighlights(q.passage || "", resp.highlights)}</p>
              )}
            </div>
          </div>
        )}
        <div className={`q-panel ${module.section === "math" ? "solo" : ""}`}>
          <div className="q-body">
            <div className="q-count">Question {idx + 1} of {questions.length}</div>
            {module.section === "math" && q.promptPreamble && (
              <div style={{ marginBottom: 14 }}>{renderWithHighlights(q.promptPreamble, resp.highlights)}</div>
            )}
            <p className="q-prompt">{qTextParts}</p>

            {q.type === "mcq" && (
              <div>
                {q.choices.map((c, i) => {
                  const eliminated = (resp.eliminated || []).includes(i);
                  return (
                    <div
                      key={i}
                      className={`choice ${resp.choice === i ? "selected" : ""} ${eliminated ? "eliminated" : ""}`}
                      onClick={() => {
                        if (eliminateMode) { toggleEliminated(i); return; }
                        onRespond(q.id, (r) => ({ ...r, choice: i }));
                      }}
                      role="radio"
                      aria-checked={resp.choice === i}
                    >
                      <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                      <span className="choice-text" style={{ flex: 1 }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {q.type === "spr" && (
              <div className="spr-input">
                <input
                  inputMode="text"
                  value={resp.spr || ""}
                  placeholder="Enter answer"
                  onChange={(e) => onRespond(q.id, (r) => ({ ...r, spr: e.target.value }))}
                />
                <span className="spr-help">
                  Enter your answer. You can use a whole number, decimal, or fraction
                  (like 3/4 or 1.5).
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tools-bar">
        <div className="tools-left">
          <button className={`tool-btn ${resp.marked ? "active" : ""}`} onClick={() => onRespond(q.id, (r) => ({ ...r, marked: !r.marked }))}>
            {ICONS.mark}
            Mark
            {resp.marked && <span className="badge-dot" style={{ position: "absolute", marginTop: -30, marginLeft: 34 }} />}
          </button>
          <button className="tool-btn" onClick={() => setShowAnnotate(true)}>
            {ICONS.annotate}
            Annotate
            {(resp.note || (resp.highlights && resp.highlights.length)) ? <span className="badge-dot" style={{ position: "absolute", marginTop: -30, marginLeft: 34 }} /> : null}
          </button>
          <button className={`tool-btn ${lineReader ? "active" : ""}`} onClick={() => setLineReader(!lineReader)}>
            {ICONS.lineReader}
            Line Reader
          </button>
          <button className={`tool-btn ${eliminateMode ? "active" : ""}`} onClick={() => setEliminateMode(!eliminateMode)}>
            {ICONS.eliminator}
            Eliminator
          </button>
          {module.calculator && (
            <button className={`tool-btn ${showCalc ? "active" : ""}`} onClick={() => setShowCalc(!showCalc)}>
              {ICONS.calculator}
              Calculator
            </button>
          )}
          <button className="tool-btn" onClick={() => setShowRef(true)}>
            {ICONS.reference}
            Reference
          </button>
        </div>
        <div className="tools-right">
          <button className="tool-btn" onClick={() => setShowMenu(true)}>
            {ICONS.menu}
            Question Menu
          </button>
          <button className="bb-btn q-nav-btn" disabled={idx === 0} onClick={() => onGoIndex(idx - 1)}>Back</button>
          {isLast ? (
            <button className="bb-btn bb-btn-primary q-nav-btn" onClick={onGoReview}>Go to Review</button>
          ) : (
            <button className="bb-btn bb-btn-primary q-nav-btn" onClick={() => onGoIndex(idx + 1)}>
              Next <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </div>

      <LineReader active={lineReader} />
      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showRef && <ReferenceSheet onClose={() => setShowRef(false)} />}
      {showMenu && (
        <QuestionMenu
          questions={questions}
          responses={session.responses}
          currentIndex={idx}
          onGo={onGoIndex}
          onClose={() => setShowMenu(false)}
        />
      )}
      {showAnnotate && (
        <AnnotateModal
          response={resp}
          onSave={(data) => { onRespond(q.id, (r) => ({ ...r, ...data })); setShowAnnotate(false); }}
          onClose={() => setShowAnnotate(false)}
        />
      )}
    </div>
  );
}

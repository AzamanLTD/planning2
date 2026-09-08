import React, { useState } from "react";

// Highlights & Notes panel for the current question.
// Highlights are stored as exact text substrings; the passage renderer wraps
// every occurrence in a <mark>.
export default function AnnotateModal({ response, onSave, onClose }) {
  const [note, setNote] = useState(response.note || "");
  const [hls, setHls] = useState(response.highlights || []);
  const [newHl, setNewHl] = useState("");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Highlights &amp; Notes</h3>
        <p>
          To highlight: select the text in the passage or question with your mouse,
          then open this panel and paste or type it below. Highlights carry with the
          question until you finish the module.
        </p>
        <div>
          {hls.length === 0 && <p style={{ color: "var(--bb-ink-soft)" }}>No highlights yet.</p>}
          {hls.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, fontSize: 14 }}>
              <mark className="hl" style={{ flex: 1, overflowWrap: "anywhere" }}>{h}</mark>
              <button className="bb-btn" style={{ padding: "4px 10px" }} onClick={() => setHls(hls.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input
            style={{ flex: 1, padding: "9px 12px", fontSize: 14, border: "1px solid var(--bb-border)", borderRadius: 6 }}
            value={newHl}
            placeholder="Selected text"
            onChange={(e) => setNewHl(e.target.value)}
          />
          <button
            className="bb-btn"
            onClick={() => { if (newHl.trim() && !hls.includes(newHl.trim())) setHls([...hls, newHl.trim()]); setNewHl(""); }}
          >
            Add
          </button>
        </div>
        <div style={{ height: 18 }} />
        <h4 style={{ margin: "0 0 8px", fontSize: 15 }}>Note for this question</h4>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type your note..." />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
          <button className="bb-btn" onClick={onClose}>Cancel</button>
          <button className="bb-btn bb-btn-primary" onClick={() => onSave({ note, highlights: hls })}>Save</button>
        </div>
      </div>
    </div>
  );
}

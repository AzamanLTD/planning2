import React, { useState } from "react";
import { blankResponse } from "../exam/session.js";

export default function QuestionMenu({ questions, responses, currentIndex, onGo, onClose }) {
  return (
    <div className="nav-modal" onClick={onClose}>
      <div className="nav-card" onClick={(e) => e.stopPropagation()}>
        <h3>Question Menu</h3>
        <div className="nav-legend">
          <span><span className="legend-swatch answered"></span> Answered</span>
          <span><span className="legend-swatch"></span> Not answered</span>
          <span><span className="legend-swatch marked"></span> Marked for review</span>
          <span><span className="legend-swatch current"></span> Current question</span>
        </div>
        <div className="nav-grid">
          {questions.map((q, i) => {
            const r = responses[q.id] || blankResponse();
            const answered = q.type === "mcq" ? r.choice !== null : r.spr !== null && r.spr !== "";
            const cls = [
              "nav-cell",
              answered ? "answered" : "",
              r.marked ? "marked" : "",
              i === currentIndex ? "current" : ""
            ].join(" ");
            return (
              <button key={q.id} className={cls} onClick={() => { onGo(i); onClose(); }}>
                {i + 1}
                {r.marked && <span className="flag">&#9873;</span>}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="bb-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

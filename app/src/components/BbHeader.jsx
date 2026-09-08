import React from "react";
import { MODULE_SECONDS } from "../exam/session.js";

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function BbHeader({ phase, moduleName, timeRemaining, student, onZoom }) {
  const alert = timeRemaining !== null && timeRemaining <= 300;
  return (
    <header className="bb-header">
      <div className="bb-logo">
        <span className="bb-logo-mark" aria-hidden="true"></span>
        <span>Bluebook Practice</span>
      </div>
      <div className="bb-header-right">
        {(phase === "module" || phase === "break") && (
          <span className={`bb-timer-pill ${alert ? "alert" : ""}`} role="timer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2.5M9 2h6" />
            </svg>
            {fmt(timeRemaining)}
          </span>
        )}
        <button className="bb-btn-ghostdark bb-btn" style={{ padding: "6px 12px" }} onClick={() => onZoom(0.1)} title="Zoom in">+</button>
        <button className="bb-btn-ghostdark bb-btn" style={{ padding: "6px 12px" }} onClick={() => onZoom(-0.1)} title="Zoom out">&minus;</button>
        {student && (
          <span style={{ fontSize: 13, opacity: 0.85, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {student}
          </span>
        )}
      </div>
    </header>
  );
}

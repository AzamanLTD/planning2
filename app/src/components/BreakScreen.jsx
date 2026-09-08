import React from "react";

function fmt(sec) {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, "0")}`;
}

export default function BreakScreen({ session, onContinue }) {
  return (
    <div className="phase-wrap">
      <div className="phase-card break-card" style={{ maxWidth: 620 }}>
        <h1 className="phase-title">Break</h1>
        <p className="phase-sub">
          You finished the Reading and Writing section. Take a 10-minute break before
          the Math section starts. Stay in the room and keep your device open.
        </p>
        <div className="break-countdown">{fmt(session.timeRemaining)}</div>
        <p style={{ fontSize: 14, color: "var(--bb-ink-soft)" }}>
          The break ends automatically when the timer reaches 0:00, or select Continue
          when your proctor tells you.
        </p>
        <button className="bb-btn bb-btn-primary" onClick={onContinue} style={{ width: "100%", fontSize: 16 }}>
          Continue
        </button>
      </div>
    </div>
  );
}

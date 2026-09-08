import React from "react";

export default function Instructions({ module, questionsCount, onStart }) {
  const isMath = module.section === "math";
  return (
    <div className="phase-wrap">
      <div className="phase-card" style={{ maxWidth: 620 }}>
        <h1 className="phase-title">{module.name}</h1>
        <p className="phase-sub">Review this information before you begin.</p>
        <ul className="info-list">
          <li><span className="k">Questions</span><span>{questionsCount}</span></li>
          <li><span className="k">Time</span><span>{module.minutes} minutes</span></li>
          <li>
            <span className="k">Calculator</span>
            <span>{isMath ? "Available (built-in)" : "Not permitted in this module"}</span>
          </li>
          <li>
            <span className="k">Reference sheet</span>
            <span>{isMath ? "Available (built-in)" : "Available if needed"}</span>
          </li>
        </ul>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>
          {module.section === "rw"
            ? "Each module includes questions that ask about short passages. Read each passage and choose the best answer for each question. You may highlight text and take notes."
            : "Some questions can be answered more quickly with a calculator. An on-screen calculator is available for this module. A reference sheet of formulas is also available. Some questions ask you to enter your answer instead of selecting from choices."}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>
          Don't stop at the first module. After you submit this module, you will move
          to the next part of the test.
        </p>
        <button className="bb-btn bb-btn-primary" onClick={onStart} style={{ width: "100%", fontSize: 16 }}>
          Start Module
        </button>
      </div>
    </div>
  );
}

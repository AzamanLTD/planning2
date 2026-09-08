import React, { useState } from "react";
import { EXAM } from "../config.js";

const TOOLS_INTRO = [
  { name: "Testing Timer", desc: "Shows how much time remains. You can hide it, but it comes back with an alert at 5 minutes." },
  { name: "Calculator", desc: "Available on Math modules. Drag it anywhere on your screen." },
  { name: "Reference Sheet", desc: "Common formulas, available on every module that has math questions." },
  { name: "Highlights & Notes", desc: "Highlight part of a question or leave yourself a note." },
  { name: "Mark for Review", desc: "Flag a question you want to come back to." },
  { name: "Line Reader", desc: "Darken the screen except for the line you are reading." },
  { name: "Option Eliminator", desc: "Cross out answer choices you know are wrong. You can undo it." },
  { name: "Question Menu", desc: "See which questions you answered, skipped, or marked, and jump to any of them." },
  { name: "Zoom", desc: "Use the + and - buttons in the top bar to make text bigger or smaller." }
];

export default function Setup({ session, onReady }) {
  const [agreed, setAgreed] = useState(false);
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="phase-wrap">
      <div className="phase-card" style={{ maxWidth: 640 }}>
        <h1 className="phase-title">Exam Setup</h1>
        <p className="phase-sub">Check that this information is correct, then review the testing rules.</p>

        <ul className="info-list">
          <li><span className="k">Student</span><span>{session.studentName}</span></li>
          <li><span className="k">Test</span><span>{EXAM.title} (Full Length)</span></li>
          <li>
            <span className="k">Structure</span>
            <span>Reading and Writing: 2 modules, 32 min each</span>
          </li>
          <li>
            <span className="k">&nbsp;</span>
            <span>Math: 2 modules, 35 min each</span>
          </li>
          <li>
            <span className="k">&nbsp;</span>
            <span>10-minute break between sections</span>
          </li>
        </ul>

        {!showTools ? (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.6 }}>
              During the test you must not use any materials or devices other than the
              tools built into this app. Your work in each module must be your own.
              If you finish a module early, you can review your answers in that module,
              but you cannot return to a module after you submit it.
            </p>
            <button className="bb-btn" onClick={() => setShowTools(true)}>
              Learn about the testing tools
            </button>
            <div style={{ height: 16 }} />
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 17, margin: "4px 0 10px" }}>Testing tools you can use</h2>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.5 }}>
              {TOOLS_INTRO.map((t) => (
                <li key={t.name} style={{ marginBottom: 8 }}>
                  <strong>{t.name}:</strong> {t.desc}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="check-row">
          <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor="agree">
            I agree to the testing rules. I understand that this is a practice exam and my
            answers are stored on this device for scoring at the end of the test.
          </label>
        </div>

        <button className="bb-btn bb-btn-primary" disabled={!agreed} onClick={onReady} style={{ width: "100%", fontSize: 16 }}>
          Begin Test
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { moduleSummary, estimatedScore, isCorrect } from "../exam/session.js";
import { getModuleQuestions } from "../data/bank.js";

export default function FinishScreen({ session, onNewSession }) {
  const mods = moduleSummary(session);
  const score = estimatedScore(session);
  const allDomains = {};
  for (const m of mods) {
    for (const [dom, s] of Object.entries(m.perDomain)) {
      if (!allDomains[dom]) allDomains[dom] = { correct: 0, total: 0 };
      allDomains[dom].correct += s.correct;
      allDomains[dom].total += s.total;
    }
  }
  const durationMin = Math.max(
    1,
    Math.round((new Date(session.finishedAt) - new Date(session.startedAt)) / 60000)
  );

  // Wrong-answer review list (teaching aid; the real app never shows this,
  // it is shown here only after the test is fully submitted).
  const modDefs = [
    { key: "rw-m1", label: "R&W M1", variant: null },
    { key: "rw-m2", label: "R&W M2", variant: session.variant["rw-m2"] },
    { key: "math-m1", label: "Math M1", variant: null },
    { key: "math-m2", label: "Math M2", variant: session.variant["math-m2"] }
  ];
  const wrong = [];
  for (const md of modDefs) {
    for (const q of getModuleQuestions(md.key, md.variant)) {
      const r = session.responses[q.id];
      if (!r || !isCorrect(q, r)) {
        wrong.push({ mod: md.label, id: q.id, domain: q.domain });
      }
    }
  }

  return (
    <div className="phase-wrap" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div style={{ width: "100%", maxWidth: 980 }}>
        <h1 style={{ fontSize: 28, margin: "0 0 4px" }}>Test Complete</h1>
        <p style={{ color: "var(--bb-ink-soft)", margin: "0 0 8px" }}>
          {session.studentName} &mdash; {session.testCode} &mdash; time on test: about {durationMin} minutes
        </p>

        <div className="results-grid">
          <div className="stat-card">
            <div className="lbl">Total Score (estimated)</div>
            <div className="num">{score.total}</div>
          </div>
          <div className="stat-card">
            <div className="lbl">Reading &amp; Writing</div>
            <div className="num">{score.rw}</div>
          </div>
          <div className="stat-card">
            <div className="lbl">Math</div>
            <div className="num">{score.math}</div>
          </div>
        </div>

        <table className="domain-table">
          <thead>
            <tr><th>Section</th><th>Correct</th><th>Total</th><th>Domains covered</th></tr>
          </thead>
          <tbody>
            {mods.map((m) => (
              <tr key={m.key}>
                <td><strong>{m.label}</strong>{m.variant ? ` (${m.variant})` : ""}</td>
                <td>{m.correct}</td>
                <td>{m.total}</td>
                <td>{Object.entries(m.perDomain).map(([d, s]) => `${d} ${s.correct}/${s.total}`).join(" | ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="domain-table">
          <thead>
            <tr><th>Domain (whole test)</th><th>Correct</th><th>Total</th></tr>
          </thead>
          <tbody>
            {Object.entries(allDomains).map(([d, s]) => (
              <tr key={d}><td>{d}</td><td>{s.correct}</td><td>{s.total}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: 19, margin: "22px 0 8px" }}>Questions to review ({wrong.length})</h2>
        <table className="domain-table">
          <thead>
            <tr><th>Module</th><th>Question</th><th>Domain</th></tr>
          </thead>
          <tbody>
            {wrong.slice(0, 60).map((w) => (
              <tr key={w.mod + w.id}><td>{w.mod}</td><td>{w.id}</td><td>{w.domain}</td></tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 13, color: "var(--bb-ink-soft)" }}>
          Explanations for every question are in the question bank files under
          <code> src/data/</code>, so your teacher can walk through any of these.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
          <button className="bb-btn bb-btn-primary" onClick={onNewSession}>Start a New Session</button>
        </div>
      </div>
    </div>
  );
}

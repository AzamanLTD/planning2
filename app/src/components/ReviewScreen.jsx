import React, { useState } from "react";
import { blankResponse } from "../exam/session.js";

export default function ReviewScreen({ session, module, questions, onGoIndex, onSubmit }) {
  const [confirming, setConfirming] = useState(false);
  const answeredCount = questions.filter((q) => {
    const r = session.responses[q.id] || blankResponse();
    return q.type === "mcq" ? r.choice !== null : r.spr !== null && r.spr !== "";
  }).length;

  return (
    <div className="review-wrap">
      <h1 style={{ fontSize: 26, margin: "6px 0 4px" }}>Review</h1>
      <p style={{ color: "var(--bb-ink-soft)", fontSize: 15, margin: "0 0 22px" }}>
        {module.name} &mdash; {answeredCount} of {questions.length} answered
      </p>
      <table className="review-table">
        <thead>
          <tr>
            <th style={{ width: 90 }}>Question</th>
            <th style={{ width: 160 }}>Status</th>
            <th>Summary</th>
            <th style={{ width: 130 }}></th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => {
            const r = session.responses[q.id] || blankResponse();
            const answered = q.type === "mcq" ? r.choice !== null : r.spr !== null && r.spr !== "";
            const status = r.marked ? "Marked" : answered ? "Answered" : "Not answered";
            const summary = q.reviewSummary || (q.passage ? (q.passage.slice(0, 70) + "...") : q.prompt.slice(0, 70) + "...");
            return (
              <tr key={q.id}>
                <td><strong>{i + 1}</strong></td>
                <td className={`status-${answered ? "answered" : "unanswered"}`}>
                  {status}
                </td>
                <td style={{ color: "var(--bb-ink-soft)" }}>{summary}</td>
                <td>
                  <button className="link" onClick={() => onGoIndex(i)}>Go to question</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="review-foot">
        <button className="bb-btn" onClick={() => onGoIndex(0)}>Back to Questions</button>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--bb-ink-soft)", alignSelf: "center" }}>
            Once you submit this module, you cannot return to it.
          </span>
          <button className="bb-btn bb-btn-primary" onClick={() => setConfirming(true)}>Submit Module</button>
        </div>
      </div>

      {confirming && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Submit {module.name}?</h3>
            <p>
              You answered {answeredCount} of {questions.length} questions.
              {answeredCount < questions.length && " Unanswered questions are scored as incorrect."}
              You cannot return to this module after submitting.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="bb-btn" onClick={() => setConfirming(false)}>Keep Working</button>
              <button className="bb-btn bb-btn-primary" onClick={onSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

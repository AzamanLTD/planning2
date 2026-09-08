import React, { useState } from "react";
import { VALID_TEST_CODES } from "../config.js";

export default function SignIn({ onSignIn }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your full name as your proctor instructed."); return; }
    if (!code.trim()) { setError("Enter the test code your proctor gave you."); return; }
    if (!VALID_TEST_CODES.includes(code.trim().toUpperCase())) {
      setError("That test code is not recognized. Check with your proctor.");
      return;
    }
    onSignIn(name.trim(), code.trim().toUpperCase());
  };

  return (
    <div>
      <header className="bb-header">
        <div className="bb-logo">
          <span className="bb-logo-mark" aria-hidden="true"></span>
          <span>Bluebook Practice</span>
        </div>
      </header>
      <div className="phase-wrap">
        <form className="phase-card" onSubmit={submit}>
          <h1 className="phase-title">Sign in to your exam</h1>
          <p className="phase-sub">Enter your information exactly as your proctor instructed.</p>
          <div className="field">
            <label htmlFor="st-name">Full name</label>
            <input id="st-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </div>
          <div className="field">
            <label htmlFor="st-code">Test code</label>
            <input id="st-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Provided by your proctor" autoComplete="off" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="bb-btn bb-btn-primary" type="submit" style={{ width: "100%", fontSize: 16 }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

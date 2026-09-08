import React, { useRef, useState } from "react";
import { evaluate, fmtNum } from "../exam/calcmath.js";

const KEYS = [
  ["sin", "op"], ["cos", "op"], ["tan", "op"], ["ln", "op"], ["log", "op"],
  ["sqrt(", "op"], ["x^2", "op"], ["1/x", "op"], ["(", "op"], [")", "op"],
  ["7", ""], ["8", ""], ["9", ""], ["\u00f7", "op"], ["\u2212", "op"],
  ["4", ""], ["5", ""], ["6", ""], ["\u00d7", "op"], ["+", "op"],
  ["1", ""], ["2", ""], ["3", ""], ["\u2212", "op"], ["=", "eq"],
  ["0", ""], [".", ""], ["pi", "op"], ["Ans", "op"], ["DEL", "op"]
];

export default function Calculator({ onClose }) {
  const [expr, setExpr] = useState("");
  const [history, setHistory] = useState("");
  const [ans, setAns] = useState(0);
  const dragRef = useRef(null);

  const press = (k) => {
    if (k === "DEL") { setExpr((e) => e.slice(0, -1)); return; }
    if (k === "x^2") { setExpr((e) => e + "^2"); return; }
    if (k === "1/x") { setExpr((e) => "1/(" + e + ")"); return; }
    if (k === "=") {
      try {
        const val = evaluate(expr, ans);
        setHistory(expr + " =");
        setAns(val);
        setExpr(fmtNum(val));
      } catch {
        setHistory("");
        setExpr("Error");
      }
      return;
    }
    setExpr((e) => e + k);
  };

  // dragging
  const onTitleDown = (e) => {
    const win = dragRef.current.parentElement.getBoundingClientRect();
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.offX = win.left;
    dragRef.current.offY = win.top;
    const move = (ev) => {
      dragRef.current.parentElement.style.left = dragRef.current.offX + (ev.clientX - dragRef.current.startX) + "px";
      dragRef.current.parentElement.style.top = dragRef.current.offY + (ev.clientY - dragRef.current.startY) + "px";
      dragRef.current.parentElement.style.right = "auto";
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className="calc-window" style={{ left: "calc(100% - 380px)", top: 90 }}>
      <div className="calc-title-bar" onMouseDown={onTitleDown} ref={dragRef}>
        <span>Calculator</span>
        <button onClick={onClose} aria-label="Close calculator">&times;</button>
      </div>
      <div className="calc-display">{expr || "0"}</div>
      <div className="calc-history">{history}</div>
      <div className="calc-pad">
        {KEYS.map(([k, cls]) => (
          <button
            key={k}
            className={`calc-key ${cls === "eq" ? "eq" : cls}`}
            onClick={() => press(k)}
          >
            {k}
          </button>
        ))}
        <button className="calc-key wide" onClick={() => { setExpr(""); setHistory(""); }}>CLEAR</button>
      </div>
    </div>
  );
}

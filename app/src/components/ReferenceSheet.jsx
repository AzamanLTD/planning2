import React from "react";

// The official SAT reference sheet contents (formulas universally published
// by College Board for the digital SAT math sections).
export default function ReferenceSheet({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: "min(720px, 94vw)" }}>
        <h3>Reference Sheet</h3>
        <p>The formulas shown here are available during the test. Scroll to see all of them.</p>
        <div className="ref-cols">
          <div className="ref-block">
            <div className="ref-h">Area (A) and Circumference (C)</div>
            <div className="formula">Triangle: A = &frac12;bh</div>
            <div className="formula">Circle: A = &pi;r&sup2;&nbsp;&nbsp;&nbsp;C = 2&pi;r</div>
            <div className="ref-h">Volume (V)</div>
            <div className="formula">Rectangular prism: V = lwh</div>
            <div className="formula">Cylinder: V = &pi;r&sup2;h</div>
            <div className="formula">Sphere: V = <sup>4</sup>/<sub>3</sub>&pi;r&sup3;</div>
            <div className="formula">Cone: V = <sup>1</sup>/<sub>3</sub>&pi;r&sup2;h</div>
            <div className="formula">Pyramid: V = <sup>1</sup>/<sub>3</sub>lwh</div>
          </div>
          <div className="ref-block">
            <div className="ref-h">Right triangles</div>
            <div className="formula">c&sup2; = a&sup2; + b&sup2;</div>
            <div className="formula">
              Special right triangles: 30&deg;-60&deg;-90&deg; and 45&deg;-45&deg;-90&deg;,
              with side ratios as shown in the test.
            </div>
            <div className="ref-h">Trigonometry</div>
            <div className="formula">sin(x&deg;) = cos(90&deg; &minus; x&deg;)</div>
            <div className="formula">tan(x&deg;) = sin(x&deg;) / cos(x&deg;)</div>
            <div className="formula">Pythagorean: sin&sup2;(x&deg;) + cos&sup2;(x&deg;) = 1</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <button className="bb-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

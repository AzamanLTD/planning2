import React, { useState, useEffect } from "react";

export default function LineReader({ active }) {
  const [y, setY] = useState(200);
  useEffect(() => {
    if (!active) return;
    const move = (e) => setY(e.clientY - 26);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", (e) => setY(e.touches[0].clientY - 26));
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [active]);
  if (!active) return null;
  return (
    <div className="line-reader" aria-hidden="true">
      <div className="lr-band" style={{ top: y }}></div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return { d: Math.floor(ms / 86400000), h: Math.floor(ms / 3600000) % 24, m: Math.floor(ms / 60000) % 60 };
}

const CELLS = [["d", "Days"], ["h", "Hrs"], ["m", "Min"]];

export default function Countdown({ target }) {
  const [t, setT] = useState(null);

  useEffect(() => {
    const tick = () => setT(diff(target));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  return (
    <div className="count" aria-label="Countdown">
      {CELLS.map(([k, label]) => (
        <div key={k}>
          <b>{t ? String(t[k]).padStart(2, "0") : "--"}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

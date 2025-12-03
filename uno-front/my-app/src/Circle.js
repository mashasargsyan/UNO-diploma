import React, { useEffect, useRef } from "react";

export default function Circle({ players }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;


    const size = parent.offsetWidth;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;

    const R = size * 0.4;
    const r = size * 0.06;

    const N = Math.max(2, Math.floor(players));
    const step = (2 * Math.PI) / N;
    const myAngle = Math.PI / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "#000000ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < N; i++) {
      const angle = myAngle + step * i;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [players]);

  return (
    <div className="UnoForm">
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto" }} />
    </div>
  );
}

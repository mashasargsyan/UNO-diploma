import React, { useEffect, useRef } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function Circle() {
  const canvasRef = useRef();
  const location = useLocation();
  const { name, playersCount } = location.state 

 const players = useMemo(() => {
  return Array.from({ length: playersCount }, (_, i) => ({
    name: i === 0 ? name : `Player ${i + 1}`,
    id: i
  }));
}, [name, playersCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 600;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.35;
    const r = 25;

    const step = (2 * Math.PI) / players.length;
    const myAngle = Math.PI / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.stroke();

    players.forEach((player, i) => {
      const angle = myAngle + step * i;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.stroke();

      const labelDist = R + r + 30;
      const lx = cx + labelDist * Math.cos(angle);
      const ly = cy + labelDist * Math.sin(angle);

      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(player.name, lx, ly);
    });
  }, [players]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
      }}
    >
      <canvas ref={canvasRef} style={{ maxWidth: "90vw", maxHeight: "90vh" }} />
    </div>
  );
}

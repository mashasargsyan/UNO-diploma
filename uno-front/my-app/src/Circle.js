import React, { useEffect, useRef } from "react";

export default function Circle({ players }) {
  const canvasRef = useRef();

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
    const r = 30;

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "#1e6b3f";
    ctx.fill();
    ctx.strokeStyle = "#144a2b";
    ctx.lineWidth = 5;
    ctx.stroke();

    if (!players || players.length === 0) return;

    const step = (2 * Math.PI) / players.length;
    const startAngle = Math.PI / 2;

    players.forEach((player, i) => {
      const angle = startAngle + step * i;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);

      const img = new Image();
      img.src = player.avatar;

      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 4;
        ctx.stroke();

        const labelDist = R + r + 35;
        const lx = cx + labelDist * Math.cos(angle);
        const ly = cy + labelDist * Math.sin(angle);

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.name, lx, ly);
      };
    });
  }, [players]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "-10px"
      }}
    >
      <canvas ref={canvasRef} style={{ maxWidth: "90vw", maxHeight: "75vh" }} />
    </div>
  );
}
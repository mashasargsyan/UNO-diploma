import React, { useEffect, useRef } from "react";

export default function Circle({ players, currentPlayer, direction, topCard }) {
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

    const cardBackImg = new Image();
    cardBackImg.src = "/uno_card_back.png"; 

    cardBackImg.onload = () => {
      const cardW = 50;
      const cardH = 75;
      const pileX = cx + 45; 
      const pileY = cy - cardH / 2;

      ctx.drawImage(cardBackImg, pileX - 4, pileY - 4, cardW, cardH);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pileX - 4, pileY - 4, cardW, cardH);

      ctx.drawImage(cardBackImg, pileX, pileY, cardW, cardH);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pileX, pileY, cardW, cardH);

      if (topCard) {
        const discardW = 42; 
        const discardH = 62; 
        const discardX = cx - discardW / 2;
        const discardY = cy - discardH / 2;
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(discardX, discardY, discardW, discardH);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(discardX, discardY, discardW, discardH);

        ctx.fillStyle = "#000000";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(topCard.type, discardX + 4, discardY + 4);

        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(topCard.color, discardX + discardW - 4, discardY + discardH - 4);
      }

      if (!players || players.length === 0) return;

      const arrowRadius = R + r + 45; 
      ctx.beginPath();
      ctx.arc(cx, cy, arrowRadius, -Math.PI/2 - 0.3, -Math.PI/2 + 0.3);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      const headAngle = direction === 1 ? -Math.PI/2 + 0.3 : -Math.PI/2 - 0.3; 
      const headX = cx + arrowRadius * Math.cos(headAngle);
      const headY = cy + arrowRadius * Math.sin(headAngle);
      
      const alpha = Math.PI / 6; 
      const len = 15; 
      const lineAngle1 = headAngle - (direction * Math.PI/2) + alpha;
      const lineAngle2 = headAngle - (direction * Math.PI/2) - alpha;

      ctx.beginPath();
      ctx.moveTo(headX + len * Math.cos(lineAngle1), headY + len * Math.sin(lineAngle1));
      ctx.lineTo(headX, headY);
      ctx.lineTo(headX + len * Math.cos(lineAngle2), headY + len * Math.sin(lineAngle2));
      ctx.stroke();

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
          ctx.strokeStyle = i === currentPlayer ? "#FFFF00" : player.color;
          ctx.lineWidth = i === currentPlayer ? 6 : 4; 
          ctx.stroke();

          const labelDist = R + r + 20; 
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle);

          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "#ffffff"; 
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(player.name, lx, ly);
        };
      });
    };
  }, [players, currentPlayer, direction, topCard]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "-10px" }}>
      <canvas ref={canvasRef} style={{ maxWidth: "90vw", maxHeight: "75vh" }} />
    </div>
  );
}
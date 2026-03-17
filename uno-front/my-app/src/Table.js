import React, { useEffect, useRef } from "react";

const imageCache = {};

export default function Table({ players, currentPlayer, direction, topCard, thinkingPlayer, playerCards, onDeckClick }) {
  const canvasRef = useRef();

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const size = 600;
    const cx = size / 2;
    const cy = size / 2;
    const cardW = 70; 
    const cardH = 105; 
    const pileX = cx + 10; 
    const pileY = cy - cardH / 2;

    if (x >= pileX - 4 && x <= pileX + cardW && y >= pileY - 4 && y <= pileY + cardH) {
      if (onDeckClick) {
        onDeckClick();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 600;
    const ctx = canvas.getContext("2d");

    const loadImage = (src) => {
      return new Promise((resolve) => {
        if (imageCache[src]) {
          resolve(imageCache[src]);
          return;
        }
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imageCache[src] = img;
          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    };

    const drawBoard = async () => {
      const cardBackImg = await loadImage("/uno_card_back.png");
      
      let topImg = null;
      if (topCard) {
        const src = (topCard.type === 13 || topCard.type === 14) 
          ? `/UnoCards/${topCard.type}.gif` 
          : `/UnoCards/${topCard.color}_${topCard.type}.gif`;
        topImg = await loadImage(src);
      }

      const avatarImgs = await Promise.all(
        players.map(p => loadImage(p.avatar))
      );

      if (canvas.width !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const R = size * 0.25; 
      const r = 28; 

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#1e6b3f"; 
      ctx.fill();
      ctx.strokeStyle = "#144a2b"; 
      ctx.lineWidth = 5;
      ctx.stroke();

      const cardW = 70; 
      const cardH = 105; 
      const pileX = cx + 10; 
      const pileY = cy - cardH / 2;

      if (cardBackImg) {
        ctx.drawImage(cardBackImg, pileX - 4, pileY - 4, cardW, cardH);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pileX - 4, pileY - 4, cardW, cardH);

        ctx.drawImage(cardBackImg, pileX, pileY, cardW, cardH);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pileX, pileY, cardW, cardH);
      }

      if (topCard && topImg) {
        const discardW = 70; 
        const discardH = 105; 
        const discardX = cx - discardW - 10; 
        const discardY = cy - discardH / 2;
        
        ctx.fillStyle = "#ffffff";
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(discardX, discardY, discardW, discardH, 6);
          ctx.fill();
        } else {
          ctx.fillRect(discardX, discardY, discardW, discardH);
        }
        
        ctx.drawImage(topImg, discardX, discardY , discardW , discardH );
      }

      if (!players || players.length === 0) return;

      const arrowRadius = R + r + 105; 
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
        
        const img = avatarImgs[i];
        
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip(); 
          
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
          ctx.restore(); 
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = i === currentPlayer ? "#FFFF00" : player.color;
        ctx.lineWidth = i === currentPlayer ? 6 : 4; 
        ctx.stroke();

        const labelDist = R + r + 15; 
        const lx = cx + labelDist * Math.cos(angle);
        const ly = cy + labelDist * Math.sin(angle);

        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#ffffff"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.name, lx, ly);

        if (i !== 0 && playerCards && playerCards[i]) {
          const count = playerCards[i].length;
          const miniW = 20; 
          const miniH = 30; 
          const overlap = 10; 
          const totalW = miniW + (count - 1) * overlap;

          const cardDist = R + r + 35; 
          const cX = cx + cardDist * Math.cos(angle);
          const cY = cy + cardDist * Math.sin(angle);

          const alignX = (Math.cos(angle) + 1) / 2; 
          const alignY = (Math.sin(angle) + 1) / 2; 

          const startX = cX - totalW * (1 - alignX);
          const startY = cY - miniH * (1 - alignY);

          for (let j = 0; j < count; j++) {
            if (cardBackImg) {
              const px = startX + j * overlap;
              
              ctx.fillStyle = "rgba(0,0,0,0.3)";
              ctx.fillRect(px + 2, startY + 2, miniW, miniH);
              
              ctx.drawImage(cardBackImg, px, startY, miniW, miniH);
              
              ctx.strokeStyle = "rgba(255,255,255,0.8)";
              ctx.lineWidth = 1;
              ctx.strokeRect(px, startY, miniW, miniH);
            }
          }
        }

        if (thinkingPlayer === i) {
          const bx = x + r + 5;
          const by = y - r - 5;
          
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          if (ctx.ellipse) {
            ctx.ellipse(bx, by, 18, 12, 0, 0, Math.PI * 2);
          } else {
            ctx.arc(bx, by, 15, 0, Math.PI * 2);
          }
          ctx.fill();

          ctx.beginPath();
          ctx.arc(bx - 12, by + 10, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx - 20, by + 18, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#000000";
          ctx.font = "bold 14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("...", bx, by - 2);
        }
      });
    };

    drawBoard();
  }, [players, currentPlayer, direction, topCard, thinkingPlayer, playerCards]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "-10px" }}>
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick} 
        style={{ maxWidth: "90vw", maxHeight: "75vh", cursor: currentPlayer === 0 ? "pointer" : "default" }} 
      />
    </div>
  );
}
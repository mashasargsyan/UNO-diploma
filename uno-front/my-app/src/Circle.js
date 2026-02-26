import React, { useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";

 const playerColors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A8", "#33FFF3", "#FFA833", "#A833FF", "#A8FF33"];
 const botNames = ["Max", "Leo", "Mia", "Sam", "Zoe", "Bob", "Tom", "Nia", "Rex"];

export default function Circle() {
  const canvasRef = useRef();
  const location = useLocation();

  const name = location.state?.name || "Player 1";
  const playersCount = location.state?.playersCount || 2;

 
  const players = useMemo(() => {
    return Array.from({ length: playersCount }, (_, i) => {
      const imageNumber = i+1; 

      return {
        
        name: i === 0 ? name : botNames[i-1],
        id: i,
        color: playerColors[i % playerColors.length], 
        avatar: `/icons/${imageNumber}.jpg` 
      };
    });
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
    const r = 30; 

  
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "#1e6b3f"; 
    ctx.fill();
    ctx.strokeStyle = "#144a2b"; 
    ctx.lineWidth = 5;
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
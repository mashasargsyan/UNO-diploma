import Circle from "./Circle";
import { Deck } from "./Deck";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const botNames = ["Max", "Leo", "Mia", "Sam", "Zoe", "Bob", "Tom", "Nia", "Rex"];
const playerColors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A8", "#33FFF3", "#FFA833", "#A833FF", "#A8FF33", "#FF8C00"];

export default function Game() {
  const [showExit, setShowExit] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const difficulty = state?.difficulty || "Easy";
  const name = state?.name || "Player 1";
  const playersCount = state?.playersCount || 2;

  useEffect(() => {
    const deck = Deck();
  }, []);

  const players = [];
  for (let i = 0; i < playersCount; i++) {
    players.push({
      id: i,
      name: i === 0 ? name : botNames[i - 1],
      avatar: `/icons/${i + 1}.jpg`,
      color: playerColors[i]
    });
  }

  const handleShowExit = () => {
    setShowExit(true);
  };

  return (
    <div className="GamePage">
      <div className="title">UNO</div>

      <div className="GameDetails">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Player count:</strong> {players.length}</p>
        <p><strong>Complexity:</strong> {difficulty}</p>
        <div>
          <button onClick={handleShowExit}>Exit</button>
        </div>
      </div>

      <Circle players={players} />

      {showExit && (
        <div className="modal">   
          <div className="modal-content">
            <h3>Are you sure?</h3>
            <div className="modal-buttons">
              <button onClick={() => navigate("/")}>YES</button>
              <button onClick={() => setShowExit(false)}>NO</button>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
}
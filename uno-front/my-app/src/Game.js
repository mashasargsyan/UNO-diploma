import Circle from "./Circle";
import { Deck } from "./Deck";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

export default function Game() {
  const [showExit, setShowExit] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    Deck();
  }, []);

  const players = new Array(state?.playersCount || 2);
  for (let i = 0; i < players.length; i++) {
      players[i] = {
        name: i === 0 ? state.name : "Player " + i, 
      };
    
  }
  const difficulty = state?.difficulty || "Easy";
  const name = state?.name || "John Doe";

  const handleShowExit = () => {
    setShowExit(true);
  };

  return (
    <div className = "UnoForm">
    <div className="GamePage">
      <div className = "title">UNO</div>

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
              <button onClick={() => navigate("/")}>
                YES
              </button>
              <button onClick={() => setShowExit(false)}>
                NO
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  </div>
  );
}


import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Game() {
  const [showExit, setShowExit] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const players = state?.players || 2;
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
        <p><strong>Player count:</strong> {players}</p>
        <p><strong>Complexity:</strong> {difficulty}</p>
        <div>
          <button onClick={handleShowExit}>Exit</button>
        </div>
      </div>
 
     {showExit && (
        <div className="modal" onClick={() => setShowExit(false)}>   
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

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
  // Նախապես որոշված գույներ, որոնք կերևան խաղացողների շուրջ կամ որպես ֆոն
  const playerColors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A8", "#33FFF3", "#FFA833", "#A833FF", "#A8FF33", "#FF3333"];

  for (let i = 0; i < players.length; i++) {
      const playerName = i === 0 ? state?.name : "Player " + i;
      players[i] = {
        name: playerName,
        // Սա ավտոմատ կստեղծի տարբերվող վիզուալ նկարներ ամեն խաղացողի համար
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${playerName}`,
        color: playerColors[i % playerColors.length] // Ընտրում է գույնը ցուցակից
      };
  }
  const difficulty = state?.difficulty || "Easy";
  const name = state?.name || "John Doe";

  const handleShowExit = () => {
    setShowExit(true);
  };

  return (
    // ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Այստեղից հանել ենք <div className="UnoForm"> տեգը
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
    // ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Այստեղից հանել ենք նաև UnoForm-ը փակող </div>-ը
  );
}

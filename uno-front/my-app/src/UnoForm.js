import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UnoForm({ onClick }) {
  const navigate = useNavigate();

  const [players, setPlayers] = useState(2);
  const [difficulty, setDifficulty] = useState("Easy");  
  const [name, setName] = useState("");

  return (
    <div className="UnoForm">
      <div className="Text">
        <div className="title">UNO</div>

        <div className="sub-title">Name:</div>
        <input
          id="PlayerName"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="sub-title">Complexity:</div>

        <div className="difficulty">
          <label>
            <input
              type="radio"
              name="level"
              value="Easy"
              checked={difficulty === "Easy"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            Easy
          </label>

          <label>
            <input
              type="radio"
              name="level"
              value="Hard"
              checked={difficulty === "Hard"}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            Hard
          </label>
        </div>

        <div className="sub-title">Player count:</div>
        <input
          type="number"
          id="players"
          name="players"
          min="2"
          max="10"
          value={players}
          onChange={(e) => setPlayers(Number(e.target.value))}
        />
      </div>

      <div>
        <button
          onClick={() =>
            navigate("/Game", {
              state: {
                players,
                difficulty,
                name,
              },
            })
          }
        >
          Start
        </button>
      </div>

      <div>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
}

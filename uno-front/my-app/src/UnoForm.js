import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UnoForm() {
  const navigate = useNavigate();
  const [playersCount, setPlayers] = useState(2);
  const [difficulty, setDifficulty] = useState("Easy");
  const [name, setName] = useState("");

  const handleStart = () => {
    navigate("/Game", {
      state: {
        playersCount,
        difficulty,
        name: name.trim() || "John Doe",
      },
    });
  };

  return (
    <div className="UnoForm">
      <div className="Text">
        <div className="title">UNO</div>
        <div className="sub-title">Name:</div>
        <input
          id="PlayerName"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "150px", height: "25px", textAlign: "center" }}
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
          min="2"
          max="10"
          value={playersCount}
          onChange={(e) => setPlayers(Number(e.target.value))}
          style={{ width: "50px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>Back</button>
      </div>
    </div>
  );
}
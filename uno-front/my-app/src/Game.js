import { useLocation } from "react-router-dom";

export default function Game() {
  const { state } = useLocation();

  const players = state?.players || 2;
  const difficulty = state?.difficulty || "Easy";
  const name = state?.name || "John Doe";

  return (
    <div className="GamePage">
      <h1 className = "title">UNO</h1>

      <div className="GameDetails">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Player count:</strong> {players}</p>
        <p><strong>Complexity:</strong> {difficulty}</p>
      </div>
    </div>
  );
}

import Circle from "./Circle";
import { Deck } from "./Deck";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const botNames = ["Max", "Leo", "Mia", "Sam", "Zoe", "Bob", "Tom", "Nia", "Rex"];

export default function Game() {
  const [showExit, setShowExit] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const difficulty = state?.difficulty || "Easy";
  const name = state?.name || "Player 1";
  const playersCount = state?.playersCount || 2;

  const [gameState, setGameState] = useState("dealing");
  
  const [playerCards, setPlayerCards] = useState({});
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fullDeck = Deck() || [];
    if (fullDeck.length === 0) return;

    let currentDeck = [...fullDeck];
    let initialPlayerCards = {};
    for (let i = 0; i < playersCount; i++) {
      initialPlayerCards[i] = [];
    }

    for (let j = 0; j < 7; j++) {
      for (let i = 0; i < playersCount; i++) {
        if (currentDeck.length > 0) {
          initialPlayerCards[i].push(currentDeck.pop());
        }
      }
    }

    const firstDiscardCard = currentDeck.pop();

    setPlayerCards(initialPlayerCards);
    setDiscardPile(firstDiscardCard ? [firstDiscardCard] : []);
    setDrawPile(currentDeck);
    setGameState("playing");
  }, [playersCount]);

  const playCard = (playerIndex, cardIndex) => {
    if (gameState !== "playing" || playerIndex !== currentPlayer) return;

    let newPlayerCards = { ...playerCards };
    let currentHand = [...newPlayerCards[playerIndex]];

    const [playedCard] = currentHand.splice(cardIndex, 1);
    newPlayerCards[playerIndex] = currentHand;

    setPlayerCards(newPlayerCards);
    setDiscardPile(prev => [...prev, playedCard]);

    let nextPlayer = (currentPlayer + direction) % playersCount;
    if (nextPlayer < 0) nextPlayer += playersCount;
    setCurrentPlayer(nextPlayer);
  };

  const players = [];
  for (let i = 0; i < playersCount; i++) {
    players.push({
      id: i,
      name: i === 0 ? name : botNames[i - 1],
      avatar: `/icons/${i + 1}.jpg`,
      color: "#007BFF"
    });
  }

  console.log("PlayerCards:", playerCards);
  console.log("DiscardPile:", discardPile);
  
  return (
    <div className="GamePage">
      <div className="title">UNO</div>
      <div className="GameDetails">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>State:</strong> {gameState}</p>
        <div><button onClick={() => setShowExit(true)}>Exit</button></div>
      </div>

      <Circle players={players} currentPlayer={currentPlayer} direction={direction} />

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
import "./index.css";
import Circle from "./Circle";
import { Deck } from "./Deck";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

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
  
  const [unoCalled, setUnoCalled] = useState(false);

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

  const handleUnoClick = useCallback(() => {
    if (playerCards[0] && playerCards[0].length <= 2) {
      setUnoCalled(true);
    }
  }, [playerCards]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "1") {
        handleUnoClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUnoClick]);

  const playCard = (playerIndex, cardIndex) => {
    if (gameState !== "playing" || playerIndex !== currentPlayer) return;

    const topCard = discardPile[discardPile.length - 1];
    const selectedCard = playerCards[playerIndex][cardIndex];

    if (
      selectedCard.color !== topCard.color &&
      selectedCard.type !== topCard.type &&
      selectedCard.color !== 4
    ) {
      return; 
    }

    let newPlayerCards = { ...playerCards };
    let currentHand = [...newPlayerCards[playerIndex]];

    const [playedCard] = currentHand.splice(cardIndex, 1);
    newPlayerCards[playerIndex] = currentHand;

    setPlayerCards(newPlayerCards);
    setDiscardPile(prev => [...prev, playedCard]);

    if (playerIndex === 0) {
      setUnoCalled(false); 
    }

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

  return (
    <div className="GamePage">
      
      <div className="top-bar">
        <div className="game-stats">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>State:</strong> {gameState}</p>
        </div>
        <h2 className="top-title">UNO</h2>
        <button className="exit-btn" onClick={() => setShowExit(true)}>Exit</button>
      </div>

      <div className="board-container">
        <Circle players={players} currentPlayer={currentPlayer} direction={direction} />
      </div>

      {/* ՈՒՆՈ Կոճակը հիմա այստեղ է, քարտերի բլոկից դուրս */}
      <button 
        className={`uno-button ${unoCalled ? "called" : ""}`}
        onClick={handleUnoClick}
      >
        UNO!
      </button>

      <div className="player-hand">
        {playerCards[0] && playerCards[0].map((card, index) => (
          <div key={index} className="uno-card" onClick={() => playCard(0, index)}>
            <span>{card.type}</span>
            <span>{card.color}</span>
          </div>
        ))}
      </div>

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
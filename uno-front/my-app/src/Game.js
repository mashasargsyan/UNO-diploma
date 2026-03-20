import "./index.css";
import Table from "./Table";
import { Deck } from "./Deck";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

const botNames = ["Max", "Leo", "Mia", "Sam", "Zoe", "Bob", "Tom", "Nia", "Rex"];

export default function Game() {
  const [showExit, setShowExit] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState(null);
  const [botPickedColor, setBotPickedColor] = useState(null);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [unoPenaltyMessage, setUnoPenaltyMessage] = useState(null);
  const [botMessage, setBotMessage] = useState(null);

  const { state } = useLocation();
  const navigate = useNavigate();

  const name = state?.name || "Player 1";
  const playersCount = state?.playersCount || 2;

  const [gameState, setGameState] = useState("dealing");
  const [playerCards, setPlayerCards] = useState({});
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [direction, setDirection] = useState(1);

  const [unoCalled, setUnoCalled] = useState(false);
  const [thinkingPlayer, setThinkingPlayer] = useState(null);

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

  const finalizePlay = useCallback((playerIndex, cardIndex, chosenColor) => {
    let newPlayerCards = { ...playerCards };
    let currentHand = [...newPlayerCards[playerIndex]];

    const [playedCard] = currentHand.splice(cardIndex, 1);
    playedCard.color = chosenColor;

    let currentDrawPile = [...drawPile];

    if (playerIndex === 0 && currentHand.length === 1 && !unoCalled) {
      let drawnCards = [];
      for (let i = 0; i < 4; i++) {
        if (currentDrawPile.length > 0) {
          drawnCards.push(currentDrawPile.pop());
        }
      }
      currentHand = [...currentHand, ...drawnCards];

      setUnoPenaltyMessage(`${name}, you forgot to say UNO!: +4 cards`);

      setTimeout(() => {
        setUnoPenaltyMessage(null);
      }, 3500);
    }

    if (playerIndex !== 0 && currentHand.length === 1) {
      const bName = botNames[playerIndex - 1];
      setBotMessage(`${bName} says UNO!`);
      setTimeout(() => {
        setBotMessage(null);
      }, 3500);
    }

    newPlayerCards[playerIndex] = currentHand;

    if (newPlayerCards[playerIndex].length === 0) {
      setPlayerCards(newPlayerCards);
      setDiscardPile(prev => [...prev, playedCard]);
      setWinner(playerIndex);
      setGameState("ended");
      return;
    }

    let currentDirection = direction;
    let step = 1;
    let cardsToDraw = 0;

    if (playedCard.type === 11) {
      if (playersCount === 2) {
        step = 2;
      } else {
        currentDirection = direction * -1;
        setDirection(currentDirection);
      }
    } else if (playedCard.type === 10) {
      step = 2;
    } else if (playedCard.type === 12) {
      cardsToDraw = 2;
      step = 2;
    } else if (playedCard.type === 14) {
      cardsToDraw = 4;
      step = 2;
    }

    if (cardsToDraw > 0) {
      let victim = (playerIndex + currentDirection) % playersCount;
      if (victim < 0) victim += playersCount;

      let drawnCards = [];
      for (let i = 0; i < cardsToDraw; i++) {
        if (currentDrawPile.length > 0) {
          drawnCards.push(currentDrawPile.pop());
        }
      }

      newPlayerCards[victim] = [...newPlayerCards[victim], ...drawnCards];
    }

    setDrawPile(currentDrawPile);
    setPlayerCards(newPlayerCards);
    setDiscardPile(prev => [...prev, playedCard]);

    if (playerIndex === 0) {
      setUnoCalled(false);
      setHasDrawnThisTurn(false);
    }

    let nextPlayer = (playerIndex + (currentDirection * step)) % playersCount;
    if (nextPlayer < 0) nextPlayer += playersCount;
    setCurrentPlayer(nextPlayer);
  }, [playerCards, direction, playersCount, drawPile, unoCalled, name]);

  useEffect(() => {
    if (gameState !== "playing" || currentPlayer === 0) return;

    setThinkingPlayer(currentPlayer);

    const timer = setTimeout(() => {
      setThinkingPlayer(null);

      const currentHand = playerCards[currentPlayer];
      const topCard = discardPile[discardPile.length - 1];

      if (!currentHand || !topCard) return;

      const isValidCard = (card) => {
        return (
          card.color === topCard.color ||
          card.type === topCard.type ||
          card.type === 13 ||
          card.type === 14
        );
      };

      const playableCardIndex = currentHand.findIndex(isValidCard);

      if (playableCardIndex !== -1) {
        const cardToPlay = currentHand[playableCardIndex];

        if (cardToPlay.type === 13 || cardToPlay.type === 14) {
          const colors = [0, 1, 2, 3];
          const chosenColor = colors[Math.floor(Math.random() * colors.length)];

          setPendingWildCard({ playerIndex: currentPlayer, cardIndex: playableCardIndex });
          setShowColorPicker(true);

          const baseSpins = 12;
          const totalSteps = baseSpins + chosenColor;
          let currentStep = 0;

          const spinInterval = setInterval(() => {
            setBotPickedColor(currentStep % 4);
            currentStep++;
            if (currentStep > totalSteps) {
              clearInterval(spinInterval);

              setTimeout(() => {
                setShowColorPicker(false);
                setBotPickedColor(null);
                setPendingWildCard(null);
                finalizePlay(currentPlayer, playableCardIndex, chosenColor);
              }, 1200);
            }
          }, 150);

        } else {
          finalizePlay(currentPlayer, playableCardIndex, cardToPlay.color);
        }
      } else {
        if (drawPile.length > 0) {
          const newDrawPile = [...drawPile];
          const drawnCard = newDrawPile.pop();

          setDrawPile(newDrawPile);
          setPlayerCards(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], drawnCard]
          }));
        }

        let nextPlayer = (currentPlayer + direction) % playersCount;
        if (nextPlayer < 0) nextPlayer += playersCount;
        setCurrentPlayer(nextPlayer);
      }

    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPlayer, gameState, direction, playersCount, playerCards, discardPile, drawPile, finalizePlay]);

  const handleDrawCard = () => {
    if (gameState !== "playing" || currentPlayer !== 0) return;
    if (hasDrawnThisTurn) return;

    const topCard = discardPile[discardPile.length - 1];
    const currentHand = playerCards[0];

    const hasPlayableCard = currentHand.some(card =>
      card.color === topCard.color ||
      card.type === topCard.type ||
      card.type === 13 ||
      card.type === 14
    );

    if (hasPlayableCard) return;

    if (drawPile.length > 0) {
      const newDrawPile = [...drawPile];
      const drawnCard = newDrawPile.pop();
      setDrawPile(newDrawPile);

      setPlayerCards(prev => ({
        ...prev,
        0: [...prev[0], drawnCard]
      }));

      const isValid = (
        drawnCard.color === topCard.color ||
        drawnCard.type === topCard.type ||
        drawnCard.type === 13 ||
        drawnCard.type === 14
      );

      if (isValid) {
        setHasDrawnThisTurn(true);
      } else {
        let nextPlayer = (currentPlayer + direction) % playersCount;
        if (nextPlayer < 0) nextPlayer += playersCount;
        setCurrentPlayer(nextPlayer);
      }
    }
  };

  const playCard = (playerIndex, cardIndex) => {
    if (gameState !== "playing" || playerIndex !== currentPlayer) return;

    const topCard = discardPile[discardPile.length - 1];
    const selectedCard = playerCards[playerIndex][cardIndex];

    if (
      selectedCard.color !== topCard.color &&
      selectedCard.type !== topCard.type &&
      selectedCard.type !== 13 &&
      selectedCard.type !== 14
    ) {
      return;
    }

    if (selectedCard.type === 13 || selectedCard.type === 14) {
      setPendingWildCard({ playerIndex, cardIndex });
      setShowColorPicker(true);
      return;
    }

    finalizePlay(playerIndex, cardIndex, selectedCard.color);
  };

  const handleColorSelection = (color) => {
    if (!pendingWildCard || botPickedColor !== null) return;
    finalizePlay(pendingWildCard.playerIndex, pendingWildCard.cardIndex, color);
    setShowColorPicker(false);
    setPendingWildCard(null);
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

  const topCard = discardPile[discardPile.length - 1];

  const getCardImage = (card) => {
    if (!card) return "";
    if (card.type === 13 || card.type === 14) {
      return `/UnoCards/${card.type}.gif`;
    }
    return `/UnoCards/${card.color}_${card.type}.gif`;
  };

  return (
    <div className="GamePage">
      <div className="top-bar">
        <h2 className="top-title">UNO</h2>
        <button className="exit-btn" onClick={() => setShowExit(true)}>Exit</button>
      </div>

      {botMessage && (
        <div style={{
          position: "absolute",
          top: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFD700",
          color: "black",
          padding: "10px 25px",
          borderRadius: "30px",
          fontWeight: "900",
          fontSize: "18px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
          zIndex: 50,
          border: "2px solid white"
        }}>
          {botMessage}
        </div>
      )}

      <div className="board-container">
        <Table
          players={players}
          currentPlayer={currentPlayer}
          direction={direction}
          topCard={topCard}
          thinkingPlayer={thinkingPlayer}
          playerCards={playerCards}
          onDeckClick={handleDrawCard}
        />
      </div>

      <button
        className={`uno-button ${unoCalled ? "called" : ""}`}
        onClick={handleUnoClick}
      >
        UNO!
      </button>

      {hasDrawnThisTurn && currentPlayer === 0 && (
        <button
          className="pass-button"
          onClick={() => {
            setHasDrawnThisTurn(false);
            let nextPlayer = (currentPlayer + direction) % playersCount;
            if (nextPlayer < 0) nextPlayer += playersCount;
            setCurrentPlayer(nextPlayer);
          }}
        >
          PASS
        </button>
      )}

      <div className="player-hand">
        {playerCards[0] && playerCards[0].map((card, index) => (
          <div key={index} className="uno-card" onClick={() => playCard(0, index)}>
            <img src={getCardImage(card)} alt={`Card ${card.type}`} />
          </div>
        ))}
      </div>

      {unoPenaltyMessage && (
        <div className="modal" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ border: "4px solid #e82c2c" }}>
            <h2 style={{ color: "#e82c2c", marginTop: 0 }}>Warning</h2>
            <h3 style={{ margin: "20px 0", lineHeight: "1.5" }}>{unoPenaltyMessage}</h3>
          </div>
        </div>
      )}

      {gameState === "ended" && winner !== null && (
        <div className="modal" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ padding: "40px" }}>
            <h1 style={{ fontSize: "2.5em", color: winner === 0 ? "#28a745" : "#e82c2c", margin: "0 0 20px 0" }}>
              {winner === 0 ? "YOU WIN!" : `${players[winner].name} WINS!`}
            </h1>
            <p style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "30px", color: "#555" }}>
              The game has ended.
            </p>
            <div className="modal-buttons">
              <button onClick={() => window.location.reload()} style={{ backgroundColor: "#28a745" }}>NEW GAME</button>
              <button onClick={() => navigate("/")} style={{ backgroundColor: "#6c757d" }}>MAIN MENU</button>
            </div>
          </div>
        </div>
      )}

      {showColorPicker && pendingWildCard && (
        <div className="modal">
          <div className="modal-content">
            <h3>{botPickedColor !== null ? "Color is being selected..." : "Select a color"}</h3>
            <div className="color-picker-container">
              {[{ id: 0, hex: "#ff5555" }, { id: 1, hex: "#ffaa00" }, { id: 2, hex: "#55aa55" }, { id: 3, hex: "#2d2de7" }].map((c) => (
                <button
                  key={c.id}
                  className="color-btn"
                  style={{
                    backgroundColor: c.hex,
                    border: botPickedColor === c.id ? "6px solid black" : "3px solid white",
                    boxShadow: botPickedColor === c.id ? "0 0 15px rgba(0,0,0,0.6)" : "0 4px 6px rgba(0,0,0,0.2)",
                    cursor: botPickedColor !== null ? "default" : "pointer",
                    transform: botPickedColor === c.id ? "scale(1.15)" : "scale(1)"
                  }}
                  onClick={() => handleColorSelection(c.id)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showExit && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure?</h3>
            <div className="modal-buttons">
              <button onClick={() => navigate("/")}>YES</button>
              <button style={{ backgroundColor: "#6c757d" }} onClick={() => setShowExit(false)}>NO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
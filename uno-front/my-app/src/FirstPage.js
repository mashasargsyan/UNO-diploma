import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./index.css"; 

export default function FirstPage() {
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  const [ruleIndex, setRuleIndex] = useState(0);

  const rules = [
    "Each player gets 7 cards",
    "Play a card that matches the color, number, or symbol",
    "The first person to get rid of all their cards wins.",
    "When you have 1 card left, say UNO",
  ];

  const handleShowRules = () => {
    setShowRules(true);
    setRuleIndex(0);
  };

  const handleNext = () => {
    if (ruleIndex < rules.length - 1) {
      setRuleIndex(ruleIndex + 1);
    } else {
      setShowRules(false);
      setRuleIndex(0);
    }
  };

  const handlePrev = () => {
    if (ruleIndex > 0) setRuleIndex(ruleIndex - 1);
  };

  return (
    <div className="UnoForm">
      <div className="title">UNO</div>

      <div>
        <button onClick={() => navigate("/UnoForm")}>GAME</button>
      </div>

      <div>
        <button onClick={handleShowRules}>RULES</button>
      </div>

      {showRules && (
        <div className="modal" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rules</h3>
            <p>{rules[ruleIndex]}</p>

            <div className="modal-buttons">
              <button onClick={handlePrev} disabled={ruleIndex === 0}>
                ← PREV
              </button>
              <button onClick={handleNext}>
                {ruleIndex === rules.length - 1 ? "CLOSE" : "NEXT →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

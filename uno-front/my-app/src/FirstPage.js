import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function FirstPage(){
    const navigate = useNavigate();
    const [showRules, setShowRules] = useState(false);

     const handleShowRules = () => {
    if (!showRules) setShowRules(true); 
     }

    return(
        <div className="UnoForm">
            <div class="title">UNO</div>
            <div>
                <button onClick={() => navigate("/UnoForm")}>GAME</button>
            </div>
            
      <div>
        <button onClick={handleShowRules}>RULES</button>
      </div>
                  
         {showRules && (
        <div className="rules-text" style={{ marginTop: "15px", textAlign: "left" }}>
          <h6>
            <div>There are 108 cards.</div>         
            Each player is dealt 7 cards. <br />
            You must play a card matching the color, number, or symbol of the first card in the DISCARD pile. The gameplay then continues to the next player. <br />
            Flip the top card from the draw pile to start the discard pile. <br />
            Match cards by color or number. <br />
            Remember to say “Uno!” when you have one card left. The game continues until someone has one card and declares, “Uno!“.
          </h6>

          <button
            onClick={() => setShowRules(false)}
            style={{ marginTop: "10px" }}>
            QUIT
          </button>
        </div>

      )}
        </div>
    );
    
}
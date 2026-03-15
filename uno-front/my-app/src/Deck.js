export const Deck = () => {
  const cardTypes = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    skip: 10,
    reverse: 11,
    draw: 12,
    wild: 13,
    wildDraw: 14
  };

  const cardColors = {
    red: 0,
    yellow: 1,
    green: 2,
    blue: 3
  };
  
  function createDeck() {
    const cards = [];

    for (let color in cardColors) {
      const colorValue = cardColors[color];

      cards.push({ type: cardTypes.zero, color: colorValue });

      for (let num = 1; num <= 9; num++) {
        for (let i = 0; i < 2; i++) {
          cards.push({ type: num, color: colorValue });
        }
      }

      for (let i = 0; i < 2; i++) {
        cards.push({ type: cardTypes.skip, color: colorValue });
        cards.push({ type: cardTypes.reverse, color: colorValue });
        cards.push({ type: cardTypes.draw, color: colorValue });
      }
    }
    
    for (let i = 0; i < 4; i++) {
      cards.push({ type: cardTypes.wild, color: null });
      cards.push({ type: cardTypes.wildDraw, color: null });
    }

    return cards;
  }
  
  function shuffle(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const deck = createDeck();
  console.log("Original Deck:", [...deck]);

  const shuffledDeck = shuffle(deck);
  console.log("Shuffled Deck:", shuffledDeck);

  return shuffledDeck;
};
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

  const cardValues = {
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
    skip: 20,
    reverse: 20,
    draw: 20,
    wild: 50,
    wildDraw: 50
  };

  const deck = [];

  for (let color = 0; color <= 3; color++) {
    deck.push({
      type: cardTypes.zero,
      color,
      score: cardValues.zero
    });

    for (let number = 1; number <= 9; number++) {
      deck.push({ type: number, color, score: number });
      deck.push({ type: number, color, score: number });
    }

    for (let i = 0; i < 2; i++) {
      deck.push({ type: cardTypes.skip, color, score: 20 });
      deck.push({ type: cardTypes.reverse, color, score: 20 });
      deck.push({ type: cardTypes.draw, color, score: 20 });
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({ type: cardTypes.wild, color: 4, score: 50 });
    deck.push({ type: cardTypes.wildDraw, color: 4, score: 50 });
  }

  console.log("Number of Cards", deck.length);
  console.log(deck);

  return deck;
};

export interface Card {
  rank: number;
  suit: string;
}

// Category strength, low to high. Pair and two pair collapse into NOTHING
// since there is no button for them.
export const NOTHING = 0;
export const TRIPS = 3;
export const STRAIGHT = 4;
export const FLUSH = 5;
export const FULL_HOUSE = 6;
export const FOUR_OF_A_KIND = 7;
export const STRAIGHT_FLUSH = 8;
export const ROYAL_FLUSH = 9;

function rankValue(card: Card): number {
  return card.rank === 1 ? 14 : card.rank;
}

function fiveCardCategory(cards: Card[]): number {
  const values = cards.map(rankValue);
  const isFlush = cards.every((c) => c.suit === cards[0].suit);

  const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);
  const isWheel =
    uniqueValues.length === 5 &&
    uniqueValues.join(",") === "2,3,4,5,14";
  const isStraight =
    uniqueValues.length === 5 &&
    (uniqueValues[4] - uniqueValues[0] === 4 || isWheel);

  if (isFlush && isStraight && uniqueValues.join(",") === "10,11,12,13,14") {
    return ROYAL_FLUSH;
  }
  if (isFlush && isStraight) return STRAIGHT_FLUSH;

  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const sortedCounts = Array.from(counts.values()).sort((a, b) => b - a);

  if (sortedCounts[0] === 4) return FOUR_OF_A_KIND;
  if (sortedCounts[0] === 3 && sortedCounts[1] === 2) return FULL_HOUSE;
  if (isFlush) return FLUSH;
  if (isStraight) return STRAIGHT;
  if (sortedCounts[0] === 3) return TRIPS;
  return NOTHING;
}

export function bestCategory(cards: Card[]): number {
  let best = NOTHING;
  for (let excluded = 0; excluded < cards.length; excluded++) {
    const fiveCards = cards.filter((_, i) => i !== excluded);
    const category = fiveCardCategory(fiveCards);
    if (category > best) best = category;
  }
  return best;
}

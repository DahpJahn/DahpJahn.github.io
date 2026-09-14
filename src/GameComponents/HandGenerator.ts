import {
  bestCategory,
  Card,
  FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  NOTHING,
  ROYAL_FLUSH,
  STRAIGHT,
  STRAIGHT_FLUSH,
  TRIPS,
} from "./PokerHand";

const SUITS = ["spades", "clubs", "hearts", "diamonds"];
const RANKS = Array.from({ length: 13 }, (_, i) => i + 1);

// Five-consecutive-value runs, low to high. Ace appears as 14 (high) except
// in the wheel (A,2,3,4,5). The last run (10-A) is reserved for royal flushes.
const STRAIGHT_RUNS: number[][] = [
  [14, 2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7],
  [4, 5, 6, 7, 8],
  [5, 6, 7, 8, 9],
  [6, 7, 8, 9, 10],
  [7, 8, 9, 10, 11],
  [8, 9, 10, 11, 12],
  [9, 10, 11, 12, 13],
  [10, 11, 12, 13, 14],
];
const NON_ROYAL_RUNS = STRAIGHT_RUNS.slice(0, 9);
const ROYAL_RUN = STRAIGHT_RUNS[9];

function valueToRank(value: number): number {
  return value === 14 ? 1 : value;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSuit(): string {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

function cardKey(card: Card): string {
  return `${card.rank}-${card.suit}`;
}

function fullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) deck.push({ rank, suit });
  }
  return deck;
}

function remainingDeck(used: Card[]): Card[] {
  const usedKeys = new Set(used.map(cardKey));
  return fullDeck().filter((c) => !usedKeys.has(cardKey(c)));
}

// The weighting the game asks for: "Nothing" half the time, the other
// seven hand types evenly splitting the remaining half.
const WEIGHTED_CATEGORIES: { category: number; weight: number }[] = [
  { category: NOTHING, weight: 50 },
  { category: TRIPS, weight: 50 / 7 },
  { category: STRAIGHT, weight: 50 / 7 },
  { category: FLUSH, weight: 50 / 7 },
  { category: FULL_HOUSE, weight: 50 / 7 },
  { category: FOUR_OF_A_KIND, weight: 50 / 7 },
  { category: STRAIGHT_FLUSH, weight: 50 / 7 },
  { category: ROYAL_FLUSH, weight: 50 / 7 },
];

function pickTargetCategory(): number {
  const total = WEIGHTED_CATEGORIES.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * total;
  for (const { category, weight } of WEIGHTED_CATEGORIES) {
    if (r < weight) return category;
    r -= weight;
  }
  return NOTHING;
}

function generateNothing(): Card[] {
  for (let attempt = 0; attempt < 500; attempt++) {
    const hand = shuffle(fullDeck()).slice(0, 6);
    if (bestCategory(hand) === NOTHING) return hand;
  }
  return shuffle(fullDeck()).slice(0, 6);
}

function generateTrips(): Card[] {
  const rank = pickRandom(RANKS);
  const suits = shuffle(SUITS).slice(0, 3);
  const core = suits.map((suit) => ({ rank, suit }));

  let pool = remainingDeck(core).filter((c) => c.rank !== rank);
  const junk: Card[] = [];
  for (let i = 0; i < 3; i++) {
    const usedRanks = new Set(junk.map((c) => c.rank));
    const candidates = pool.filter((c) => !usedRanks.has(c.rank));
    const card = pickRandom(candidates);
    junk.push(card);
    pool = pool.filter((c) => cardKey(c) !== cardKey(card));
  }
  return [...core, ...junk];
}

function generateStraight(): Card[] {
  const run = pickRandom(NON_ROYAL_RUNS);
  const suitOrder = shuffle(SUITS);
  const core = run.map((value, i) => ({
    rank: valueToRank(value),
    suit: suitOrder[i % suitOrder.length],
  }));
  const junk = pickRandom(remainingDeck(core));
  return [...core, junk];
}

function generateFlush(): Card[] {
  const suit = randomSuit();
  let ranks: number[] = [];
  while (true) {
    ranks = shuffle(RANKS).slice(0, 5);
    const values = ranks.map((r) => (r === 1 ? 14 : r)).sort((a, b) => a - b);
    const isConsecutive = values[4] - values[0] === 4;
    const isWheel = values.join(",") === "2,3,4,5,14";
    if (!isConsecutive && !isWheel) break;
  }
  const core = ranks.map((rank) => ({ rank, suit }));
  const pool = remainingDeck(core).filter((c) => c.suit !== suit);
  const junk = pickRandom(pool);
  return [...core, junk];
}

function generateFullHouse(): Card[] {
  const [rankR, rankS] = shuffle(RANKS);
  const suitsR = shuffle(SUITS).slice(0, 3);
  const suitsS = shuffle(SUITS).slice(0, 2);
  const core = [
    ...suitsR.map((suit) => ({ rank: rankR, suit })),
    ...suitsS.map((suit) => ({ rank: rankS, suit })),
  ];
  const pool = remainingDeck(core).filter((c) => c.rank !== rankR);
  const junk = pickRandom(pool);
  return [...core, junk];
}

function generateFourOfAKind(): Card[] {
  const rank = pickRandom(RANKS);
  const core = SUITS.map((suit) => ({ rank, suit }));

  let pool = remainingDeck(core);
  const junk: Card[] = [];
  for (let i = 0; i < 2; i++) {
    const card = pickRandom(pool);
    junk.push(card);
    pool = pool.filter((c) => cardKey(c) !== cardKey(card));
  }
  return [...core, ...junk];
}

function generateStraightFlush(): Card[] {
  const run = pickRandom(NON_ROYAL_RUNS);
  const suit = randomSuit();
  const core = run.map((value) => ({ rank: valueToRank(value), suit }));
  const pool = remainingDeck(core).filter((c) => c.suit !== suit);
  const junk = pickRandom(pool);
  return [...core, junk];
}

function generateRoyalFlush(): Card[] {
  const suit = randomSuit();
  const core = ROYAL_RUN.map((value) => ({ rank: valueToRank(value), suit }));
  const pool = remainingDeck(core).filter((c) => c.suit !== suit);
  const junk = pickRandom(pool);
  return [...core, junk];
}

const GENERATORS: Record<number, () => Card[]> = {
  [TRIPS]: generateTrips,
  [STRAIGHT]: generateStraight,
  [FLUSH]: generateFlush,
  [FULL_HOUSE]: generateFullHouse,
  [FOUR_OF_A_KIND]: generateFourOfAKind,
  [STRAIGHT_FLUSH]: generateStraightFlush,
  [ROYAL_FLUSH]: generateRoyalFlush,
};

export function dealHand(): Card[] {
  const target = pickTargetCategory();
  const generator = GENERATORS[target] ?? generateNothing;
  const hand = generator();
  return shuffle(hand);
}

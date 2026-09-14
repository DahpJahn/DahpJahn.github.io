import { useState } from "react";
import "../GameStyles/Game.css";
import Navbar from "../HomeComponents/Navbar";
import Button from "./Button";
import { dealHand } from "./HandGenerator";
import PlayingCard from "./PlayingCard";
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

const HAND_BUTTONS = [
  { category: NOTHING, name: "Nothing" },
  { category: TRIPS, name: "Trips" },
  { category: STRAIGHT, name: "Straight" },
  { category: FLUSH, name: "Flush" },
  { category: FULL_HOUSE, name: "Full House" },
  { category: FOUR_OF_A_KIND, name: "Four of a Kind" },
  { category: STRAIGHT_FLUSH, name: "Straight Flush" },
  { category: ROYAL_FLUSH, name: "Royal Flush" },
];

const Game = () => {
  const [cards, setCards] = useState<Card[]>(dealHand);
  const [wrongCategories, setWrongCategories] = useState<Set<number>>(
    new Set(),
  );
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const stored = Number(localStorage.getItem("highScore"));
    return Number.isFinite(stored) ? stored : 0;
  });
  const topCards = cards.slice(0, 3);
  const bottomCards = cards.slice(3, 6);

  function handleGuess(category: number) {
    if (bestCategory(cards) === category) {
      setCards(dealHand());
      setStreak((prev) => {
        const next = wrongCategories.size > 0 ? 0 : prev + 1;
        setHighScore((prevHighScore) => {
          if (next <= prevHighScore) return prevHighScore;
          localStorage.setItem("highScore", String(next));
          return next;
        });
        return next;
      });
      setWrongCategories(new Set());
    } else {
      setWrongCategories((prev) => new Set(prev).add(category));
      setStreak(0);
    }
  }

  return (
    <div className="game">
      <Navbar />
      <h1 className="game-streak-label">{`Streak: ${streak}`}</h1>
      <h1 className="game-high-score-label">{`High Score: ${highScore}`}</h1>
      <div className="game-row game-row-top">
        {topCards.map((card, i) => (
          <PlayingCard key={i} rank={card.rank} suit={card.suit} />
        ))}
      </div>
      <div className="game-hand-buttons">
        {HAND_BUTTONS.map(({ category, name }) => (
          <Button
            key={category}
            name={name}
            width="112px"
            wrong={wrongCategories.has(category)}
            onClick={() => handleGuess(category)}
          />
        ))}
      </div>
      <div className="game-row game-row-bottom">
        {bottomCards.map((card, i) => (
          <PlayingCard key={i} rank={card.rank} suit={card.suit} />
        ))}
      </div>
    </div>
  );
};

export default Game;

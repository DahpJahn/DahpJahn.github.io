import "../GameStyles/PlayingCard.css";

interface Props {
  rank: number;
  suit: string;
}

const rankNames: Record<number, string> = {
  1: "ace",
  11: "jack",
  12: "queen",
  13: "king",
};

const PlayingCard = ({ rank, suit }: Props) => {
  const rankName = rankNames[rank] ?? String(rank);
  const src = `/assets/cards/${rankName}_of_${suit}.png`;

  return (
    <img
      className="playing-card"
      src={src}
      alt={`${rankName} of ${suit}`}
      draggable={false}
    />
  );
};

export default PlayingCard;

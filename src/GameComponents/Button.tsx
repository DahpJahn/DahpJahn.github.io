import "../GameStyles/Button.css";

interface ButtonProps {
  name: string;
  onClick: () => void;
  width: string;
  wrong?: boolean;
}

const Button = ({ name, onClick, width, wrong }: ButtonProps) => {
  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
  };

  return (
    <button
      className={`game-button${wrong ? " game-button-wrong" : ""}`}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      style={{ width: `${width}` }}
    >
      {name}
    </button>
  );
};

export default Button;

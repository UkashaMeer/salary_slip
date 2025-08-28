import { ControlButtonsProps } from "./types";

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onBreak,
  clockedIn,
  handleBreakIn,
  handleBreakOut,
  handleCheckOut,
}) => {
  if (!clockedIn) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-4">
        {!onBreak ? (
          <button onClick={handleBreakIn} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Break In
          </button>
        ) : (
          <button onClick={handleBreakOut} className="bg-green-500 text-white px-4 py-2 rounded">
            Break Out
          </button>
        )}
      </div>

      <button onClick={handleCheckOut} className="bg-red-500 text-white px-4 py-2 rounded">
        Check Out
      </button>
    </div>
  );
};

export default ControlButtons;

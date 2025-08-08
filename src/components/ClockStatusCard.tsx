interface Props {
  elapsedSeconds: number;
  totalBreakSeconds: number;
  shiftSeconds: number;
  breakLimitSeconds: number;
  formatTime: (s: number) => string;
}

const ClockStatusCard: React.FC<Props> = ({
  elapsedSeconds,
  totalBreakSeconds,
  shiftSeconds,
  breakLimitSeconds,
  formatTime,
}) => {
  const remainingShiftSeconds = Math.max(0, shiftSeconds - elapsedSeconds);
  const remainingBreakSeconds = Math.max(0, breakLimitSeconds - totalBreakSeconds);

  return (
    <div className="bg-gray-100 p-4 rounded shadow text-sm text-center flex items-center justify-between min-w-[1140px] w-full">
      <p>⏳ Time since check-in: {formatTime(elapsedSeconds)}</p>
      <p>🕒 Remaining Shift Time: {formatTime(remainingShiftSeconds)}</p>
      <p>☕ Total Break Time: {formatTime(totalBreakSeconds)}</p>
      <p>⏳ Remaining Break Time: {formatTime(remainingBreakSeconds)}</p>
    </div>
  );
};

export default ClockStatusCard;

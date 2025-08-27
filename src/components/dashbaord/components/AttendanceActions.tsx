import React from "react";
import ControlButtons from "@/components/ControlButtons";

interface AttendanceActionsProps {
  isCheckOut: boolean;
  clockedIn: boolean;
  onBreak: boolean;
  handleCheckIn: () => Promise<void>;
  handleBreakIn: () => Promise<void>;
  handleBreakOut: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

const AttendanceActions: React.FC<AttendanceActionsProps> = ({
  isCheckOut,
  clockedIn,
  onBreak,
  handleCheckIn,
  handleBreakIn,
  handleBreakOut,
  handleCheckOut,
}) => {
  if (isCheckOut) {
    return <span className="text-gray-400">You are clocked out</span>;
  }

  if (!clockedIn) {
    return (
      <button 
        onClick={handleCheckIn} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Check In
      </button>
    );
  }

  return (
    <ControlButtons
      onBreak={onBreak}
      clockedIn={clockedIn}
      handleBreakIn={handleBreakIn}
      handleBreakOut={handleBreakOut}
      handleCheckOut={handleCheckOut}
    />
  );
};

export default AttendanceActions;
import { useState, useEffect } from "react";

interface UseAttendanceStatusReturn {
  clockedIn: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  onBreak: boolean;
  breakStartTime: number | null;
  totalBreakSeconds: number;
  isCheckOut: boolean;
  setClockedIn: (value: boolean) => void;
  setStartTime: (value: number | null) => void;
  setElapsedSeconds: (value: number) => void;
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
  setTotalBreakSeconds: (value: number | React.SetStateAction<number>) => void;
  setIsCheckOut: (value: boolean) => void;
}

export const useAttendanceStatus = (): UseAttendanceStatusReturn => {
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);
  const [isCheckOut, setIsCheckOut] = useState(false);

  return {
    clockedIn,
    startTime,
    elapsedSeconds,
    onBreak,
    breakStartTime,
    totalBreakSeconds,
    isCheckOut,
    setClockedIn,
    setStartTime,
    setElapsedSeconds,
    setOnBreak,
    setBreakStartTime,
    setTotalBreakSeconds,
    setIsCheckOut,
  };
};
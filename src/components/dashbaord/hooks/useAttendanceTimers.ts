import { useEffect } from "react";

interface UseAttendanceTimersProps {
  clockedIn: boolean;
  startTime: number | null;
  onBreak: boolean;
  breakStartTime: number | null;
  setElapsedSeconds: (value: number) => void;
  setTotalBreakSeconds: (value: React.SetStateAction<number>) => void;
}

export const useAttendanceTimers = ({
  clockedIn,
  startTime,
  onBreak,
  breakStartTime,
  setElapsedSeconds,
  setTotalBreakSeconds,
}: UseAttendanceTimersProps) => {
  // Timer for elapsed seconds when clocked in
  useEffect(() => {
    if (!clockedIn || !startTime) return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [clockedIn, startTime, setElapsedSeconds]);

  // Timer for break seconds when on break
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (onBreak && breakStartTime) {
      interval = setInterval(() => {
        setTotalBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [onBreak, breakStartTime, setTotalBreakSeconds]);
};
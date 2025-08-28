import { useEffect } from "react";

interface UseAttendanceTimersProps {
  clockedIn: boolean;
  startTime: number | null;
  onBreak: boolean;
  breakStartTime: number | null;
  totalBreakSeconds: number;
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
  totalBreakSeconds
}: UseAttendanceTimersProps) => {

  useEffect(() => {
    if (!clockedIn || !startTime) return;

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [clockedIn, startTime, setElapsedSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (onBreak && breakStartTime) {
      interval = setInterval(() => {
        setTotalBreakSeconds((prev) => {
          const updated = prev + 1;
          localStorage.setItem("totalBreakSeconds", updated.toString());
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [onBreak, breakStartTime, setTotalBreakSeconds]);
};
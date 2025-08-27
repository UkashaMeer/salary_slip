interface LocalStorageState {
  setClockedIn: (value: boolean) => void;
  setStartTime: (value: number | null) => void;
  setElapsedSeconds: (value: number) => void;
  setTotalBreakSeconds: (value: number) => void;
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
}

export const localStorageService = {
  restoreCheckInState: ({ setClockedIn, setStartTime, setElapsedSeconds }: LocalStorageState) => {
    const alreadyCheckedIn = localStorage.getItem("checkedIn") === "true";

    if (alreadyCheckedIn) {
      const savedTime = localStorage.getItem("checkInTime");
      if (savedTime) {
        setClockedIn(true);
        setStartTime(Number(savedTime));
        setElapsedSeconds(Math.floor((Date.now() - Number(savedTime)) / 1000));
      }
      return true;
    }
    return false;
  },

  restoreBreakState: ({ setTotalBreakSeconds, setOnBreak, setBreakStartTime }: LocalStorageState) => {
    const savedTotalBreak = localStorage.getItem("totalBreakSeconds");
    const savedOnBreak = localStorage.getItem("onBreak") === "true";
    const savedBreakStart = localStorage.getItem("breakStartTime");

    if (savedTotalBreak) {
      let total = parseInt(savedTotalBreak, 10);

      if (savedOnBreak && savedBreakStart) {
        const now = Date.now();
        const diff = Math.floor((now - Number(savedBreakStart)) / 1000);
        total += diff;
      }

      setTotalBreakSeconds(total);
    }

    if (savedOnBreak && savedBreakStart) {
      setOnBreak(true);
      setBreakStartTime(Number(savedBreakStart));
    }
  },

  restoreBreakStateSimple: ({ setOnBreak, setBreakStartTime }: LocalStorageState) => {
    const onBreakStored = localStorage.getItem("onBreak") === "true";
    if (onBreakStored) {
      const storedBreakStart = localStorage.getItem("breakStartTime");
      if (storedBreakStart) {
        setOnBreak(true);
        setBreakStartTime(Number(storedBreakStart));
      }
    }
  },
};
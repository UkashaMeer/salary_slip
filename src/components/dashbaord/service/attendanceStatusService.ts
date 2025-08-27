interface AttendanceStatusProps {
  setClockedIn: (value: boolean) => void;
  setIsCheckOut: (value: boolean) => void;
  setStartTime: (value: number | null) => void;
  setElapsedSeconds: (value: number) => void;
  onBreak: boolean;
  isCheckOut: boolean;
  SHIFT_SECONDS: number;
  handleBreakOut: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

export const attendanceStatusService = {
  checkStatus: async ({
    setClockedIn,
    setIsCheckOut,
    setStartTime,
    setElapsedSeconds,
    onBreak,
    isCheckOut,
    SHIFT_SECONDS,
    handleBreakOut,
    handleCheckOut,
  }: AttendanceStatusProps) => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/status/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        switch (data.status) {
          case "checked_in":
            setClockedIn(true);
            setIsCheckOut(false);

            const utcDate = new Date(data.time_in);
            const localTime =
              utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000;
            setStartTime(localTime);

            const elapsed = Math.floor((Date.now() - localTime) / 1000);
            setElapsedSeconds(elapsed);

            if (elapsed >= SHIFT_SECONDS && !isCheckOut) {
              console.log("⏳ Auto-checkout triggered after 9 hour");

              if (onBreak) {
                console.log("☕ Auto break-out before checkout");
                await handleBreakOut();
              }

              await handleCheckOut();
            }

            break;

          case "checked_out":
            setClockedIn(false);
            setIsCheckOut(true);
            break;

          default:
            setClockedIn(false);
            setIsCheckOut(false);
        }
      }
    } catch (err) {
      console.log("Error checking status", err);
    }
  },
};
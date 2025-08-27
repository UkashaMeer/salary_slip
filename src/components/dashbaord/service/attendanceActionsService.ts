interface CheckInProps {
  setClockedIn: (value: boolean) => void;
  setStartTime: (value: number | null) => void;
  setTotalBreakSeconds: (value: number) => void;
}

interface CheckOutProps {
  setClockedIn: (value: boolean) => void;
  setStartTime: (value: number | null) => void;
  setElapsedSeconds: (value: number) => void;
  setTotalBreakSeconds: (value: number) => void;
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
  setIsCheckOut: (value: boolean) => void;
}

interface BreakInProps {
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
}

interface BreakOutProps {
  totalBreakSeconds: number;
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
}

export const attendanceActionsService = {
  handleCheckIn: async ({ setClockedIn, setStartTime, setTotalBreakSeconds }: CheckInProps) => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/time-in/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        const now = Date.now();

        localStorage.setItem("checkedIn", "true");
        localStorage.setItem("checkInTime", now.toString());
        localStorage.setItem("totalBreakSeconds", "0");
        setTotalBreakSeconds(0);

        setClockedIn(true);
        setStartTime(now);

        console.log("✅ Clocked in at", new Date(now).toLocaleString());
      } else {
        alert(data.error || "Error in time in");
      }
    } catch (error) {
      console.error("Check-in failed:", error);
      alert("Failed to check in");
    }
  },

  handleCheckOut: async ({
    setClockedIn,
    setStartTime,
    setElapsedSeconds,
    setTotalBreakSeconds,
    setOnBreak,
    setBreakStartTime,
    setIsCheckOut,
  }: CheckOutProps) => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/time-out/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await res.json();
      
      if (res.ok) {
        localStorage.removeItem("checkedIn");
        localStorage.removeItem("checkInTime");
        localStorage.removeItem("totalBreakSeconds");

        setClockedIn(false);
        setStartTime(null);
        setElapsedSeconds(0);
        setTotalBreakSeconds(0);
        setOnBreak(false);
        setBreakStartTime(null);
        setIsCheckOut(true);
      } else {
        alert(data.error || "Error in time out");
      }
    } catch {
      alert("Failed to check out");
    }
  },

  handleBreakIn: async ({ setOnBreak, setBreakStartTime }: BreakInProps) => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/break-in/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ employee_id: localStorage.getItem("employee_id") }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const now = Date.now();
        setOnBreak(true);
        setBreakStartTime(now);

        localStorage.setItem("onBreak", "true");
        localStorage.setItem("breakStartTime", now.toString());

        console.log("☕ Break In at", new Date(now).toLocaleString());
      } else {
        alert(data.message || data.error || "Error in break in");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to mark break in");
    }
  },

  handleBreakOut: async ({ totalBreakSeconds, setOnBreak, setBreakStartTime }: BreakOutProps) => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/break-out/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ employee_id: localStorage.getItem("employee_id") }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOnBreak(false);
        setBreakStartTime(null);
        localStorage.removeItem("onBreak");
        localStorage.removeItem("breakStartTime");
        localStorage.setItem("totalBreakSeconds", totalBreakSeconds.toString());
      } else {
        alert(data.message || data.error || "Error in break out");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to mark break out");
    }
  },
};
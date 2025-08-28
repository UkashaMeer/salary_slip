import { useState, useEffect } from "react";
import { AttendanceData } from "@/components/types";

interface UseAttendanceDataProps {
  isCheckOut: boolean;
  setTotalBreakSeconds: (value: number | React.SetStateAction<number>) => void;
  setOnBreak: (value: boolean) => void;
  setBreakStartTime: (value: number | null) => void;
}

export const useAttendanceData = ({
  isCheckOut,
  setTotalBreakSeconds,
  setOnBreak,
  setBreakStartTime,
}: UseAttendanceDataProps) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const res = await fetch(
          'https://ukashacoder.pythonanywhere.com/api/attendance/',
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const data = await res.json();
        setAttendanceData(data);

        if (isCheckOut) {
          localStorage.setItem("totalBreakSeconds", "0");
          setTotalBreakSeconds(0);
        } else if (data.length > 0) {
          const todayRecord = data[0];

          const today = new Date().toISOString().split("T")[0];
          if (todayRecord.date === today) {
            const [h, m, s] = todayRecord.total_break_time.split(":").map(Number);
            let totalSeconds = h * 3600 + m * 60 + s;

            if (todayRecord.breaks.length > 0) {
              const lastBreak = todayRecord.breaks[todayRecord.breaks.length - 1];
              if (lastBreak.break_out === null) {
                const breakStart = new Date(lastBreak.break_in).getTime();
                const now = Date.now();
                totalSeconds += Math.floor((now - breakStart) / 1000);

                setOnBreak(true);
                setBreakStartTime(breakStart);
                localStorage.setItem("onBreak", "true");
                localStorage.setItem("breakStartTime", breakStart.toString());
              }
            }

            setTotalBreakSeconds(totalSeconds);
            localStorage.setItem("totalBreakSeconds", totalSeconds.toString());
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAttendanceData();
  }, [isCheckOut, setTotalBreakSeconds, setOnBreak, setBreakStartTime]);

  return attendanceData;
};
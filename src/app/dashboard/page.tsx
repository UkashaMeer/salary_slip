"use client";

import AttendanceTable from "@/components/AttendanceTable";
import ClockStatusCard from "@/components/ClockStatusCard";
import ControlButtons from "@/components/ControlButtons";
import { useState, useEffect } from "react";

interface AttendanceData {
  employee_name: string;
}

type BreakTime = {
  break_in: string;
  break_out: string;
};

type AttendanceRow = {
  employee_name: string;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: string;
  late: boolean;
  breaks: BreakTime[];
  total_break_time: string;
};


export default function Dashboard() {
  const SHIFT_SECONDS = 9 * 60 * 60;
  const BREAK_LIMIT_SECONDS = 60 * 60;

  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [onBreak, setOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<number | null>(null);
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  const [isCheckOut, setIsCheckOut] = useState(false)

  const [attendanceData, setAttendanceData] = useState([])


  const downloadCsv = (attendanceData: AttendanceRow[]) => {
    const headers = [
      "Index",
      "Employee",
      "Date",
      "Time In",
      "Time Out",
      "Total Hours",
      "Break In & Break Out",
      "Break Time",
      "Late"
    ];

    const rows = attendanceData.map((row, index) => {
      const breakDetails = row.breaks
        .map(b => `${b.break_in} / ${b.break_out}`)
        .join(" | ");

      return [
        index + 1,
        row.employee_name,
        row.date,
        row.time_in,
        row.time_out,
        row.total_hours,
        breakDetails,
        row.total_break_time,
        row.late ? "Yes" : "No"
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.map(String).map(v => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


 useEffect(() => {
  // Har 30 seconds me status check kare
  const interval = setInterval(() => {
    checkStatus();
  }, 30000);

  // Pehli dafa mount pe bhi check kare
  checkStatus();

  return () => clearInterval(interval);
}, []);

// ✅ Auto-checkout logic
const checkStatus = async () => {
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

          // Auto-checkout trigger (5 min = 300 seconds)
          if (elapsed >= 36000 && !isCheckOut) {
            console.log("⏳ Auto-checkout triggered after 10 minutes");
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
};



  // useEffect(() => {


  //   checkStatus();
  // }, []);

  useEffect(() => {
    if (!clockedIn || !startTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedIn, startTime]);

  useEffect(() => {
    let interval: any;
    if (onBreak && breakStartTime) {
      interval = setInterval(() => {
        setTotalBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [onBreak, breakStartTime]);

  const handleCheckIn = async () => {
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

        // ✅ Save check-in status in localStorage
        localStorage.setItem("checkedIn", "true");
        localStorage.setItem("checkInTime", now.toString());

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
  };


  useEffect(() => {
    const alreadyCheckedIn = localStorage.getItem("checkedIn") === "true";

    if (alreadyCheckedIn) {
      const savedTime = localStorage.getItem("checkInTime");
      if (savedTime) {
        setClockedIn(true);
        setStartTime(Number(savedTime));
        setElapsedSeconds(Math.floor((Date.now() - Number(savedTime)) / 1000));
      }
      return; // ✅ Skip API call if already checked in
    }

    checkStatus(); // only if not checked in
  }, []);


  const handleCheckOut = async () => {
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
        // ✅ Remove localStorage check-in data
        localStorage.removeItem("checkedIn");
        localStorage.removeItem("checkInTime");
        // alert("Clocked out!");
        setClockedIn(false);
        setStartTime(null);
        setElapsedSeconds(0);
        setTotalBreakSeconds(0);
        setOnBreak(false);
        setBreakStartTime(null);
        setIsCheckOut(true)
      } else {
        alert(data.error || "Error in time out");
      }
    } catch {
      alert("Failed to check out");
    }
  };

  const handleBreakIn = async () => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/break-in/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ employee_id: localStorage.getItem("employee_id") })
        }
      );

      const data = await res.json();

      if (res.ok) {
        const now = Date.now();
        setOnBreak(true);
        setBreakStartTime(now);

        // ✅ Save break info in localStorage
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
  };

  const handleBreakOut = async () => {
    try {
      const res = await fetch(
        "https://ukashacoder.pythonanywhere.com/api/attendance/break-out/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ employee_id: localStorage.getItem("employee_id") })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOnBreak(false);
        setBreakStartTime(null);

        // ✅ Remove break info from localStorage
        localStorage.removeItem("onBreak");
        localStorage.removeItem("breakStartTime");

        console.log("☕ Break Out");
      } else {
        alert(data.message || data.error || "Error in break out");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to mark break out");
    }
  };


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
        )
        const data = await res.json()
        setAttendanceData(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAttendanceData()
  }, [isCheckOut])

  useEffect(() => {
    const onBreakStored = localStorage.getItem("onBreak") === "true";
    if (onBreakStored) {
      const storedBreakStart = localStorage.getItem("breakStartTime");
      if (storedBreakStart) {
        setOnBreak(true);
        setBreakStartTime(Number(storedBreakStart));
      }
    }
  }, []);


  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <main className="w-full h-full flex flex-col gap-4 items-center justify-start bg-[#141D38] py-8 px-4">
      <ClockStatusCard
        elapsedSeconds={elapsedSeconds}
        totalBreakSeconds={totalBreakSeconds}
        shiftSeconds={SHIFT_SECONDS}
        breakLimitSeconds={BREAK_LIMIT_SECONDS}
        formatTime={formatTime}
      />
      <section className="flex items-center justify-between max-w-[1140px] w-full text-white mt-40">

        <div>
          {attendanceData.map((item: AttendanceData, index: number) =>
            index === 0 && (
              <span key={index}>Welcome {item.employee_name}</span>
            ))}
        </div>

        <div className="flex">
          {
            isCheckOut ? (
              <span className="text-gray-400">You are clocked out</span>
            ) : !clockedIn ? (
              <button onClick={handleCheckIn} className="bg-blue-500 text-white px-4 py-2 rounded">
                Check In
              </button>
            ) : (
              <ControlButtons
                onBreak={onBreak}
                clockedIn={clockedIn}
                handleBreakIn={handleBreakIn}
                handleBreakOut={handleBreakOut}
                handleCheckOut={handleCheckOut}
              />
            )
          }
        </div>

      </section>
      <section className="max-w-[1140px] w-full bg-white h-full p-6 rounded-lg">
        <AttendanceTable attendanceData={attendanceData} />
        <button className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light" onClick={() => downloadCsv(attendanceData)}>Download Sheet</button>
      </section>
    </main>
  );
}

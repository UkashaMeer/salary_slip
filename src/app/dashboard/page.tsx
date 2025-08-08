"use client";

import AttendanceTable from "@/components/AttendanceTable";
import ClockStatusCard from "@/components/ClockStatusCard";
import ControlButtons from "@/components/ControlButtons";
import { useState, useEffect } from "react";

interface AttendanceData {
  employee_name: string;
}

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

  useEffect(() => {
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
            break;

          case "checked_out":
            setClockedIn(false);
            setIsCheckOut(true);
            break;

          case "not_checked_in":
            setClockedIn(false);
            setIsCheckOut(false); // ✅ Important
            break;
        }
      }
    } catch (err) {
      console.log("Error checking status", err);
    }
  };

  checkStatus();
}, []);



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
        // alert("Clocked in!");
        const now = Date.now();
        setClockedIn(true);
        setStartTime(now);
      } else {
        alert(data.error || "Error in time in");
      }
    } catch {
      alert("Failed to check in");
    }
  };

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
          body: JSON.stringify({ employee_id: localStorage.getItem("employee_id") }) // ✅ Must send this
        }
      );

      const data = await res.json();
      if (res.ok) {
        // alert("Break in!");
        const now = Date.now();
        setOnBreak(true);
        setBreakStartTime(now);
        console.log('Break In', now)
      } else {
        alert(data.message || data.error || "Error in break in");
      }
    } catch (error) {
      console.log(error);
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
        // alert("Break Out!");

        setOnBreak(false);
        setBreakStartTime(null);

      } else {
        alert(data.message || data.error || "Error in break out");
      }
    } catch (error) {
      console.log(error);
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
    <main className="w-full min-h-screen flex flex-col gap-4 items-center justify-start bg-[#141D38] py-8 px-4">
      <section>
        <ClockStatusCard
          elapsedSeconds={elapsedSeconds}
          totalBreakSeconds={totalBreakSeconds}
          shiftSeconds={SHIFT_SECONDS}
          breakLimitSeconds={BREAK_LIMIT_SECONDS}
          formatTime={formatTime}
        />
      </section>
      <section className="flex items-center justify-between max-w-[1140px] w-full text-white mt-40">

        <div>
          {attendanceData.map((item: AttendanceData, index: number) => (
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
      </section>
    </main>
  );
}

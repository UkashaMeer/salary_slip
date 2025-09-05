import React, { useEffect, useState } from "react"

export function formatTimeInSeconds(totalSeconds: number) {
  if (!totalSeconds || isNaN(totalSeconds)) totalSeconds = 0;

  const seconds = Math.floor(totalSeconds);

  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return `${hrs}:${mins}:${secs}`;
}

export default function TimerCell({
  taskId,
  status,
  total_time_seconds,
}: {
  taskId: number;
  status: string;
  total_time_seconds: number;
}) {
  const baseSeconds = !isNaN(total_time_seconds)
    ? Math.floor(total_time_seconds)
    : 0;

  const [seconds, setSeconds] = useState(baseSeconds);

  useEffect(() => {
    setSeconds(baseSeconds);

    if (status === "IP") {
      const saved = localStorage.getItem(`task-timer-${taskId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startTime && parsed.resumeBase !== undefined) {
          const offset = Math.floor((Date.now() - parsed.startTime) / 1000);
          setSeconds(parsed.resumeBase + offset);
        }
      } else {
        localStorage.setItem(
          `task-timer-${taskId}`,
          JSON.stringify({ startTime: Date.now(), resumeBase: baseSeconds })
        );
      }
    } else {
      localStorage.removeItem(`task-timer-${taskId}`);
    }
  }, [taskId, baseSeconds, status]);

  useEffect(() => {
    if (status !== "IP") return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  console.log(seconds)

  return <span>{formatTimeInSeconds(seconds)}</span>;
}

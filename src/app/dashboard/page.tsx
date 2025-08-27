"use client";
import ClockStatusCard from "@/components/ClockStatusCard";
import { ATTENDANCE_CONSTANTS } from "@/components/dashbaord/constants/attendanceConstants";
import AttendanceSection from "@/components/dashbaord/components/AttendanceSection";
import DashboardHeader from "@/components/dashbaord/components/DashboardHeader";
import { useAttendanceData } from "@/components/dashbaord/hooks/useAttendanceData";
import { useAttendanceStatus } from "@/components/dashbaord/hooks/useAttendanceStatus";
import { useAttendanceTimers } from "@/components/dashbaord/hooks/useAttendanceTimers";
import { useAutoCheckout } from "@/components/dashbaord/hooks/useAutoCheckout";
import { attendanceActionsService } from "@/components/dashbaord/service/attendanceActionsService";
import { attendanceStatusService } from "@/components/dashbaord/service/attendanceStatusService";
import { localStorageService } from "@/components/dashbaord/service/localStorageService";
import { formatTime } from "@/components/dashbaord/utils/formatTime";
import React, { useEffect, useCallback } from "react";

export default function Dashboard() {
  const {
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
  } = useAttendanceStatus();

  const attendanceData = useAttendanceData({
    isCheckOut,
    setTotalBreakSeconds,
    setOnBreak,
    setBreakStartTime,
  });

  useAttendanceTimers({
    clockedIn,
    startTime,
    onBreak,
    breakStartTime,
    setElapsedSeconds,
    setTotalBreakSeconds,
  });

  const handleCheckIn = useCallback(async () => {
    await attendanceActionsService.handleCheckIn({
      setClockedIn,
      setStartTime,
      setTotalBreakSeconds,
    });
  }, [setClockedIn, setStartTime, setTotalBreakSeconds]);

  const handleCheckOut = useCallback(async () => {
    await attendanceActionsService.handleCheckOut({
      setClockedIn,
      setStartTime,
      setElapsedSeconds,
      setTotalBreakSeconds,
      setOnBreak,
      setBreakStartTime,
      setIsCheckOut,
    });
  }, [
    setClockedIn,
    setStartTime,
    setElapsedSeconds,
    setTotalBreakSeconds,
    setOnBreak,
    setBreakStartTime,
    setIsCheckOut,
  ]);

  const handleBreakIn = useCallback(async () => {
    await attendanceActionsService.handleBreakIn({
      setOnBreak,
      setBreakStartTime,
    });
  }, [setOnBreak, setBreakStartTime]);

  const handleBreakOut = useCallback(async () => {
    await attendanceActionsService.handleBreakOut({
      totalBreakSeconds,
      setOnBreak,
      setBreakStartTime,
    });
  }, [totalBreakSeconds, setOnBreak, setBreakStartTime]);

  useEffect(() => {
    attendanceStatusService.checkStatus({
      setClockedIn,
      setIsCheckOut,
      setStartTime,
      setElapsedSeconds,
      onBreak,
      isCheckOut,
      SHIFT_SECONDS: ATTENDANCE_CONSTANTS.SHIFT_SECONDS,
      handleBreakOut,
      handleCheckOut,
    });
  }, [
    setClockedIn,
    setIsCheckOut,
    setStartTime,
    setElapsedSeconds,
    onBreak,
    isCheckOut,
    handleBreakOut,
    handleCheckOut,
  ]);

  useEffect(() => {
    const hasRestoredCheckIn = localStorageService.restoreCheckInState({
      setClockedIn,
      setStartTime,
      setElapsedSeconds,
      setTotalBreakSeconds: () => { },
      setOnBreak: () => { },
      setBreakStartTime: () => { },
    });

    if (hasRestoredCheckIn) {
      localStorageService.restoreBreakState({
        setTotalBreakSeconds,
        setOnBreak,
        setBreakStartTime,
        setClockedIn: () => { },
        setStartTime: () => { },
        setElapsedSeconds: () => { },
      });
    }
  }, [setClockedIn, setStartTime, setElapsedSeconds, setTotalBreakSeconds, setOnBreak, setBreakStartTime]);

  useAutoCheckout({
    clockedIn,
    isCheckOut,
    elapsedSeconds,
    onBreak,
    SHIFT_SECONDS: ATTENDANCE_CONSTANTS.SHIFT_SECONDS,
    handleBreakOut,
    handleCheckOut,
  });

  return (
    <div className="bg-gray-50 p-4 md:p-8 rounded-sm w-full flex flex-col items-center">

        <ClockStatusCard
          elapsedSeconds={elapsedSeconds}
          totalBreakSeconds={totalBreakSeconds}
          shiftSeconds={ATTENDANCE_CONSTANTS.SHIFT_SECONDS}
          breakLimitSeconds={ATTENDANCE_CONSTANTS.BREAK_LIMIT_SECONDS}
          formatTime={formatTime}
        />

        <div className="flex flex-col w-full">
          <DashboardHeader
            attendanceData={attendanceData}
            isCheckOut={isCheckOut}
            clockedIn={clockedIn}
            onBreak={onBreak}
            handleCheckIn={handleCheckIn}
            handleBreakIn={handleBreakIn}
            handleBreakOut={handleBreakOut}
            handleCheckOut={handleCheckOut}
          />
          <AttendanceSection attendanceData={attendanceData} />
        </div>
      </div>
  );
}
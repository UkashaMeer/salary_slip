"use client"

import AttendanceCalendar from "@/components/attendance/components/attendanceCalendar"


function Attendance({ params }: { params: { attendanceId: string } }) {
  return (
        <div className="bg-gray-50 p-4 md:p-8 rounded-sm w-full flex flex-col items-center">
            <AttendanceCalendar attendanceId={params.attendanceId} />
        </div>
    )
}

export default Attendance

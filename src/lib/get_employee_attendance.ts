import { useState } from "react";

interface getEmployeeAttendance {
    attendanceId: string;
    dateRange: [string, string] | null
}

export async function get_Employee_Attendance({attendanceId, dateRange}: getEmployeeAttendance) {
    
    if(!dateRange){
        throw new Error("date is required")
    }
    
    const res = await fetch(`https://ukashacoder.pythonanywhere.com/api/attendance/${attendanceId}/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
                from_date: dateRange["0"],
                to_date: dateRange["1"]
            })
    })

    if(!res.ok){
        throw new Error(`Error: ${res.status}`)
    }

    return res.json()
}
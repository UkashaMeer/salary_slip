import { AttendanceRow } from "../../types";

export const DownloadAttendanceSheet = (attendanceData: AttendanceRow[]) => {
    const headers = [
        "Index",
        "Date",
        "Time In",
        "Time Out",
        "Total Hours",
        "Break In & Break Out",
        "Break Time",
        "Late",
        "shortShift",
        "halfDay"
    ];

    const rows = attendanceData.map((row, index) => {
        const breakDetails = row.breaks
            ? row.breaks.map(b => `${b.break_in} / ${b.break_out}`).join(" | ")
            : "—";

        return [
            index + 1,
            row.date,
            row.time_in ?? "—",
            row.time_out ?? "—",
            row.total_hours ?? "—",
            breakDetails,
            row.total_break_time ?? "—",
            row.late ? "Yes" : "No",
            row.shortShift ? "Yes" : "No",
            row.halfDay ? "Yes" : "No"
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
import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";

interface BreakItem {
  break_in: string;
  break_out: string;
}

interface AttendanceData {
  employee_name: string;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: string;
  total_break_time: string;
  late: boolean;
  halfDay: boolean;
  shortShift: boolean;
  breaks: BreakItem[];
}

interface Props {
  attendanceData: AttendanceData[];
}

const AttendanceTable: React.FC<Props> = ({ attendanceData }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // ✅ 12-hour format with AM/PM
    });
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 text-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time In</th>
            <th className="p-3 text-left">Time Out</th>
            <th className="p-3 text-left">Total Hours</th>
            <th className="p-3 text-left">Break In & Break Out</th>
            <th className="p-3 text-left">Break Time</th>
            <th className="p-3 text-left">Late?</th>
            <th className="p-3 text-left">Half Day?</th>
            <th className="p-3 text-left">Short Shift?</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((item, index) => (
            <tr
              key={index}
              className="border-t border-gray-200 hover:bg-gray-50 transition-all"
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3 capitalize">{item.employee_name}</td>
              <td className="p-3">{formatDate(item.date)}</td>
              <td className="p-3">{formatTime(item.time_in)}</td>
              <td className="p-3">{item.time_out ? formatTime(item.time_out) : "-"}</td>
              <td className="p-3">{item.total_hours || "-"}</td>
              <td className="p-3">
                <Dialog>
                  <DialogTrigger>
                      <button className="flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light">View Break</button>
                  </DialogTrigger>
                  <DialogContent>
                    {item.breaks && item.breaks.length > 0 ? (
                      <div className="space-y-1">
                        <h1>All Breaks</h1>
                        {item.breaks.map((br, i) => (
                          <div key={i}>
                            {i + 1}st Break:{" "}
                            {br.break_in ? formatTime(br.break_in) : "-"} -{" "}
                            {br.break_out ? formatTime(br.break_out) : "-"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </DialogContent>
                </Dialog>
              </td>
              <td className="p-3">{item.total_break_time || "-"}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${item.late ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                  {item.late ? "Yes" : "No"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${item.halfDay ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                  {item.halfDay ? "Yes" : "No"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${item.shortShift ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                  {item.shortShift ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;

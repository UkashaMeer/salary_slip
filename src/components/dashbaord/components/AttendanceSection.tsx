import React from "react";
import AttendanceTable from "@/components/AttendanceTable";
import { DownloadAttendanceSheet } from "@/components/dashbaord/features/download-attendance-data-slip";
import { AttendanceData } from "@/components/types";

interface AttendanceSectionProps {
  attendanceData: AttendanceData[];
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ attendanceData }) => {
  return (
    <section className="w-full bg-white h-full mt-4 rounded-lg">
      <AttendanceTable attendanceData={attendanceData} />
      <button 
        className="mt-4 flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light" 
        onClick={() => DownloadAttendanceSheet(attendanceData)}
      >
        Download Sheet
      </button>
    </section>
  );
};

export default AttendanceSection;
import React from "react";
import { AttendanceData } from "@/components/types";

interface WelcomeHeaderProps {
  attendanceData: AttendanceData[];
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ attendanceData }) => {
  return (
    <div>
      {attendanceData.map((item: AttendanceData, index: number) =>
        index === 0 && (
          <span key={index} className="text-black">Welcome {item?.employee_name}</span>
        )
      )}
    </div>
  );
};

export default WelcomeHeader;
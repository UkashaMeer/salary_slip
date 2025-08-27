import React from "react";
import WelcomeHeader from "./WelcomeHeader";
import AttendanceActions from "./AttendanceActions";
import { AttendanceData } from "@/components/types";

interface DashboardHeaderProps {
  attendanceData: AttendanceData[];
  isCheckOut: boolean;
  clockedIn: boolean;
  onBreak: boolean;
  handleCheckIn: () => Promise<void>;
  handleBreakIn: () => Promise<void>;
  handleBreakOut: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  attendanceData,
  isCheckOut,
  clockedIn,
  onBreak,
  handleCheckIn,
  handleBreakIn,
  handleBreakOut,
  handleCheckOut,
}) => {
  return (
    <section className="flex items-center justify-between w-full text-white mt-12">
      <WelcomeHeader attendanceData={attendanceData} />
      
      <div className="flex">
        <AttendanceActions
          isCheckOut={isCheckOut}
          clockedIn={clockedIn}
          onBreak={onBreak}
          handleCheckIn={handleCheckIn}
          handleBreakIn={handleBreakIn}
          handleBreakOut={handleBreakOut}
          handleCheckOut={handleCheckOut}
        />
      </div>
    </section>
  );
};

export default DashboardHeader;
import AttendanceTable from '@/components/AttendanceTable';
import { DownloadAttendanceSheet } from '@/components/dashbaord/features/download-attendance-data-slip';
import { get_Employee_Attendance } from '@/lib/get_employee_attendance';
import { DatePicker, Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useState } from 'react';
import { toast } from 'sonner';

const { RangePicker } = DatePicker;

interface AttendanceIdProps {
  attendanceId: string
}

export default function AttendanceCalendar({ attendanceId }: AttendanceIdProps) {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [name, setName] = useState()

  const onDateRangeChange: RangePickerProps["onChange"] = (_dates, dateString) => {
    setDateRange(dateString as [string, string])
  }

  const handleGetEmployeeAttendance = async () => {
    if (!dateRange) return
    try {
      const res = await get_Employee_Attendance({ attendanceId, dateRange })
      setAttendanceData(res.attendance)
      const capitalizeName = res.employee_data[0].name.charAt(0).toUpperCase() + res.employee_data[0].name.slice(1).toLowerCase()
      setName(capitalizeName)
    } catch (err) {
      toast.error(`Error: ${err}`)
    }
  }

  return (
    <div className='w-full flex  flex-col gap-4 items-start'>
      <div className='flex items-center justify-between w-full'>
        <RangePicker onChange={onDateRangeChange} />
        <button className='flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light cursor-pointer' onClick={handleGetEmployeeAttendance}>Get Attendance</button>
      </div>
      {name && (
        <span>Employee Name: {name}</span>
      )}
      <AttendanceTable attendanceData={attendanceData} />
      {
        attendanceData.length !== 0 && (
          <button
            className="mt-4 flex items-center justify-between bg-[#141D38] p-2 rounded-sm text-white text-sm font-light cursor-pointer"
            onClick={() => DownloadAttendanceSheet(attendanceData)}
          >
            Download Sheet
          </button>
        )
      }
    </div>
  )
}

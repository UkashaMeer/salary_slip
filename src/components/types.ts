export type SignInFlow = "signIn" | "signUp";

export interface AttendanceData {
  employee_name: string;
}

type BreakTime = {
  break_in: string;
  break_out: string;
};

export type AttendanceRow = {
  date: string;
  time_in: string;
  time_out: string;
  total_hours: string;
  late: boolean;
  shortShift: boolean;
  halfDay: boolean;
  breaks: BreakTime[];
  total_break_time: string;
};

export interface FormData {
  employee_id?: string;
  salary: string;
  absents: string;
  short_shift: string;
  late: string;
  half_day: string;
}

export interface ApiResponse {
  message: string;
  data: {
    employee_name: number;
    original_salary: number;
    salary_per_day: number;
    deduction_days: number;
    final_salary: number;
  };
}

export interface AttendanceDataT {
  date: string;
  time_in: string;
  time_out: string;
  total_hours: string;
  total_break_time: string;
  late: boolean;
  halfDay: boolean;
  shortShift: boolean;
  breaks: BreakTime[];
}

export interface Props {
  attendanceData: AttendanceDataT[];
}


export interface ClockStatusCardProps {
  elapsedSeconds: number;
  totalBreakSeconds: number;
  shiftSeconds: number;
  breakLimitSeconds: number;
  formatTime: (s: number) => string;
}

export interface ControlButtonsProps {
  onBreak: boolean;
  clockedIn: boolean;
  handleBreakIn: () => void;
  handleBreakOut: () => void;
  handleCheckOut: () => void;
}

export type Leave = {
    id: number;
    date: string;
    reason: string;
    email: string;
    status: string;
    rejection_reason: string
};

export type LeaveTableProps = {
    handleLeave: (id: number, status: string) => void; // function ka type
};

export type OptionType = {
    id: string; 
    value: string;
    label: string;
    salary: string;
}

export type Employee = {
  id: string
  name: string
  email: string
  salary: string
  phone: string
  cnic: string
  address: string
}

export type EditDialogProps = {
  openEditDialog: boolean
  setOpenEditDialog: (open: boolean) => void
  handleUpdate: () => void
  editName: string
  editEmail: string
  editSalary: string
  editPhone: string
  editCnic: string
  editAddress: string
  setEditName: (val: string) => void
  setEditEmail: (val: string) => void
  setEditSalary: (val: string) => void
  setEditPhone: (val: string) => void
  setEditCnic: (val: string) => void
  setEditAddress: (val: string) => void
}

export interface ViewDialogProps {
  openViewsDialog: boolean
  setOpenViewDialog: (open: boolean) => void
  selectedUser: Employee | null
}

export interface DeleteDialogProps {
  openDeleteDialog: boolean
  setOpenDeleteDialog: (open: boolean) => void
  selectedUser: Employee | null
  handleDelete: () => void
}

export type leavesDataProps = {
  id: string;
  employee__id: string;
  employee__name: string;
  date: string;
  reason: string;
  email: string;
  status: "P" | "A" | "R";
  rejection_reason: string
}

export interface AllLeavesDataProps {
  leavesData: leavesDataProps[]
}

export interface Task {
  id: string
  employee_id?: string
  employee_name?: string
  title: string
  start_date: string
  end_date: string
  task_priority: "C" | "H" | "M" | "L" | "" | string
  status: "NS" | "IP" | "OH" | "CP" | "CN" | "" | string
  description: string
  total_time_seconds: string | number
}

export interface AllTasksProps {
  tasksData: Task[]
  handleDeleteTask: (
    taskid: number | string,
    setOpenDeletedConfirmModel: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void> | void
  handleUpdateTask: (
    task: Task,
    setSelectedTask: React.Dispatch<React.SetStateAction<Task>>,
    setOpenEditModel: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void> | void
}

export interface CreateTaskPayload {
  employee__id: string
  title: string
  start_date: string
  end_date: string
  task_priority: "C" | "H" | "M" | "L"
  description: string
}

export type SignInFlow = "signIn" | "signUp";

export interface AttendanceData {
  employee_name: string;
}

type BreakTime = {
  break_in: string;
  break_out: string;
};

export type AttendanceRow = {
  employee_name: string;
  date: string;
  time_in: string;
  time_out: string;
  total_hours: string;
  late: boolean;
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
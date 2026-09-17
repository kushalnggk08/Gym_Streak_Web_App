export type AttendanceStatus = "completed" | "laziness" | "valid" | "rest" | "none";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  accountabilityTaskCompleted?: boolean;
}

export interface AppData {
  startDate: string | null;
  records: Record<string, DayRecord>;
}

export type Screen = "home" | "30days" | "progress" | "settings";

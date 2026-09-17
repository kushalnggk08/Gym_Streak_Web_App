import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { AppData, AttendanceStatus, DayRecord } from "../types";

const STORAGE_KEY = "gym_streak_data";

export function useGymStreak() {
  const [data, setData] = useState<AppData | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      const initialData: AppData = {
        startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
        records: {},
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      setData(initialData);
    }
  }, []);

  const updateRecord = (dateStr: string, status: AttendanceStatus, accountabilityTaskCompleted?: boolean) => {
    if (!data) return;
    
    const newRecords = { ...data.records };
    if (status === "none") {
      delete newRecords[dateStr];
    } else {
      newRecords[dateStr] = {
        date: dateStr,
        status,
        ...(accountabilityTaskCompleted !== undefined && { accountabilityTaskCompleted }),
      };
    }

    const newData = { ...data, records: newRecords };
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const resetData = () => {
    const initialData: AppData = {
      startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
      records: {},
    };
    setData(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  };

  return { data, updateRecord, resetData };
}

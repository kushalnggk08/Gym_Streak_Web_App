import { format, differenceInDays, parseISO, isBefore, isEqual, addDays } from "date-fns";
import { AppData, AttendanceStatus } from "../types";

export interface Stats {
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  lazinessMisses: number;
  validReasons: number;
  restDays: number;
  completionPercentage: number;
}

export function calculateStats(data: AppData, todayStr: string): Stats {
  if (!data || !data.startDate) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalCompleted: 0,
      lazinessMisses: 0,
      validReasons: 0,
      restDays: 0,
      completionPercentage: 0,
    };
  }

  let currentStreak = 0;
  let bestStreak = 0;
  let totalCompleted = 0;
  let lazinessMisses = 0;
  let validReasons = 0;
  let restDays = 0;

  const startDate = parseISO(data.startDate);
  const today = parseISO(todayStr);

  let tempStreak = 0;
  let totalValidDaysToCount = 0;

  for (let i = 0; i < 30; i++) {
    const currentDay = addDays(startDate, i);
    const dateStr = format(currentDay, "yyyy-MM-dd");
    
    // We only process days up to today for most stats, but we need to check records
    const isPastOrToday = isBefore(currentDay, today) || isEqual(currentDay, today);
    
    const record = data.records[dateStr];
    
    // Streak logic goes backwards from today to find current streak
    if (record) {
      if (record.status === "completed") totalCompleted++;
      if (record.status === "laziness") lazinessMisses++;
      if (record.status === "valid") validReasons++;
      if (record.status === "rest") restDays++;
    }

    if (isPastOrToday) {
        // Count for completion percentage
        totalValidDaysToCount++;
        
        // Let's recalculate streak properly: 
        // 1. completed = +1
        // 2. rest, valid = +0, continues streak
        // 3. laziness, none (if past day) = reset
        if (record?.status === "completed") {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else if (record?.status === "rest" || record?.status === "valid") {
            // continues
        } else {
            tempStreak = 0; // reset on laziness or unrecorded past day
        }
    }
  }

  // To find CURRENT streak accurately from today backwards
  currentStreak = 0;
  for (let i = 0; ; i++) {
    const currentDay = addDays(today, -i);
    // Don't count before start date
    if (isBefore(currentDay, startDate)) break;

    const dateStr = format(currentDay, "yyyy-MM-dd");
    const record = data.records[dateStr];

    if (record?.status === "completed") {
        currentStreak++;
    } else if (record?.status === "rest" || record?.status === "valid") {
        // continues
    } else {
        // miss or unrecorded
        // If today is unrecorded, we don't break the streak *yet*, unless it's past today
        if (i !== 0) {
           break;
        }
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // Completion percentage
  const totalCompletedAndRest = totalCompleted + restDays + validReasons; // Maybe just completed? "completion percentage" usually means days we succeeded out of required.
  // Wait, if I have 4 completed and 1 valid out of 5 days.
  // Let's just use completed / (totalValidDaysToCount - restDays - validReasons)
  let percentage = 0;
  const requiredDays = totalValidDaysToCount - validReasons - restDays;
  if (requiredDays > 0) {
      percentage = Math.round((totalCompleted / requiredDays) * 100);
  } else if (totalCompleted > 0) {
      percentage = 100;
  }

  return {
    currentStreak,
    bestStreak,
    totalCompleted,
    lazinessMisses,
    validReasons,
    restDays,
    completionPercentage: Math.min(100, Math.max(0, percentage)),
  };
}

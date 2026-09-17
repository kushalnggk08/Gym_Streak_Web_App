import { format, parseISO, addDays, isBefore, isEqual, isAfter, startOfDay } from "date-fns";
import { AppData } from "../types";
import { WORKOUT_SCHEDULE } from "../data";
import { cn } from "../lib/utils";
import { Check, X, Info, Moon } from "lucide-react";

interface ThirtyDaysScreenProps {
  data: AppData;
}

export function ThirtyDaysScreen({ data }: ThirtyDaysScreenProps) {
  if (!data.startDate) return null;

  const startDate = parseISO(data.startDate);
  const today = startOfDay(new Date());

  const days = Array.from({ length: 30 }).map((_, i) => {
    const date = addDays(startDate, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = format(date, "EEEE") as keyof typeof WORKOUT_SCHEDULE;
    const workout = WORKOUT_SCHEDULE[dayOfWeek];
    const record = data.records[dateStr];
    
    let status = record?.status || "none";
    let isFuture = isAfter(date, today);

    // If no record and it's Sunday, default to rest (visually, or logic)
    // Actually the prompt says "Start with all days uncompleted except the appropriate Sunday rest days."
    if (status === "none" && dayOfWeek === "Sunday") {
        status = "rest";
    }

    return {
      dayNumber: i + 1,
      date,
      dateStr,
      dayOfWeek,
      workout,
      status,
      isFuture,
    };
  });

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="pt-8 pb-2">
        <h2 className="text-xl font-black tracking-widest text-white">30 DAYS</h2>
      </div>

      <div className="space-y-3 pb-8">
        {days.map((day) => {
          
          let bgColor = "bg-neutral-900 border-neutral-800";
          let textColor = "text-neutral-500";
          let icon = null;
          let statusText = "";

          if (day.status === "completed") {
            bgColor = "bg-green-500/10 border-green-500/30";
            textColor = "text-green-500";
            icon = <Check size={16} />;
            statusText = "COMPLETED";
          } else if (day.status === "laziness") {
            bgColor = "bg-red-500/10 border-red-500/30";
            textColor = "text-red-500";
            icon = <X size={16} />;
            statusText = "MISSED (LAZINESS)";
          } else if (day.status === "valid") {
            bgColor = "bg-yellow-500/10 border-yellow-500/30";
            textColor = "text-yellow-500";
            icon = <Info size={16} />;
            statusText = "VALID REASON";
          } else if (day.status === "rest") {
            bgColor = "bg-neutral-800 border-neutral-700 opacity-70";
            textColor = "text-neutral-400";
            icon = <Moon size={16} />;
            statusText = "REST DAY";
          } else if (day.isFuture) {
            bgColor = "bg-neutral-900/50 border-neutral-800 border-dashed opacity-50";
            textColor = "text-neutral-600";
            statusText = "FUTURE";
          } else {
            // Past missed day (not recorded but passed)
            bgColor = "bg-neutral-900 border-neutral-800";
            textColor = "text-neutral-500";
            statusText = "NOT COMPLETED";
            icon = <span className="w-4 h-4 border border-neutral-600 rounded-sm inline-block" />;
          }

          return (
            <div 
              key={day.dayNumber}
              className={cn(
                "flex items-center p-4 rounded-xl border transition-all",
                bgColor
              )}
            >
              <div className="flex flex-col items-center justify-center min-w-[50px] mr-4 border-r border-neutral-800/50 pr-4">
                <span className="text-xs font-bold text-neutral-500 tracking-widest">DAY</span>
                <span className="text-xl font-black tabular-nums">{day.dayNumber.toString().padStart(2, '0')}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">{format(day.date, "EEE")}</span>
                  <span className="text-xs text-neutral-600">•</span>
                  <span className="text-xs text-neutral-500">{format(day.date, "MMM d")}</span>
                </div>
                <div className="font-bold text-sm text-white mb-2 leading-tight">
                  {day.workout.title}
                </div>
                <div className={cn("flex items-center space-x-1 text-[10px] font-bold tracking-widest uppercase", textColor)}>
                  {icon}
                  <span>{statusText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

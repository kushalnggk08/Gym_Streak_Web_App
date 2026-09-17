import { useState } from "react";
import { format, parseISO, isBefore, addDays } from "date-fns";
import { WORKOUT_SCHEDULE } from "../data";
import { AppData, AttendanceStatus } from "../types";
import { calculateStats } from "../lib/stats";
import { Dialog } from "../components/Dialog";
import { Check, X, Info, Moon, Activity, Flame, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

interface HomeScreenProps {
  data: AppData;
  updateRecord: (dateStr: string, status: AttendanceStatus, accountabilityTaskCompleted?: boolean) => void;
}

export function HomeScreen({ data, updateRecord }: HomeScreenProps) {
  const [isMissedDialogOpen, setIsMissedDialogOpen] = useState(false);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);

  const todayDate = new Date();
  const todayStr = format(todayDate, "yyyy-MM-dd");
  const dayOfWeek = format(todayDate, "EEEE") as keyof typeof WORKOUT_SCHEDULE;
  
  const todayWorkout = WORKOUT_SCHEDULE[dayOfWeek];
  const todayRecord = data.records[todayStr];
  const stats = calculateStats(data, todayStr);

  // Check Never Miss Twice
  let isComebackDay = false;
  if (data.startDate) {
    const yesterdayDate = addDays(todayDate, -1);
    const yesterdayStr = format(yesterdayDate, "yyyy-MM-dd");
    const yesterdayRecord = data.records[yesterdayStr];
    if (yesterdayRecord?.status === "laziness" && (!todayRecord || todayRecord.status === "none")) {
        isComebackDay = true;
    }
  }

  const handleStatusSelect = (status: AttendanceStatus) => {
    if (status === "laziness" || status === "valid") {
      // Handled via dialog
      return;
    }
    updateRecord(todayStr, status);
  };

  const handleMissedReason = (reason: "laziness" | "valid") => {
    updateRecord(todayStr, reason, false); // Initialize task as incomplete if laziness
    setIsMissedDialogOpen(false);
  };

  const handleCompleteTask = () => {
    updateRecord(todayStr, "laziness", true);
  };

  const resetToday = () => {
    updateRecord(todayStr, "none");
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-2xl font-black tracking-widest text-white">GYM STREAK</h1>
        <p className="text-neutral-400 text-sm tracking-wide mt-1 italic">"Consistency beats motivation."</p>
      </div>

      {/* Today Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="text-neutral-500 text-xs font-bold tracking-widest mb-1 uppercase">
          Today • {format(todayDate, "MMM d, yyyy")}
        </div>
        
        {isComebackDay && (
           <div className="mb-2 text-orange-500 font-bold tracking-wide animate-pulse">
             COMEBACK DAY 🔥
           </div>
        )}

        <button 
          onClick={() => setIsWorkoutDialogOpen(true)}
          className="text-left w-full group"
        >
          <div className="text-xl font-bold text-white group-hover:text-neutral-300 transition-colors flex items-center justify-between">
            {todayWorkout.title}
            <Info size={18} className="text-neutral-500" />
          </div>
        </button>
      </div>

      {/* Streak prominently */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg">
        <div className="flex items-center space-x-2 text-orange-500 mb-2">
          <Flame size={24} className="fill-orange-500/20" />
          <span className="font-bold tracking-widest">CURRENT STREAK</span>
        </div>
        <div className="text-5xl font-black tabular-nums tracking-tight">
          {stats.currentStreak} <span className="text-xl text-neutral-500 font-bold">DAYS</span>
        </div>
        {todayRecord?.status === "completed" && isComebackDay && (
          <div className="mt-4 text-sm text-green-400 font-bold tracking-widest">STREAK RESTORED.</div>
        )}
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Activity size={20} className="text-green-500 mb-2" />
          <div className="text-2xl font-black tabular-nums">{stats.totalCompleted}</div>
          <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">Completed<br/>This Month</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <Trophy size={20} className="text-blue-500 mb-2" />
          <div className="text-2xl font-black tabular-nums">{stats.completionPercentage}%</div>
          <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">Completion<br/>Rate</div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 pb-8">
        {!todayRecord || todayRecord.status === "none" ? (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleStatusSelect("completed")}
              className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-colors"
            >
              <Check size={24} />
              <span className="font-bold text-xs tracking-wider">COMPLETED</span>
            </button>
            <button 
              onClick={() => setIsMissedDialogOpen(true)}
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-colors"
            >
              <X size={24} />
              <span className="font-bold text-xs tracking-wider">MISSED</span>
            </button>
            <button 
              onClick={() => updateRecord(todayStr, "valid")}
              className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-colors"
            >
              <Info size={24} />
              <span className="font-bold text-xs tracking-wider">VALID REASON</span>
            </button>
            <button 
              onClick={() => updateRecord(todayStr, "rest")}
              className="bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-colors"
            >
              <Moon size={24} />
              <span className="font-bold text-xs tracking-wider">REST DAY</span>
            </button>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center space-y-4">
            <div className="text-xs text-neutral-500 font-bold tracking-widest uppercase mb-2">Today's Status</div>
            
            {todayRecord.status === "completed" && (
              <div className="text-xl font-black text-green-500 tracking-wide flex items-center justify-center space-x-2">
                <Check size={24} />
                <span>GYM COMPLETED</span>
              </div>
            )}
            
            {todayRecord.status === "valid" && (
              <div className="text-xl font-black text-yellow-500 tracking-wide flex items-center justify-center space-x-2">
                <Info size={24} />
                <span>VALID REASON</span>
              </div>
            )}
            
            {todayRecord.status === "rest" && (
              <div className="text-xl font-black text-neutral-400 tracking-wide flex items-center justify-center space-x-2">
                <Moon size={24} />
                <span>REST DAY</span>
              </div>
            )}

            {todayRecord.status === "laziness" && (
              <div className="space-y-4">
                <div className="text-xl font-black text-red-500 tracking-wide">
                  YOU MISSED TODAY.
                </div>
                <p className="text-sm text-neutral-400 font-medium">
                  "Don't let one missed workout become a missed week."
                </p>
                
                {!todayRecord.accountabilityTaskCompleted ? (
                  <div className="mt-6 bg-black border border-neutral-800 rounded-xl p-4 text-left">
                    <div className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-2">Accountability Task</div>
                    <div className="text-white font-medium mb-4">Prepare your gym clothes tonight.</div>
                    <button 
                      onClick={handleCompleteTask}
                      className="w-full bg-white text-black font-bold py-3 rounded-lg text-sm hover:bg-neutral-200 transition-colors"
                    >
                      MARK TASK COMPLETE
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-green-500 font-bold flex items-center justify-center space-x-1">
                    <Check size={16} />
                    <span>TASK COMPLETED</span>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={resetToday}
              className="text-xs text-neutral-500 underline underline-offset-4 hover:text-white transition-colors mt-4 block mx-auto"
            >
              Edit Status
            </button>
          </div>
        )}
      </div>

      {/* Missed Dialog */}
      <Dialog 
        isOpen={isMissedDialogOpen} 
        onClose={() => setIsMissedDialogOpen(false)}
        title="Why did you miss today?"
      >
        <div className="space-y-2">
          <button onClick={() => handleMissedReason("laziness")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">😭</span>
            <span>Laziness</span>
          </button>
          <button onClick={() => handleMissedReason("valid")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">📚</span>
            <span>College / Academics</span>
          </button>
          <button onClick={() => handleMissedReason("valid")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">🤒</span>
            <span>Sick</span>
          </button>
          <button onClick={() => handleMissedReason("valid")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">🩹</span>
            <span>Injury</span>
          </button>
          <button onClick={() => handleMissedReason("valid")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">👨‍👩‍👦</span>
            <span>Personal reason</span>
          </button>
          <button onClick={() => handleMissedReason("valid")} className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left font-medium transition-colors flex items-center space-x-3">
            <span className="text-xl">💬</span>
            <span>Other (Valid)</span>
          </button>
        </div>
      </Dialog>

      {/* Workout Dialog */}
      <Dialog 
        isOpen={isWorkoutDialogOpen} 
        onClose={() => setIsWorkoutDialogOpen(false)}
        title={`${dayOfWeek.toUpperCase()} — ${todayWorkout.title.toUpperCase()}`}
      >
        {todayWorkout.exercises.length > 0 ? (
          <ul className="space-y-3">
            {todayWorkout.exercises.map((ex, i) => (
              <li key={i} className="flex flex-col bg-black border border-neutral-800 rounded-lg p-3">
                <span className="font-bold text-sm">{ex.split(' — ')[0]}</span>
                <span className="text-neutral-400 text-xs mt-1">{ex.split(' — ')[1]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-neutral-400 py-8 font-medium">
            Take a well-deserved break today.
          </div>
        )}
      </Dialog>
    </div>
  );
}

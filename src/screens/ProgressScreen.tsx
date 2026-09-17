import { format } from "date-fns";
import { AppData } from "../types";
import { calculateStats } from "../lib/stats";
import { Flame, Trophy, Activity, X, Info, Moon } from "lucide-react";

interface ProgressScreenProps {
  data: AppData;
}

export function ProgressScreen({ data }: ProgressScreenProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const stats = calculateStats(data, todayStr);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="pt-8 pb-2">
        <h2 className="text-xl font-black tracking-widest text-white">PROGRESS</h2>
      </div>

      {/* Main Progress Ring */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
        
        <div className="text-xs text-neutral-500 font-bold tracking-widest uppercase mb-6 relative z-10">
          Month 1 Progress
        </div>
        
        <div className="relative flex items-center justify-center mb-6 z-10">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              className="text-neutral-800"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r="80"
              cx="96"
              cy="96"
            />
            <circle
              className="text-blue-500 transition-all duration-1000 ease-out"
              strokeWidth="12"
              strokeDasharray={80 * 2 * Math.PI}
              strokeDashoffset={80 * 2 * Math.PI - (stats.completionPercentage / 100) * (80 * 2 * Math.PI)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="80"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black tabular-nums">{stats.completionPercentage}%</span>
          </div>
        </div>

        <p className="text-neutral-400 text-sm font-medium italic text-center relative z-10">
          "Forget perfection. Focus on showing up."
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Current Streak</div>
            <div className="text-xl font-black">{stats.currentStreak}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
            <Trophy size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Best Streak</div>
            <div className="text-xl font-black">{stats.bestStreak}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Completed</div>
            <div className="text-xl font-black">{stats.totalCompleted}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
            <X size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Laziness Misses</div>
            <div className="text-xl font-black">{stats.lazinessMisses}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
            <Info size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Valid Reasons</div>
            <div className="text-xl font-black">{stats.validReasons}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="bg-neutral-800 p-2 rounded-lg text-neutral-400">
            <Moon size={20} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Rest Days</div>
            <div className="text-xl font-black">{stats.restDays}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

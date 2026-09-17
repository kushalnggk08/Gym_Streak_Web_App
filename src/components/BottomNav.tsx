import { Screen } from "../types";
import { Home, CalendarDays, BarChart2, Settings } from "lucide-react";
import { cn } from "../lib/utils";

interface BottomNavProps {
  currentScreen: Screen;
  setScreen: (s: Screen) => void;
}

export function BottomNav({ currentScreen, setScreen }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "HOME", icon: Home },
    { id: "30days", label: "30 DAYS", icon: CalendarDays },
    { id: "progress", label: "PROGRESS", icon: BarChart2 },
    { id: "settings", label: "SETTINGS", icon: Settings },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id as Screen)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

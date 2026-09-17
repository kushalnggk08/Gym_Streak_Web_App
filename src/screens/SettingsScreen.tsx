import { useState } from "react";
import { AppData, Screen } from "../types";
import { Dialog } from "../components/Dialog";
import { ChevronRight, Trash2 } from "lucide-react";

interface SettingsScreenProps {
  resetData: () => void;
  setScreen: (s: Screen) => void;
}

export function SettingsScreen({ resetData, setScreen }: SettingsScreenProps) {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleReset = () => {
    resetData();
    setIsResetDialogOpen(false);
    setScreen("home");
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="pt-8 pb-2">
        <h2 className="text-xl font-black tracking-widest text-white">SETTINGS</h2>
      </div>

      <div className="space-y-6 pb-8">
        
        {/* Section 1 */}
        <div>
          <div className="text-xs text-neutral-500 font-bold tracking-widest uppercase mb-3 px-2">Program</div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-medium text-neutral-300">GYM STREAK</span>
              <span className="text-sm font-bold text-white bg-neutral-800 px-2 py-1 rounded">v1.0</span>
            </div>
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-medium text-neutral-300">Month</span>
              <span className="text-sm font-bold text-white">Month 1</span>
            </div>
            <button 
              onClick={() => setScreen("30days")}
              className="w-full p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors text-left"
            >
              <span className="font-medium text-neutral-300">Workout schedule</span>
              <div className="flex items-center space-x-2 text-neutral-500">
                <span className="text-sm">View</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <div className="text-xs text-neutral-500 font-bold tracking-widest uppercase mb-3 px-2">Data</div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setIsResetDialogOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors text-left"
            >
              <span className="font-medium text-red-500">Reset 30-Day Program</span>
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Reset Program"
      >
        <div className="space-y-6">
          <p className="text-neutral-300 font-medium leading-relaxed">
            Are you sure? This will permanently delete your current Month 1 progress.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsResetDialogOpen(false)}
              className="p-3 rounded-xl bg-neutral-800 text-white font-bold tracking-wide hover:bg-neutral-700 transition-colors"
            >
              CANCEL
            </button>
            <button 
              onClick={handleReset}
              className="p-3 rounded-xl bg-red-500 text-white font-bold tracking-wide hover:bg-red-600 transition-colors"
            >
              RESET
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

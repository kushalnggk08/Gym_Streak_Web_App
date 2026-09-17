import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Screen } from "../types";

interface LayoutProps {
  children: ReactNode;
  currentScreen: Screen;
  setScreen: (s: Screen) => void;
}

export function Layout({ children, currentScreen, setScreen }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <main className="max-w-md mx-auto min-h-screen pb-20 relative">
        {children}
      </main>
      <BottomNav currentScreen={currentScreen} setScreen={setScreen} />
    </div>
  );
}

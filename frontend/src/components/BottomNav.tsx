/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Home, Users, CalendarCheck, BarChart2, Settings as SettingsIcon, Plus } from "lucide-react";
import { ActiveTab } from "../types";

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMarkAttendance: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMarkAttendance,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around px-2 z-50 shadow-[0_-4px_20px_0_rgba(99,102,241,0.1)] pb-safe">
      {/* Home */}
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "dashboard"
            ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === "dashboard" ? "fill-current" : ""}`} />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Students / Schedule */}
      <button
        onClick={() => setActiveTab("students")}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "students" || activeTab === "profile"
            ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <Users className={`w-5 h-5 ${activeTab === "students" ? "fill-current" : ""}`} />
        <span className="text-[10px]">Students</span>
      </button>

      {/* Center Floating (+) Mark Attendance Button */}
      <div className="relative -top-5">
        <button
          onClick={() => {
            setActiveTab("mark");
            onOpenMarkAttendance();
          }}
          className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-transform duration-200"
          title="Mark Attendance"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Stats / Analytics */}
      <button
        onClick={() => setActiveTab("analytics")}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "analytics"
            ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <BarChart2 className={`w-5 h-5 ${activeTab === "analytics" ? "fill-current" : ""}`} />
        <span className="text-[10px]">Analytics</span>
      </button>

      {/* Settings */}
      <button
        onClick={() => setActiveTab("settings")}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === "settings"
            ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <SettingsIcon className="w-5 h-5" />
        <span className="text-[10px]">Settings</span>
      </button>
    </nav>
  );
};

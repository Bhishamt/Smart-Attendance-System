/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Calendar,
  BarChart3,
  Settings as SettingsIcon,
  User,
  LogOut,
  CloudCheck,
} from "lucide-react";
import { ActiveTab, SettingsState } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: SettingsState;
  onOpenDrive: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenDrive,
  onLogout,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "mark", label: "Attendance", icon: CalendarCheck },
    { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
    { id: "history", label: "Calendar History", icon: Calendar },
    { id: "settings", label: "Settings & Cloud Sync", icon: SettingsIcon },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 p-4 justify-between">
      {/* Navigation Links */}
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === "students" && activeTab === "profile");
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "gradient-bg text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Cloud Storage Status Card & Logout */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Cloud Storage Status Banner */}
        <div
          onClick={onOpenDrive}
          className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 cursor-pointer hover:border-indigo-300 transition-colors group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <CloudCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Cloud Storage Sync
            </span>
            <span className={`w-2 h-2 rounded-full ${settings.connectedDriveAccount ? "bg-emerald-500" : "bg-amber-500"}`} />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
            {settings.connectedDriveAccount
              ? settings.connectedDriveAccount.email
              : "Click to connect backup"}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};


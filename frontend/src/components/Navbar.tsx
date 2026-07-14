/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GraduationCap, Bell, Sparkles, Cloud, CloudCheck, LogOut, Settings as SettingsIcon } from "lucide-react";
import { ActiveTab, SettingsState } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: SettingsState;
  onOpenAi: () => void;
  onOpenDrive: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenAi,
  onOpenDrive,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text block leading-tight">
                Smart Attendance
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Institute Portal
              </span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 border border-indigo-200 dark:border-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-all active:scale-95 shadow-sm"
            title="AI Attendance Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-600" />
            <span className="hidden md:inline">AI Assistant</span>
          </button>

          {/* Cloud Storage Status Pill */}
          <button
            onClick={onOpenDrive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm ${
              settings.connectedDriveAccount
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
            title="Cloud Storage Cloud Sync"
          >
            {settings.connectedDriveAccount ? (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Drive Synced</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Backup Off</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h4>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full dark:bg-indigo-900/50 dark:text-indigo-300">
                    2 New
                  </span>
                </div>
                <div className="space-y-3 mt-3 max-h-64 overflow-y-auto">
                  <div className="flex gap-3 text-xs p-2 rounded-xl bg-indigo-50/50 dark:bg-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Attendance Warning</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Karan Singh dropped below 70% attendance in Computer Science - 3B.
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">10 min ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Drive Auto-Backup</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Daily attendance snapshot successfully synced to Cloud Storage.
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">1 hr ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-600/30">
                <img
                  src="https://ui-avatars.com/api/?name=User&background=random"
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-bold text-sm text-slate-800 dark:text-white">Admin Workspace</p>
                  <p className="text-xs text-slate-500 truncate">admin@institute.edu</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab("settings");
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-500" />
                  Settings & Cloud Backup
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


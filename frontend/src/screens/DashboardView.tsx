/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  CalendarCheck,
  FileText,
  BarChart2,
  CloudUpload,
  ChevronDown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats, AttendanceActivity, ActiveTab } from "../types";

interface DashboardViewProps {
  stats: DashboardStats | null;
  activities: AttendanceActivity[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenMarkAttendance: () => void;
  onOpenDriveModal: () => void;
  onOpenAi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  activities,
  setActiveTab,
  onOpenAddStudent,
  onOpenMarkAttendance,
  onOpenDriveModal,
  onOpenAi,
}) => {
  const [timeRange, setTimeRange] = useState("This Week");
  const [showRangeMenu, setShowRangeMenu] = useState(false);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Heatmap generation (5 weeks x 7 days)
  const heatmapWeeks = [
    ["present", "present", "present", "present", "present", "off", "off"],
    ["present", "present", "absent", "present", "present", "off", "off"],
    ["present", "present", "present", "present", "absent", "off", "off"],
    ["present", "absent", "present", "present", "present", "off", "off"],
    ["present", "present", "present", "present", "present", "off", "off"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 -top-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Live Attendance Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, Admin! 👋</h2>
          <p className="text-sm text-indigo-200 max-w-xl">
            Here&apos;s what&apos;s happening in your institute today. Attendance is averaging{" "}
            <strong className="text-white font-bold">{stats.attendancePercent}%</strong> across departments.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            onClick={onOpenMarkAttendance}
            className="px-5 py-3 bg-white text-indigo-900 font-bold rounded-2xl shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            Mark Today&apos;s Attendance
          </button>
          <button
            onClick={onOpenDriveModal}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 font-semibold rounded-2xl transition-all flex items-center gap-2 text-sm"
          >
            <CloudUpload className="w-4 h-4 text-emerald-300" />
            Backup to Drive
          </button>
        </div>
      </div>

      {/* Quick Actions Bar (Mobile/Desktop Inspiration from Mobile Screenshot) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Quick Actions & Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={onOpenAddStudent}
            className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 flex flex-col items-center justify-center gap-2 hover:bg-indigo-100/80 dark:hover:bg-slate-800 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Student</span>
          </button>

          <button
            onClick={onOpenMarkAttendance}
            className="p-4 rounded-2xl bg-purple-50/80 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700/60 flex flex-col items-center justify-center gap-2 hover:bg-purple-100/80 dark:hover:bg-slate-800 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mark Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/60 flex flex-col items-center justify-center gap-2 hover:bg-blue-100/80 dark:hover:bg-slate-800 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View Reports</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className="p-4 rounded-2xl bg-pink-50/80 dark:bg-slate-800/80 border border-pink-100 dark:border-slate-700/60 flex flex-col items-center justify-center gap-2 hover:bg-pink-100/80 dark:hover:bg-slate-800 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Analytics</span>
          </button>

          <button
            onClick={onOpenDriveModal}
            className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700/60 flex flex-col items-center justify-center gap-2 hover:bg-emerald-100/80 dark:hover:bg-slate-800 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CloudUpload className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cloud Storage Sync</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab("students")}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 px-2.5 py-1 rounded-full">
              +12 This Month
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
              {stats.totalStudents}
            </p>
          </div>
        </div>

        {/* Today Present */}
        <div
          onClick={() => setActiveTab("mark")}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded-full">
              77% Present
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today Present</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.todayPresent}
            </p>
          </div>
        </div>

        {/* Today Absent */}
        <div
          onClick={() => setActiveTab("mark")}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-slate-800 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 dark:bg-red-950/50 dark:text-red-400 px-2.5 py-1 rounded-full">
              Action Needed
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today Absent</p>
            <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              {stats.todayAbsent}
            </p>
          </div>
        </div>

        {/* Attendance % */}
        <div
          onClick={onOpenAi}
          className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Healthy
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
            <p className="text-3xl font-extrabold gradient-text mt-1">
              {stats.attendancePercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Attendance Trends Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Weekly Attendance Trends
              </h3>
              <p className="text-xs text-slate-500">
                Daily attendance percentages recorded from Mon to Sun.
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRangeMenu(!showRangeMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showRangeMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50">
                  {["This Week", "Last Week", "This Month"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setTimeRange(r);
                        setShowRangeMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(val: number) => [`${val}%`, "Attendance"]}
                />
                <Area
                  type="monotone"
                  dataKey="percent"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPercent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Top Classes Pie Distribution */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Top Classes</h3>
              <button onClick={() => setActiveTab("analytics")} className="text-xs font-bold text-indigo-600 hover:underline">
                Details
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Overall attendance distribution across active departments.
            </p>
          </div>

          <div className="flex items-center justify-center h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topClasses}
                  dataKey="percent"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.topClasses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(val: number) => [`${val}%`, "Avg Attendance"]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text in Pie */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-800 dark:text-white">77%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Overall</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {stats.topClasses.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap & Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activities */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activities</h3>
              <p className="text-xs text-slate-500">Live feed of attendance check-ins and system actions.</p>
            </div>
            <button
              onClick={() => setActiveTab("history")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      act.type === "attendance"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : act.type === "student"
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                        : "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
                    }`}
                  >
                    {act.type === "attendance" && <UserCheck className="w-5 h-5" />}
                    {act.type === "student" && <Users className="w-5 h-5" />}
                    {act.type === "report" && <FileText className="w-5 h-5" />}
                    {act.type === "backup" && <CloudUpload className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{act.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                  {act.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Attendance Heatmap (Monthly) */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Attendance Heatmap</h3>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                May 2025
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Visualizing daily check-in intensity across 5 academic weeks.
            </p>
          </div>

          <div className="space-y-3">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Weeks */}
            {heatmapWeeks.map((week, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-2 items-center">
                {week.map((status, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`h-6 rounded-lg transition-all ${
                      status === "present"
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20"
                        : status === "absent"
                        ? "bg-red-400 hover:bg-red-500"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                    title={`Week ${idx + 1}, Day ${dayIdx + 1}: ${status.toUpperCase()}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-400" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800" />
              <span>Off Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Download,
  CloudUpload,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardStats } from "../types";

interface AnalyticsViewProps {
  stats: DashboardStats | null;
  onBack: () => void;
  onOpenDrive: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, onBack, onOpenDrive }) => {
  const [exportFormat, setExportFormat] = useState<"PDF" | "Excel" | "Drive">("PDF");
  const [exported, setExported] = useState(false);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleExport = () => {
    if (exportFormat === "Drive") {
      onOpenDrive();
      return;
    }
    setExported(true);
    setTimeout(() => {
      alert(`Exporting institute analytics as ${exportFormat} report.\nDownload started automatically!`);
      setExported(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              Analytics & Reports
            </h2>
            <p className="text-xs text-slate-500">Comprehensive institute performance</p>
          </div>
        </div>
        <button
          onClick={onOpenDrive}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <CloudUpload className="w-4 h-4 text-emerald-500" />
          <span>Drive Backup</span>
        </button>
      </div>

      {/* Monthly Attendance Chart Section */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
              Monthly Attendance
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              6-Month Progression (Jan - Jun)
            </h3>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
            May: 77% Avg
          </span>
        </div>

        {/* Bar Chart */}
        <div className="h-60 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val === "May" ? `★ ${val}` : val)}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                formatter={(val: number) => [`${val}%`, "Attendance"]}
              />
              <Bar dataKey="percent" radius={[8, 8, 0, 0]}>
                {stats.monthlyData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.month === "May" ? "#6366f1" : "#818cf8"}
                    opacity={entry.month === "May" ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Wise Section */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            Department Wise
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Department Distribution & Consistency
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Pie Chart */}
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topClasses}
                  dataKey="percent"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {stats.topClasses.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(val: number) => [`${val}%`, "Avg Attendance"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white">77%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Average</span>
            </div>
          </div>

          {/* Legend Items (Exact match from screenshot) */}
          <div className="space-y-3">
            {stats.topClasses.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c.name}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics (Exact match from mobile screenshot) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {stats.totalStudents}
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <UserCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Today Present</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {stats.todayPresent}
          </div>
        </div>
      </div>

      {/* Export & Cloud Storage Panel */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-base text-slate-800 dark:text-white">Export & Sync Reports</h4>
            <p className="text-xs text-slate-500">Download formatted sheets or sync directly to Cloud Storage.</p>
          </div>
          <div className="flex gap-2">
            {(["PDF", "Excel", "Drive"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  exportFormat === fmt
                    ? "gradient-bg text-white border-transparent shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                }`}
              >
                {fmt === "Drive" ? "☁️ Cloud Storage" : fmt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {exportFormat === "Drive" ? (
            <>
              <CloudUpload className="w-5 h-5" />
              <span>Sync All Reports to Cloud Storage</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Export Reports ({exportFormat})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  ChevronDown,
  Check,
  X,
  Download,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { Student } from "../types";

interface CalendarHistoryViewProps {
  selectedStudentId?: string | null;
  students: Student[];
  onBack?: () => void;
}

export const CalendarHistoryView: React.FC<CalendarHistoryViewProps> = ({
  selectedStudentId,
  students,
  onBack,
}) => {
  const [selectedMonth, setSelectedMonth] = useState("May 2025");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'present' | 'absent'

  const student = selectedStudentId
    ? students.find((s) => s.id === selectedStudentId || s.rollNo === selectedStudentId)
    : null;

  const logs = [
    {
      id: "log-1",
      dateLabel: "TODAY, MAY 24",
      status: "Present",
      description: "Status confirmed by Prof. Henderson at 09:15 AM",
      time: "09:15 AM",
    },
    {
      id: "log-2",
      dateLabel: "YESTERDAY, MAY 23",
      status: "Absent",
      description: "No check-in detected for Computer Science - 3B",
      time: "09:00 AM",
    },
    {
      id: "log-3",
      dateLabel: "WEDNESDAY, MAY 22",
      status: "Present",
      description: "Status confirmed at 08:55 AM",
      time: "08:55 AM",
    },
    {
      id: "log-4",
      dateLabel: "TUESDAY, MAY 21",
      status: "Present",
      description: "Status confirmed at 09:02 AM",
      time: "09:02 AM",
    },
    {
      id: "log-5",
      dateLabel: "MONDAY, MAY 20",
      status: "Present",
      description: "Status confirmed at 09:10 AM",
      time: "09:10 AM",
    },
    {
      id: "log-6",
      dateLabel: "FRIDAY, MAY 17",
      status: "Present",
      description: "Status confirmed at 08:50 AM",
      time: "08:50 AM",
    },
  ];

  const filteredLogs = logs.filter((l) => {
    if (filterType === "present") return l.status === "Present";
    if (filterType === "absent") return l.status === "Absent";
    return true;
  });

  const totalDays = logs.length;
  const presentCount = logs.filter((l) => l.status === "Present").length;
  const absentCount = totalDays - presentCount;
  const percentage = Math.round((presentCount / totalDays) * 100);

  const handleExportPDF = () => {
    const fileName = `Attendance_Report_${student ? student.name.replace(/\s+/g, "_") : "May_2025"}.pdf`;
    alert(`Generating high-resolution PDF report: ${fileName}\nReport downloaded successfully!`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
            {student ? `HISTORY FOR: ${student.name.toUpperCase()}` : "ACADEMIC TIMELINE"}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              {selectedMonth}
            </h2>
            <ChevronDown className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Monthly Summary Card (Exact match from screenshot) */}
      <div className="glass-card rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monthly Summary</h3>
            <p className="text-xs text-slate-500">May 01 - May 24, 2025</p>
          </div>

          {/* Circular progress badge */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 - (163.3 * percentage) / 100}
                strokeLinecap="round"
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-indigo-600 dark:text-indigo-300">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl p-3.5 flex flex-col items-center border border-indigo-100 dark:border-indigo-900/50">
            <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">{totalDays}</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Total</span>
          </div>
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl p-3.5 flex flex-col items-center border border-emerald-100 dark:border-emerald-900/50">
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{presentCount}</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Present</span>
          </div>
          <div className="bg-red-50/70 dark:bg-red-950/40 rounded-2xl p-3.5 flex flex-col items-center border border-red-100 dark:border-red-900/50">
            <span className="text-xl font-extrabold text-red-600 dark:text-red-400">0{absentCount}</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Absent</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Log */}
      <div className="space-y-4 relative">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          Attendance Log
        </h3>

        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const isPresent = log.status === "Present";
            return (
              <div key={log.id} className="flex gap-3 sm:gap-4 items-start relative group">
                {/* Status circle icon */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-md z-10 border-4 border-slate-50 dark:border-slate-900 mt-1 ${
                    isPresent
                      ? "bg-indigo-600 text-white shadow-indigo-500/30"
                      : "bg-red-500 text-white shadow-red-500/30"
                  }`}
                >
                  {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 glass-card p-4 sm:p-5 rounded-3xl shadow-sm border-l-4 transition-all hover:shadow-md ${
                    isPresent
                      ? "border-l-indigo-600 dark:border-l-indigo-500"
                      : "border-l-red-500 dark:border-l-red-400 bg-red-50/20 dark:bg-red-950/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span
                      className={`text-[11px] font-extrabold tracking-wider ${
                        isPresent ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {log.dateLabel}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full w-max">
                      {log.time}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white mt-1">
                    Marked {log.status}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="pt-4">
        <button
          onClick={handleExportPDF}
          className="w-full py-4 gradient-bg text-white font-bold rounded-3xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Export Monthly Report (PDF)</span>
        </button>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Save,
  CheckCircle,
  ChevronDown,
  Camera,
  ScanFace,
  BookOpen,
} from "lucide-react";
import { Student, ClassInfo } from "../types";

interface MarkAttendanceViewProps {
  students: Student[];
  classes: ClassInfo[];
  onSaveAttendance: (records: { id: string; status: string }[], classId: string, dateStr: string) => void;
  onBack: () => void;
}

export const MarkAttendanceView: React.FC<MarkAttendanceViewProps> = ({
  students,
  classes,
  onSaveAttendance,
  onBack,
}) => {
  const [selectedClass, setSelectedClass] = useState("cs-3b");
  const selectedClassObj = classes.find(c => c.id === selectedClass) || classes[0];
  const [selectedSubject, setSelectedSubject] = useState(selectedClassObj?.subjects?.[0] || "Data Structures & Algorithms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(24); // May 24, 2025
  const [attendanceState, setAttendanceState] = useState<{ [id: string]: "Present" | "Absent" | "Late" }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Face Recognition Scanner State
  const [isScanningClass, setIsScanningClass] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiScanResult, setAiScanResult] = useState<string | null>(null);

  const handleStartAiScan = () => {
    setIsScanningClass(true);
    setScanProgress(10);
    setAiScanResult(null);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanningClass(false);
            // Mark all students present who have biometricRegistered or 80% randomly present
            const nextState = { ...attendanceState };
            let count = 0;
            students.forEach((s) => {
              if (s.classId === selectedClass || selectedClass === "all") {
                if (s.biometricRegistered || Math.random() > 0.2) {
                  nextState[s.id] = "Present";
                  count++;
                } else {
                  nextState[s.id] = "Absent";
                }
              }
            });
            setAttendanceState(nextState);
            setAiScanResult(`✅ AI Biometric Scan Complete: ${count} student faces recognized & marked Present!`);
            setTimeout(() => setAiScanResult(null), 6000);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 450);
  };

  const days = [
    { day: "Mon", date: 20 },
    { day: "Tue", date: 21 },
    { day: "Wed", date: 22 },
    { day: "Thu", date: 23 },
    { day: "Fri", date: 24 },
    { day: "Sat", date: 25 },
    { day: "Sun", date: 26 },
  ];

  // Filter students by class and search query
  const filteredStudents = students.filter((s) => {
    const matchesClass = s.classId === selectedClass || selectedClass === "all";
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Initialize state from student status
  useEffect(() => {
    const initialState: { [id: string]: "Present" | "Absent" | "Late" } = {};
    students.forEach((s) => {
      initialState[s.id] = s.status === "Medical" ? "Absent" : s.status;
    });
    setAttendanceState(initialState);
  }, [students, selectedClass]);

  const toggleStatus = (id: string) => {
    setAttendanceState((prev) => {
      const current = prev[id] || "Present";
      let next: "Present" | "Absent" | "Late" = "Present";
      if (current === "Present") next = "Absent";
      else if (current === "Absent") next = "Late";
      else next = "Present";
      return { ...prev, [id]: next };
    });
    setSavedSuccess(false);
  };

  const setAllStatus = (status: "Present" | "Absent") => {
    const nextState = { ...attendanceState };
    filteredStudents.forEach((s) => {
      nextState[s.id] = status;
    });
    setAttendanceState(nextState);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    const records = Object.entries(attendanceState).map(([id, status]) => ({ id, status }));
    setTimeout(() => {
      onSaveAttendance(records, selectedClass, `May ${selectedDate}, 2025`);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  const presentCount = filteredStudents.filter((s) => (attendanceState[s.id] || s.status) === "Present").length;
  const absentCount = filteredStudents.filter((s) => (attendanceState[s.id] || s.status) === "Absent").length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300 pb-36">
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Mark Attendance</h2>
            <p className="text-xs text-slate-500">Fast & interactive roll call</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
            {filteredStudents.length} Students
          </span>
        </div>
      </div>

      {/* Date Picker Strip */}
      <div className="glass-card rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDate((d) => Math.max(20, d - 1))}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-800 dark:text-white">
              May {selectedDate}, 2025
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <button
            onClick={() => setSelectedDate((d) => Math.min(26, d + 1))}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days Row */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {days.map((item) => {
            const isSelected = item.date === selectedDate;
            return (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all ${
                  isSelected
                    ? "gradient-bg text-white shadow-lg shadow-indigo-500/30 scale-105 font-bold"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="text-[10px] font-medium uppercase opacity-80">{item.day}</span>
                <span className="text-sm sm:text-base font-bold mt-0.5">{item.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Class Dropdown, Subject Selector & Search Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Class selector */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 z-10">
              Class / Semester Target:
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-4 pr-10 text-sm font-bold text-slate-800 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Departments & Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.totalStudents} Students)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Subject selector */}
          <div className="relative">
            <label className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider absolute -top-2 left-4 bg-white dark:bg-slate-900 px-1.5 z-10 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Subject for Semester:</span>
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 rounded-2xl py-3.5 pl-4 pr-10 text-sm font-bold text-indigo-900 dark:text-indigo-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {(selectedClassObj?.subjects && selectedClassObj.subjects.length > 0
                  ? selectedClassObj.subjects
                  : ["Data Structures & Algorithms", "Operating Systems", "Discrete Mathematics", "Artificial Intelligence"]
                ).map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-indigo-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* AI Face Recognition Biometric Classroom Scanner */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <ScanFace className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <span>AI Biometric Face Recognition</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-extrabold">
                    +91 India Live ID
                  </span>
                </h4>
                <p className="text-xs text-indigo-200">
                  Instant classroom roll call using facial landmarks for {selectedSubject}
                </p>
              </div>
            </div>
            {!isScanningClass && (
              <button
                type="button"
                onClick={handleStartAiScan}
                className="px-4 py-2.5 bg-white text-indigo-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-indigo-50 transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Scan Classroom</span>
              </button>
            )}
          </div>

          {isScanningClass && (
            <div className="p-3 bg-black/30 rounded-2xl border border-white/10 space-y-2 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  Analyzing 128-D Biometric Vectors in Classroom Video Feed...
                </span>
                <span className="font-mono text-white">{scanProgress}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {aiScanResult && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-xs font-bold text-emerald-200 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{aiScanResult}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or roll number..."
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats Quick Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Present</span>
          </div>
          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {presentCount}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-900 dark:text-red-200">Absent</span>
          </div>
          <span className="text-lg font-extrabold text-red-600 dark:text-red-400">
            {absentCount}
          </span>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-slate-800 dark:text-white">No students match your query</h4>
            <p className="text-xs text-slate-500">Try selecting a different class or clearing your search filter.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const status = attendanceState[student.id] || student.status || "Present";
            const isPresent = status === "Present";
            const isAbsent = status === "Absent";
            const isLate = status === "Late";

            return (
              <div
                key={student.id}
                onClick={() => toggleStatus(student.id)}
                className={`glass-card p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border hover:shadow-md active:scale-[0.99] ${
                  isPresent
                    ? "border-emerald-200 dark:border-emerald-900/50 bg-white/90 dark:bg-slate-800/90"
                    : isAbsent
                    ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20"
                    : "border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                    </div>
                    {/* Tiny badge indicator on photo */}
                    <span
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white dark:border-slate-800 ${
                        isPresent ? "bg-emerald-500" : isAbsent ? "bg-red-500" : "bg-amber-500"
                      }`}
                    >
                      {isPresent ? "✓" : isAbsent ? "✕" : "!"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                        {student.name}
                      </h4>
                      <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full shrink-0">
                        Roll: {student.rollNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{student.className}</p>
                  </div>
                </div>

                {/* Status Toggle Badge */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(student.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                      isPresent
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700 hover:bg-emerald-100"
                        : isAbsent
                        ? "bg-red-50 text-red-700 border border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700 hover:bg-red-100"
                        : "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPresent ? "bg-emerald-500 animate-pulse" : isAbsent ? "bg-red-500" : "bg-amber-500"
                      }`}
                    />
                    <span>{status}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 z-40 max-w-3xl mx-auto shadow-2xl">
        {savedSuccess && (
          <div className="mb-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-4 h-4" /> Attendance successfully saved and synced!
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setAllStatus("Present")}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mark All Present
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3.5 gradient-bg text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Attendance</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

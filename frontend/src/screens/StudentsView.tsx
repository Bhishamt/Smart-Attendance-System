/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Plus, Filter, ChevronRight, User, Mail, Phone, Award, School, ScanFace, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { Student, ClassInfo } from "../types";

interface StudentsViewProps {
  students: Student[];
  classes: ClassInfo[];
  currentUser: { email: string, role: string } | null;
  onSelectStudent: (id: string) => void;
  onApproveStudent: (id: string) => void;
  onOpenAddStudent: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  currentUser,
  onSelectStudent,
  onApproveStudent,
  onOpenAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const pendingStudents = students.filter(s => s.approved === false);
  const activeStudents = students.filter(s => s.approved !== false);

  const filteredStudents = activeStudents.filter((s) => {
    const matchesClass = selectedClass === "all" || s.classId === selectedClass;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Directory</h2>
          <p className="text-xs text-slate-500">
            Managing <strong className="text-indigo-600 dark:text-indigo-400">{activeStudents.length} active students</strong> across {classes.length} departments.
          </p>
        </div>
        <button
          onClick={onOpenAddStudent}
          className="px-5 py-3 gradient-bg text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Pending Approvals Section */}
      {currentUser?.role !== "Student" && pendingStudents.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Pending Approvals ({pendingStudents.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingStudents.map(student => (
              <div key={student.id} className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{student.name}</h4>
                    <p className="text-[10px] text-slate-500">{student.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => onApproveStudent(student.id)}
                  className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
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

        {/* Department Filter */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Departments & Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Grid of Students */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 mx-auto flex items-center justify-center text-indigo-600">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-lg text-slate-800 dark:text-white">No students match your criteria</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your department filter or searching for a different roll number.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedClass("all");
            }}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-100"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isHigh = student.attendancePercent >= 85;
            const isMed = student.attendancePercent >= 75 && student.attendancePercent < 85;
            const isLow = student.attendancePercent < 75;

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="glass-card rounded-3xl p-5 hover:shadow-lg transition-all cursor-pointer group border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-500/20 shadow-sm group-hover:scale-105 transition-transform">
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                            student.status === "Present"
                              ? "bg-emerald-500"
                              : student.status === "Absent"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                          title={`Status: ${student.status}`}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {student.name}
                        </h4>
                        <span className="inline-block text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full mt-1">
                          Roll No: {student.rollNo}
                        </span>
                      </div>
                    </div>

                    {/* Attendance Percentage Badge */}
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          isHigh
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : isMed
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse"
                        }`}
                      >
                        {student.attendancePercent}%
                      </span>
                      <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">Attendance</span>
                    </div>
                  </div>

                  {/* Info list */}
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 truncate">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{student.className}</span>
                    </div>
                    {student.subject && (
                      <div className="flex items-center gap-2 truncate text-indigo-600 dark:text-indigo-400 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{student.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono">{student.phone}</span>
                    </div>
                    {student.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                    )}
                    {student.biometricRegistered && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <ScanFace className="w-3.5 h-3.5" />
                        <span>Face Recognition Biometric ID</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-500" />
                    {student.presentDays} Days Present
                  </span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


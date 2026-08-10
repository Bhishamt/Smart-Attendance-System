/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Award,
  School,
  ScanFace,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  CheckSquare,
  Square,
  Users,
  BarChart3,
  XCircle,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Student, ClassInfo } from "../types";
import { exportStudentsToCSV } from "../utils/csvExport";

interface StudentsViewProps {
  students: Student[];
  classes: ClassInfo[];
  currentUser: { email: string; role: string } | null;
  onSelectStudent: (id: string) => void;
  onApproveStudent: (id: string) => void;
  onOpenAddStudent: () => void;
  onBulkStatusUpdate?: (studentIds: string[], status: Student["status"]) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  currentUser,
  onSelectStudent,
  onApproveStudent,
  onOpenAddStudent,
  onBulkStatusUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "rollNo" | "attendancePercent" | "presentDays">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(6);

  const availableSubjects = Array.from(
    new Set(students.map((s) => s.subject).filter(Boolean) as string[])
  );

  const pendingStudents = students.filter((s) => s.approved === false);
  const activeStudents = students.filter((s) => s.approved !== false);

  const filteredStudents = activeStudents.filter((s) => {
    const matchesClass = selectedClass === "all" || s.classId === selectedClass;
    const matchesStatus = selectedStatus === "all" || s.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSubject = selectedSubject === "all" || (s.subject && s.subject.toLowerCase() === selectedSubject.toLowerCase());
    const matchesRisk = !showAtRiskOnly || s.attendancePercent < 75;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.subject && s.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.phone && s.phone.includes(searchQuery));
    return matchesClass && matchesStatus && matchesSubject && matchesRisk && matchesSearch;
  });

  const sortedFilteredStudents = [...filteredStudents].sort((a, b) => {
    const orderMultiplier = sortOrder === "desc" ? -1 : 1;
    switch (sortBy) {
      case "rollNo": {
        const numA = parseInt(a.rollNo, 10);
        const numB = parseInt(b.rollNo, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return (numA - numB) * orderMultiplier;
        }
        return a.rollNo.localeCompare(b.rollNo) * orderMultiplier;
      }
      case "attendancePercent":
        return (a.attendancePercent - b.attendancePercent) * orderMultiplier;
      case "presentDays":
        return (a.presentDays - b.presentDays) * orderMultiplier;
      case "name":
      default:
        return a.name.localeCompare(b.name) * orderMultiplier;
    }
  });

  const totalItems = sortedFilteredStudents.length;
  const effectiveLimit = itemsPerPage === "all" ? Math.max(1, totalItems) : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectiveLimit));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * effectiveLimit;
  const endIndex = itemsPerPage === "all" ? totalItems : Math.min(startIndex + effectiveLimit, totalItems);
  const paginatedStudents = sortedFilteredStudents.slice(
    startIndex,
    itemsPerPage === "all" ? undefined : startIndex + effectiveLimit
  );

  const presentCount = filteredStudents.filter((s) => s.status === "Present").length;
  const absentCount = filteredStudents.filter((s) => s.status === "Absent").length;
  const lateCount = filteredStudents.filter((s) => s.status === "Late").length;
  const medicalCount = filteredStudents.filter((s) => s.status === "Medical").length;
  const avgAttendance = filteredStudents.length
    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.attendancePercent, 0) / filteredStudents.length)
    : 0;

  const allFilteredSelected =
    filteredStudents.length > 0 && filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkStatus = (status: Student["status"]) => {
    if (selectedStudentIds.length === 0) return;
    if (onBulkStatusUpdate) {
      onBulkStatusUpdate(selectedStudentIds, status);
      setSelectedStudentIds([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300 pb-32 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Directory</h2>
          <p className="text-xs text-slate-500">
            Managing <strong className="text-indigo-600 dark:text-indigo-400">{activeStudents.length} active students</strong> across {classes.length} departments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shrink-0 shadow-sm border border-slate-200 dark:border-slate-700"
            title="Download CSV Report"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddStudent}
            className="px-5 py-3 gradient-bg text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Attendance Summary Analytics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Listed</span>
            <div className="text-lg font-extrabold text-slate-800 dark:text-white">{filteredStudents.length}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Present</span>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{presentCount}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Absent / Medical</span>
            <div className="text-lg font-extrabold text-red-600 dark:text-red-400">{absentCount + medicalCount}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Attendance</span>
            <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{avgAttendance}%</div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      {currentUser?.role !== "Student" && pendingStudents.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Pending Approvals ({pendingStudents.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingStudents.map((student) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, email, subject, or phone..."
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
        <div className="sm:col-span-3 relative">
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

        {/* Subject Filter */}
        <div className="sm:col-span-3 relative">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Medical">Medical</option>
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort By Selector */}
        <div className="sm:col-span-2 relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="rollNo">Sort by Roll No</option>
            <option value="attendancePercent">Sort by Attendance %</option>
            <option value="presentDays">Sort by Present Days</option>
          </select>
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Order Toggle */}
        <div className="sm:col-span-1.5 flex items-center">
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="w-full py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            title={`Toggle sort direction (currently ${sortOrder === "asc" ? "Ascending" : "Descending"})`}
          >
            <ArrowUpDown className="w-4 h-4 shrink-0" />
            <span>{sortOrder === "asc" ? "Asc" : "Desc"}</span>
          </button>
        </div>

        {/* At Risk Quick Filter */}
        <div className="sm:col-span-1.5 flex items-center">
          <button
            type="button"
            onClick={() => setShowAtRiskOnly(!showAtRiskOnly)}
            className={`w-full py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
              showAtRiskOnly
                ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20"
                : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
            title="Filter students with attendance < 75%"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>At Risk</span>
          </button>
        </div>

        {/* Select All Toggle */}
        <div className="sm:col-span-1.5 flex items-center">
          <button
            onClick={toggleSelectAll}
            className={`w-full py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              allFilteredSelected
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            {allFilteredSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span>{allFilteredSelected ? "Deselect" : "Select All"}</span>
          </button>
        </div>

      </div>

      {/* Floating Batch Action Toolbar */}
      {selectedStudentIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-5 py-3.5 rounded-3xl shadow-2xl flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 max-w-full">
          <span className="text-xs font-extrabold bg-indigo-600 px-3 py-1 rounded-full shrink-0">
            {selectedStudentIds.length} Selected
          </span>

          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleApplyBulkStatus("Present")}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Present</span>
            </button>
            <button
              onClick={() => handleApplyBulkStatus("Absent")}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Mark Absent</span>
            </button>
            <button
              onClick={() => handleApplyBulkStatus("Late")}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mark Late</span>
            </button>
            <button
              onClick={() => handleApplyBulkStatus("Medical")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Medical Leave</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />

          <button
            onClick={() => setSelectedStudentIds([])}
            className="text-xs text-slate-400 hover:text-white font-bold underline px-2 py-1 shrink-0"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Grid of Students */}
      {sortedFilteredStudents.length === 0 ? (
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
              setSelectedStatus("all");
            }}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl hover:bg-indigo-100"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedStudents.map((student) => {
              const isHigh = student.attendancePercent >= 85;
              const isMed = student.attendancePercent >= 75 && student.attendancePercent < 85;
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <div
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className={`glass-card rounded-3xl p-5 hover:shadow-lg transition-all cursor-pointer group border flex flex-col justify-between relative ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => toggleSelectStudent(student.id, e)}
                          className="text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform p-0.5"
                          title={isSelected ? "Deselect student" : "Select student"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 fill-indigo-600 text-white dark:fill-indigo-500 dark:text-slate-900" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                          )}
                        </button>

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

                      {/* Attendance Percentage & Risk Level Badge */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
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
                        <span
                          className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                            student.attendancePercent < 60
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              : student.attendancePercent < 75
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : student.attendancePercent < 85
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {student.attendancePercent < 60
                            ? "Critical Risk"
                            : student.attendancePercent < 75
                            ? "High Risk"
                            : student.attendancePercent < 85
                            ? "Moderate"
                            : "Good"}
                        </span>
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

          {/* Interactive Pagination Bar */}
          {totalItems > 0 && (
            <div className="mt-6 glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>
                  Showing <strong className="text-slate-800 dark:text-white font-bold">{startIndex + 1}</strong> to{" "}
                  <strong className="text-slate-800 dark:text-white font-bold">{endIndex}</strong> of{" "}
                  <strong className="text-slate-800 dark:text-white font-bold">{totalItems}</strong> students
                </span>

                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                  <span className="text-slate-500">Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItemsPerPage(val === "all" ? "all" : parseInt(val, 10));
                      setCurrentPage(1);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              {itemsPerPage !== "all" && totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeCurrentPage <= 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                        pageNum === safeCurrentPage
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};


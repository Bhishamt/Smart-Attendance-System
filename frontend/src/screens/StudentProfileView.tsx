/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Edit2,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Save,
} from "lucide-react";
import { Student } from "../types";

interface StudentProfileViewProps {
  student: Student | null;
  onBack: () => void;
  onViewHistory: (studentId: string) => void;
  onUpdateStudent?: (updated: Student) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onBack,
  onViewHistory,
  onUpdateStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(student?.email || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [name, setName] = useState(student?.name || "");

  if (!student) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Student not found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const handleSaveEdit = () => {
    if (onUpdateStudent) {
      onUpdateStudent({
        ...student,
        name,
        email,
        phone,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Student Profile</h2>
        <button
          onClick={() => alert("Notification sent to " + student.name)}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Avatar & Identity Section */}
      <div className="flex flex-col items-center mt-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900/50 shadow-xl">
            <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-1 right-1 gradient-bg p-2 rounded-full text-white shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-transform"
            title="Edit Contact Info"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {isEditing ? (
          <div className="w-full mt-4 space-y-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 shadow-lg">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider text-center">Edit Identity</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-2 font-medium"
              />
            </div>
            <button
              onClick={handleSaveEdit}
              className="w-full py-2 gradient-bg text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        ) : (
          <>
            <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">{student.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">
              Roll No: {student.rollNo} | {student.className}
            </p>
            <div className="mt-3 flex flex-col items-center space-y-1">
              <a
                href={`mailto:${student.email}`}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1.5 hover:underline"
              >
                <Mail className="w-4 h-4" />
                {student.email}
              </a>
              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {student.phone}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Key Stats Section (Exact match from mobile screenshot) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-3xl flex flex-col items-center border border-indigo-100 dark:border-indigo-900/60 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            Attendance
          </span>
          <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">
            {student.attendancePercent}%
          </span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-3xl flex flex-col items-center border border-blue-100 dark:border-blue-900/60 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Classes
          </span>
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
            {student.totalClasses}
          </span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-3xl flex flex-col items-center border border-emerald-100 dark:border-emerald-900/60 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            Present
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
            {student.presentDays}
          </span>
        </div>
      </div>

      {/* Detailed Metrics List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Attendance Analysis
        </h4>

        {/* Present Days Card */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="bg-emerald-100 dark:bg-emerald-950/60 p-2.5 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Present Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Regular Attendance</p>
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-800 dark:text-white">
            {student.presentDays}
          </span>
        </div>

        {/* Absent Days Card */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="bg-red-100 dark:bg-red-950/60 p-2.5 rounded-2xl text-red-600 dark:text-red-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Absent Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Includes medical leaves</p>
            </div>
          </div>
          <span className="text-xl font-extrabold text-slate-800 dark:text-white">
            {student.absentDays}
          </span>
        </div>
      </div>

      {/* View History Button */}
      <div className="pt-4">
        <button
          onClick={() => onViewHistory(student.id)}
          className="w-full gradient-bg text-white py-4 rounded-3xl font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <span>View Attendance History</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

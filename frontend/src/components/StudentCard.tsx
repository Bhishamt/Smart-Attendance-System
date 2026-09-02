/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { User, Phone, Mail, Check, X, Clock, Eye } from "lucide-react";
import { Student } from "../types";
import { AttendanceBadge } from "./AttendanceBadge";

export interface StudentCardProps {
  student: Student;
  onMarkStatus?: (studentId: string, status: Student["status"]) => void;
  onViewProfile?: (studentId: string) => void;
  selected?: boolean;
  onToggleSelect?: (studentId: string) => void;
  className?: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onMarkStatus,
  onViewProfile,
  selected = false,
  onToggleSelect,
  className = "",
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-emerald-500";
    if (percent >= 65) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
        selected ? "ring-2 ring-indigo-500 shadow-indigo-500/10" : ""
      } ${className}`}
    >
      {/* Header section with photo, name & selection checkbox */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {student.photo ? (
            <img
              src={student.photo}
              alt={student.name}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md shadow-indigo-500/20">
              {getInitials(student.name)}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
              {student.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {student.rollNo}
              </span>
              <span>•</span>
              <span>{student.className}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(student.id)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
          )}
        </div>
      </div>

      {/* Attendance Metrics & Progress Bar */}
      <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Overall Attendance</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {student.attendancePercent}% ({student.presentDays}/{student.totalClasses})
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${student.attendancePercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${getProgressColor(student.attendancePercent)}`}
          />
        </div>
      </div>

      {/* Badges & Contact Info */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <AttendanceBadge status={student.status} size="sm" />
        <AttendanceBadge attendancePercent={student.attendancePercent} size="sm" />
      </div>

      {/* Action Footer */}
      {(onMarkStatus || onViewProfile) && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {onMarkStatus && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onMarkStatus(student.id, "Present")}
                title="Mark Present"
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onClick={() => onMarkStatus(student.id, "Absent")}
                title="Mark Absent"
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
              >
                <X size={14} />
              </button>
              <button
                type="button"
                onClick={() => onMarkStatus(student.id, "Late")}
                title="Mark Late"
                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
              >
                <Clock size={14} />
              </button>
            </div>
          )}

          {onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(student.id)}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

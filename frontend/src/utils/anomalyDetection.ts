/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from "../types";

export interface FrontendAnomalyResult {
  studentId: string;
  studentName: string;
  rollNo: string;
  className: string;
  severity: "critical" | "high" | "medium";
  anomalyType: "CRITICAL_ATTENDANCE" | "LOW_ATTENDANCE" | "UNREGISTERED_BIOMETRIC";
  summaryMessage: string;
  attendancePercent: number;
}

export function evaluateStudentAnomaly(
  student: Student,
  minThreshold = 75
): FrontendAnomalyResult | null {
  if (!student) return null;
  const attendance = typeof student.attendancePercent === "number" ? student.attendancePercent : 0;

  if (attendance < 65) {
    return {
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      className: student.className,
      severity: "critical",
      anomalyType: "CRITICAL_ATTENDANCE",
      summaryMessage: `${student.name} (${student.rollNo}) has critical attendance (${attendance}% < 65%).`,
      attendancePercent: attendance,
    };
  }

  if (attendance < minThreshold) {
    return {
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      className: student.className,
      severity: "high",
      anomalyType: "LOW_ATTENDANCE",
      summaryMessage: `${student.name} (${student.rollNo}) is below required ${minThreshold}% threshold (${attendance}%).`,
      attendancePercent: attendance,
    };
  }

  if (!student.biometricRegistered && attendance < 80) {
    return {
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      className: student.className,
      severity: "medium",
      anomalyType: "UNREGISTERED_BIOMETRIC",
      summaryMessage: `${student.name} (${student.rollNo}) requires biometric registration setup.`,
      attendancePercent: attendance,
    };
  }

  return null;
}

export function formatAnomalySeverityBadge(severity: string): { label: string; colorClass: string } {
  switch (severity) {
    case "critical":
      return { label: "CRITICAL", colorClass: "bg-red-500/20 text-red-400 border-red-500/30" };
    case "high":
      return { label: "HIGH RISK", colorClass: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    case "medium":
      return { label: "WARNING", colorClass: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    default:
      return { label: "NORMAL", colorClass: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from "../types";

export type EligibilityStatus = "ELIGIBLE" | "AT_RISK" | "INELIGIBLE";

export interface StudentForecastingSummary {
  studentId: string;
  studentName: string;
  rollNo: string;
  currentPercent: number;
  maxPossiblePercent: number;
  minPossiblePercent: number;
  minClassesToAttend: number;
  status: EligibilityStatus;
  statusMessage: string;
}

export function evaluateEligibilityStatus(
  currentPercent: number,
  maxPercent: number,
  targetThreshold = 75
): EligibilityStatus {
  if (maxPercent < targetThreshold) {
    return "INELIGIBLE";
  }
  if (currentPercent >= targetThreshold) {
    return "ELIGIBLE";
  }
  return "AT_RISK";
}

export function calculateMinRequiredClasses(
  presentDays: number,
  totalClasses: number,
  remainingClasses: number,
  targetThreshold = 75
): number {
  const safePresent = Math.max(0, presentDays || 0);
  const safeTotal = Math.max(0, totalClasses || 0);
  const safeRemaining = Math.max(0, remainingClasses || 0);
  const safeThreshold = Math.min(100, Math.max(1, targetThreshold));

  const futureTotal = safeTotal + safeRemaining;
  if (futureTotal <= 0) return 0;

  const targetPresentNeeded = Math.ceil((safeThreshold * futureTotal) / 100);
  const rawNeeded = targetPresentNeeded - safePresent;
  return Math.max(0, Math.min(safeRemaining, rawNeeded));
}

export function evaluateStudentForecasting(
  student: Student,
  remainingClasses = 10,
  targetThreshold = 75
): StudentForecastingSummary | null {
  if (!student) return null;

  const present = typeof student.presentDays === "number" ? Math.max(0, student.presentDays) : 0;
  const total = typeof student.totalClasses === "number" ? Math.max(0, student.totalClasses) : 0;
  const safeRemaining = Math.max(0, Math.round(remainingClasses));
  const safeThreshold = Math.min(100, Math.max(1, targetThreshold));

  const currentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
  const futureTotal = total + safeRemaining;
  const maxPossiblePercent = futureTotal > 0 ? Math.round(((present + safeRemaining) / futureTotal) * 100) : 0;
  const minPossiblePercent = futureTotal > 0 ? Math.round((present / futureTotal) * 100) : 0;

  const status = evaluateEligibilityStatus(currentPercent, maxPossiblePercent, safeThreshold);
  const minClassesToAttend = calculateMinRequiredClasses(present, total, safeRemaining, safeThreshold);

  let statusMessage: string;
  if (status === "ELIGIBLE") {
    statusMessage = `${student.name} is currently eligible with ${currentPercent}% attendance.`;
  } else if (status === "INELIGIBLE") {
    statusMessage = `${student.name} is ineligible. Maximum reachable attendance is ${maxPossiblePercent}%.`;
  } else {
    statusMessage = `${student.name} is at risk. Needs ${minClassesToAttend} of next ${safeRemaining} classes to reach ${safeThreshold}%.`;
  }

  return {
    studentId: student.id,
    studentName: student.name,
    rollNo: student.rollNo,
    currentPercent,
    maxPossiblePercent,
    minPossiblePercent,
    minClassesToAttend,
    status,
    statusMessage,
  };
}

export function formatEligibilityBadge(status: EligibilityStatus): { label: string; badgeClass: string } {
  switch (status) {
    case "ELIGIBLE":
      return { label: "ELIGIBLE", badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    case "AT_RISK":
      return { label: "AT RISK", badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    case "INELIGIBLE":
      return { label: "INELIGIBLE", badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
    default:
      return { label: "UNKNOWN", badgeClass: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  }
}

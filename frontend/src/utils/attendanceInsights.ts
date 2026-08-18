import { Student } from "../types";

export type RiskLevel = "Critical" | "High" | "Moderate" | "Good";

export interface StudentInsight {
  student: Student;
  riskLevel: RiskLevel;
}

export function calculateRiskLevelValue(attendancePercent: number): RiskLevel {
  if (attendancePercent < 60) return "Critical";
  if (attendancePercent < 75) return "High";
  if (attendancePercent < 85) return "Moderate";
  return "Good";
}

export function getTopPerformers(students: Student[], limit = 3): StudentInsight[] {
  const safeLimit = Math.max(0, Math.floor(limit));
  return [...students]
    .sort((a, b) => (b.attendancePercent || 0) - (a.attendancePercent || 0))
    .slice(0, safeLimit)
    .map((student) => ({ student, riskLevel: calculateRiskLevelValue(student.attendancePercent) }));
}

export function getNeedsAttention(students: Student[], threshold = 75, limit = 3): StudentInsight[] {
  const safeThreshold = isNaN(threshold) || threshold <= 0 ? 75 : threshold;
  const safeLimit = Math.max(0, Math.floor(limit));
  return [...students]
    .filter((s) => (s.attendancePercent || 0) < safeThreshold)
    .sort((a, b) => (a.attendancePercent || 0) - (b.attendancePercent || 0))
    .slice(0, safeLimit)
    .map((student) => ({ student, riskLevel: calculateRiskLevelValue(student.attendancePercent) }));
}

export interface ClassHighlights {
  classId: string;
  className: string;
  totalStudents: number;
  avgAttendancePercent: number;
  atRiskCount: number;
}

export function summarizeByClass(students: Student[]): ClassHighlights[] {
  const grouped = new Map<string, Student[]>();
  students.forEach((s) => {
    const key = s.classId || "unassigned";
    const bucket = grouped.get(key) || [];
    bucket.push(s);
    grouped.set(key, bucket);
  });

  return Array.from(grouped.entries()).map(([classId, classStudents]) => {
    const total = classStudents.length;
    const avg =
      total === 0
        ? 0
        : Math.round(classStudents.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / total);
    const atRiskCount = classStudents.filter((s) => (s.attendancePercent || 0) < 75).length;
    return {
      classId,
      className: classStudents[0]?.className || "Unassigned",
      totalStudents: total,
      avgAttendancePercent: avg,
      atRiskCount,
    };
  }).sort((a, b) => b.avgAttendancePercent - a.avgAttendancePercent);
}
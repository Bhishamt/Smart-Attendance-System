import { Student } from "../types";

export type BulkAttendanceStatus = "Present" | "Absent" | "Late" | "Medical";

export interface BulkActionSummary {
  selectedCount: number;
  status: BulkAttendanceStatus;
  message: string;
}

export function formatBulkStatusSummary(
  count: number,
  status: BulkAttendanceStatus
): string {
  if (count <= 0) return "No students selected for bulk status update.";
  const label = count === 1 ? "1 student" : `${count} students`;
  return `Successfully updated status for ${label} to ${status}.`;
}

export function filterStudentsForBulkAction(
  students: Student[],
  selectedIds: string[]
): Student[] {
  if (!Array.isArray(students) || !Array.isArray(selectedIds) || selectedIds.length === 0) {
    return [];
  }
  const idSet = new Set(selectedIds);
  return students.filter((s) => idSet.has(s.id));
}

export function calculateBulkAttendancePreview(
  selectedStudents: Student[],
  newStatus: BulkAttendanceStatus
): { totalSelected: number; affectedClassesCount: number; newAveragePercent: number } {
  if (!Array.isArray(selectedStudents) || selectedStudents.length === 0) {
    return { totalSelected: 0, affectedClassesCount: 0, newAveragePercent: 0 };
  }

  const uniqueClasses = new Set(selectedStudents.map((s) => s.classId || "unknown"));

  const projectedSum = selectedStudents.reduce((acc, s) => {
    const total = (s.totalClasses || 0) + 1;
    const present =
      newStatus === "Present" || newStatus === "Late"
        ? (s.presentDays || 0) + 1
        : s.presentDays || 0;
    return acc + Math.round((present / total) * 100);
  }, 0);

  return {
    totalSelected: selectedStudents.length,
    affectedClassesCount: uniqueClasses.size,
    newAveragePercent: Math.round(projectedSum / selectedStudents.length),
  };
}

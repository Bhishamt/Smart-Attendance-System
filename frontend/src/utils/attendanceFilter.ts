/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from "../types";

export type SortField = "name" | "rollNo" | "attendancePercent" | "totalClasses";
export type SortDirection = "asc" | "desc";

export interface PaginationResult<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

/**
 * Filter students by a search query against name, roll number, or email.
 */
export function filterStudentsBySearch(students: Student[], query: string): Student[] {
  if (!query || !query.trim()) return [...students];
  const cleaned = query.toLowerCase().trim();
  return students.filter(
    (student) =>
      student.name.toLowerCase().includes(cleaned) ||
      student.rollNo.toLowerCase().includes(cleaned) ||
      student.email.toLowerCase().includes(cleaned)
  );
}

/**
 * Filter students within an attendance percentage range [minPercent, maxPercent].
 */
export function filterStudentsByAttendanceRange(
  students: Student[],
  minPercent?: number,
  maxPercent?: number
): Student[] {
  const min = minPercent !== undefined ? Math.max(0, minPercent) : 0;
  const max = maxPercent !== undefined ? Math.min(100, maxPercent) : 100;

  return students.filter(
    (student) => student.attendancePercent >= min && student.attendancePercent <= max
  );
}

/**
 * Filter students by class ID and/or attendance status.
 */
export function filterStudentsByClassAndStatus(
  students: Student[],
  classId?: string,
  status?: Student["status"]
): Student[] {
  return students.filter((student) => {
    const matchesClass = !classId || classId === "all" || student.classId === classId;
    const matchesStatus = !status || status === student.status;
    return matchesClass && matchesStatus;
  });
}

/**
 * Sort students by a specified field and direction.
 */
export function sortStudentsByField(
  students: Student[],
  field: SortField,
  direction: SortDirection = "asc"
): Student[] {
  const modifier = direction === "desc" ? -1 : 1;
  return [...students].sort((a, b) => {
    if (field === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }
    if (field === "rollNo") {
      return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }) * modifier;
    }
    if (field === "attendancePercent") {
      return (a.attendancePercent - b.attendancePercent) * modifier;
    }
    if (field === "totalClasses") {
      return (a.totalClasses - b.totalClasses) * modifier;
    }
    return 0;
  });
}

/**
 * Paginate a list of students with page numbers and page size calculations.
 */
export function paginateStudents(
  students: Student[],
  page: number = 1,
  pageSize: number = 10
): PaginationResult<Student> {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = students.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;
  const data = students.slice(startIndex, startIndex + safePageSize);

  return {
    data,
    totalPages,
    totalItems,
    currentPage,
  };
}

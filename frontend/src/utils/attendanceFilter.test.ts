/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterStudentsBySearch,
  filterStudentsByAttendanceRange,
  filterStudentsByClassAndStatus,
  sortStudentsByField,
  paginateStudents,
} from "./attendanceFilter";
import { Student } from "../types";

const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Smith",
    rollNo: "CS101",
    classId: "c1",
    className: "Computer Science A",
    email: "alice@example.com",
    phone: "1234567890",
    attendancePercent: 92,
    totalClasses: 50,
    presentDays: 46,
    absentDays: 4,
    status: "Present",
    photo: "https://example.com/alice.jpg",
  },
  {
    id: "s2",
    name: "Bob Jones",
    rollNo: "CS102",
    classId: "c1",
    className: "Computer Science A",
    email: "bob@example.com",
    phone: "1234567891",
    attendancePercent: 68,
    totalClasses: 50,
    presentDays: 34,
    absentDays: 16,
    status: "Absent",
    photo: "https://example.com/bob.jpg",
  },
  {
    id: "s3",
    name: "Charlie Brown",
    rollNo: "CS103",
    classId: "c2",
    className: "Computer Science B",
    email: "charlie@example.com",
    phone: "1234567892",
    attendancePercent: 55,
    totalClasses: 40,
    presentDays: 22,
    absentDays: 18,
    status: "Late",
    photo: "https://example.com/charlie.jpg",
  },
  {
    id: "s4",
    name: "Diana Prince",
    rollNo: "CS104",
    classId: "c2",
    className: "Computer Science B",
    email: "diana@example.com",
    phone: "1234567893",
    attendancePercent: 80,
    totalClasses: 40,
    presentDays: 32,
    absentDays: 8,
    status: "Medical",
    photo: "https://example.com/diana.jpg",
  },
];

describe("Frontend Attendance Filter Utility Suite", () => {
  it("should filter students by search query matching name, roll number, or email", () => {
    const byName = filterStudentsBySearch(mockStudents, "alice");
    assert.equal(byName.length, 1);
    assert.equal(byName[0].id, "s1");

    const byRoll = filterStudentsBySearch(mockStudents, "CS103");
    assert.equal(byRoll.length, 1);
    assert.equal(byRoll[0].id, "s3");

    const byEmail = filterStudentsBySearch(mockStudents, "diana@example");
    assert.equal(byEmail.length, 1);
    assert.equal(byEmail[0].id, "s4");

    const emptySearch = filterStudentsBySearch(mockStudents, "");
    assert.equal(emptySearch.length, 4);
  });

  it("should filter students within attendance percentage range", () => {
    const highAttendance = filterStudentsByAttendanceRange(mockStudents, 75, 100);
    assert.equal(highAttendance.length, 2);
    assert.deepEqual(
      highAttendance.map((s) => s.id),
      ["s1", "s4"]
    );

    const lowAttendance = filterStudentsByAttendanceRange(mockStudents, 0, 70);
    assert.equal(lowAttendance.length, 2);
    assert.deepEqual(
      lowAttendance.map((s) => s.id),
      ["s2", "s3"]
    );
  });

  it("should filter students by class ID and status", () => {
    const class1Students = filterStudentsByClassAndStatus(mockStudents, "c1");
    assert.equal(class1Students.length, 2);

    const lateStudents = filterStudentsByClassAndStatus(mockStudents, undefined, "Late");
    assert.equal(lateStudents.length, 1);
    assert.equal(lateStudents[0].id, "s3");
  });

  it("should sort students by field and direction", () => {
    const sortedByNameAsc = sortStudentsByField(mockStudents, "name", "asc");
    assert.equal(sortedByNameAsc[0].name, "Alice Smith");
    assert.equal(sortedByNameAsc[3].name, "Diana Prince");

    const sortedByPercentDesc = sortStudentsByField(mockStudents, "attendancePercent", "desc");
    assert.equal(sortedByPercentDesc[0].attendancePercent, 92);
    assert.equal(sortedByPercentDesc[3].attendancePercent, 55);
  });

  it("should paginate students dataset with total pages and item counts", () => {
    const page1 = paginateStudents(mockStudents, 1, 2);
    assert.equal(page1.data.length, 2);
    assert.equal(page1.totalPages, 2);
    assert.equal(page1.totalItems, 4);
    assert.equal(page1.currentPage, 1);
    assert.equal(page1.data[0].id, "s1");

    const page2 = paginateStudents(mockStudents, 2, 2);
    assert.equal(page2.data.length, 2);
    assert.equal(page2.currentPage, 2);
    assert.equal(page2.data[0].id, "s3");
  });
});

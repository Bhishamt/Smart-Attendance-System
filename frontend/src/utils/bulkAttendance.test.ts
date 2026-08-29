import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatBulkStatusSummary,
  filterStudentsForBulkAction,
  calculateBulkAttendancePreview,
} from "./bulkAttendance.ts";
import { Student } from "../types";

describe("Frontend Bulk Attendance Utility Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "std-1",
      name: "Rohit Sharma",
      rollNo: "101",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "rohit@example.edu",
      phone: "+91 7807885427",
      attendancePercent: 77,
      totalClasses: 32,
      presentDays: 25,
      absentDays: 7,
      status: "Present",
      photo: "photo1.jpg",
    },
    {
      id: "std-2",
      name: "Aanya Verma",
      rollNo: "102",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "aanya@example.edu",
      phone: "+91 9823415678",
      attendancePercent: 91,
      totalClasses: 32,
      presentDays: 29,
      absentDays: 3,
      status: "Present",
      photo: "photo2.jpg",
    },
    {
      id: "std-3",
      name: "Karan Singh",
      rollNo: "103",
      classId: "ee-2a",
      className: "Electrical Eng - 2A",
      email: "karan@example.edu",
      phone: "+91 9876543210",
      attendancePercent: 68,
      totalClasses: 32,
      presentDays: 22,
      absentDays: 10,
      status: "Absent",
      photo: "photo3.jpg",
    },
  ];

  it("should format bulk status update summary text correctly", () => {
    assert.equal(
      formatBulkStatusSummary(1, "Present"),
      "Successfully updated status for 1 student to Present."
    );
    assert.equal(
      formatBulkStatusSummary(4, "Late"),
      "Successfully updated status for 4 students to Late."
    );
    assert.equal(
      formatBulkStatusSummary(0, "Absent"),
      "No students selected for bulk status update."
    );
  });

  it("should filter students matching selected ID array", () => {
    const selected = filterStudentsForBulkAction(mockStudents, ["std-1", "std-3"]);
    assert.equal(selected.length, 2);
    assert.equal(selected[0].name, "Rohit Sharma");
    assert.equal(selected[1].name, "Karan Singh");
  });

  it("should return empty array when filtering with invalid parameters", () => {
    const emptyResult = filterStudentsForBulkAction(mockStudents, []);
    assert.equal(emptyResult.length, 0);
  });

  it("should calculate bulk attendance projected preview metrics accurately", () => {
    const selected = [mockStudents[0], mockStudents[2]]; // std-1 (cs-3b) and std-3 (ee-2a)
    const preview = calculateBulkAttendancePreview(selected, "Present");

    assert.equal(preview.totalSelected, 2);
    assert.equal(preview.affectedClassesCount, 2);
    assert.ok(preview.newAveragePercent > 0);
  });

  it("should handle empty selection preview calculations safely", () => {
    const preview = calculateBulkAttendancePreview([], "Present");
    assert.equal(preview.totalSelected, 0);
    assert.equal(preview.affectedClassesCount, 0);
    assert.equal(preview.newAveragePercent, 0);
  });
});

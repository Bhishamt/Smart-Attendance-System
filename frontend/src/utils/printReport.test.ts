import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePrintableAttendanceReport } from "./printReport.ts";
import { Student } from "../types.ts";

describe("Frontend Print Report Generation Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "p1",
      name: "Jane Doe",
      rollNo: "201",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "jane@example.com",
      phone: "+91 9888877777",
      attendancePercent: 85,
      totalClasses: 20,
      presentDays: 17,
      absentDays: 3,
      status: "Present",
      photo: "photo_j.jpg",
      biometricRegistered: true,
    },
    {
      id: "p2",
      name: "<Script>Alert('XSS')</Script>",
      rollNo: "202",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "xss@example.com",
      phone: "+91 9000000000",
      attendancePercent: 40,
      totalClasses: 20,
      presentDays: 8,
      absentDays: 12,
      status: "Absent",
      photo: "photo_x.jpg",
      biometricRegistered: false,
    },
  ];

  it("should generate structured HTML document containing report header and title", () => {
    const html = generatePrintableAttendanceReport(mockStudents, "CS Department Attendance Audit");
    assert.equal(typeof html, "string");
    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("CS Department Attendance Audit"));
    assert.ok(html.includes("Jane Doe"));
    assert.ok(html.includes("201"));
  });

  it("should escape unsafe HTML special characters in student details", () => {
    const html = generatePrintableAttendanceReport(mockStudents);
    assert.ok(!html.includes("<Script>Alert('XSS')</Script>"));
    assert.ok(html.includes("&lt;Script&gt;Alert(&#039;XSS&#039;)&lt;/Script&gt;"));
  });

  it("should render fallback message gracefully when student dataset is empty", () => {
    const emptyHtml = generatePrintableAttendanceReport([]);
    assert.ok(emptyHtml.includes("No student records available"));
    assert.ok(emptyHtml.includes("Total Students Listed: 0"));
  });
});

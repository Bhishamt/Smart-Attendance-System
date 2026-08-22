import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateRiskLevelValue,
  getTopPerformers,
  getNeedsAttention,
  summarizeByClass,
  evaluateAttendanceTrend,
} from "./attendanceInsights.ts";
import { Student } from "../types.ts";

describe("Frontend Attendance Insights Suite", () => {
  const sampleStudents: Student[] = [
    {
      id: "s1",
      name: "Alice",
      rollNo: "1",
      classId: "c1",
      className: "Class A",
      email: "alice@test.com",
      phone: "123",
      attendancePercent: 95,
      totalClasses: 20,
      presentDays: 19,
      absentDays: 1,
      status: "Present",
      photo: "photo1.jpg",
    },
    {
      id: "s2",
      name: "Bob",
      rollNo: "2",
      classId: "c1",
      className: "Class A",
      email: "bob@test.com",
      phone: "456",
      attendancePercent: 70,
      totalClasses: 20,
      presentDays: 14,
      absentDays: 6,
      status: "Absent",
      photo: "photo2.jpg",
    },
    {
      id: "s3",
      name: "Charlie",
      rollNo: "3",
      classId: "c2",
      className: "Class B",
      email: "charlie@test.com",
      phone: "789",
      attendancePercent: 55,
      totalClasses: 20,
      presentDays: 11,
      absentDays: 9,
      status: "Absent",
      photo: "photo3.jpg",
    },
  ];

  it("should categorize risk level thresholds correctly", () => {
    assert.equal(calculateRiskLevelValue(50), "Critical");
    assert.equal(calculateRiskLevelValue(70), "High");
    assert.equal(calculateRiskLevelValue(80), "Moderate");
    assert.equal(calculateRiskLevelValue(90), "Good");
  });

  it("should extract top performers sorted by attendance percentage", () => {
    const top = getTopPerformers(sampleStudents, 2);
    assert.equal(top.length, 2);
    assert.equal(top[0].student.name, "Alice");
    assert.equal(top[1].student.name, "Bob");
  });

  it("should identify students needing attention below threshold", () => {
    const atRisk = getNeedsAttention(sampleStudents, 75, 10);
    assert.equal(atRisk.length, 2);
    assert.equal(atRisk[0].student.name, "Charlie"); // 55%
    assert.equal(atRisk[1].student.name, "Bob"); // 70%
  });

  it("should aggregate student metrics grouped by class", () => {
    const summary = summarizeByClass(sampleStudents);
    assert.equal(summary.length, 2);
    assert.equal(summary[0].classId, "c1");
    assert.equal(summary[0].totalStudents, 2);
    assert.equal(summary[0].avgAttendancePercent, 83);
    assert.equal(summary[0].atRiskCount, 1);
  });

  it("should evaluate attendance trend direction and delta accurately", () => {
    const improving = evaluateAttendanceTrend([
      { attendancePercent: 60 },
      { attendancePercent: 65 },
      { attendancePercent: 80 },
      { attendancePercent: 85 },
    ]);
    assert.equal(improving.direction, "improving");
    assert.ok(improving.delta > 0);

    const declining = evaluateAttendanceTrend([
      { attendancePercent: 85 },
      { attendancePercent: 80 },
      { attendancePercent: 65 },
      { attendancePercent: 60 },
    ]);
    assert.equal(declining.direction, "declining");
    assert.ok(declining.delta < 0);

    const insufficient = evaluateAttendanceTrend([{ attendancePercent: 75 }]);
    assert.equal(insufficient.direction, "stable");
    assert.equal(insufficient.delta, 0);
  });
});

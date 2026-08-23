import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateCSVContent, parseCSVContent } from "./csvExport.ts";
import { Student } from "../types.ts";

describe("Frontend CSV Export Suite", () => {
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
      photo: "photo.jpg",
      biometricRegistered: true,
    },
    {
      id: "std-2",
      name: 'Aanya "Special" Verma',
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
      biometricRegistered: true,
    },
  ];

  it("should generate structured CSV header and row content", () => {
    const csv = generateCSVContent(mockStudents);
    assert.ok(csv.includes("Roll No,Name,Class,Email,Phone,Attendance %,Present Days,Absent Days,Status"));
    assert.ok(csv.includes('"101"'));
    assert.ok(csv.includes('"Rohit Sharma"'));
    assert.ok(csv.includes('"Aanya ""Special"" Verma"'));
  });

  it("should parse valid CSV text back into partial student objects", () => {
    const csvStr = generateCSVContent(mockStudents);
    const parsed = parseCSVContent(csvStr);
    assert.equal(parsed.length, 2);
    assert.equal(parsed[0].name, "Rohit Sharma");
    assert.equal(parsed[0].rollNo, "101");
    assert.equal(parsed[0].attendancePercent, 77);
    assert.equal(parsed[1].name, 'Aanya "Special" Verma');
  });

  it("should return empty array safely for invalid or empty CSV content", () => {
    assert.deepEqual(parseCSVContent(""), []);
    assert.deepEqual(parseCSVContent("Header Only"), []);
  });
});

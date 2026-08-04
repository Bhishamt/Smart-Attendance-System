import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  calculateAttendancePercent,
  isValidEmail,
  generateStudentsCSV,
  filterStudentsList,
  Student,
} from "./server.ts";

describe("Backend Auth & Security Suite", () => {
  it("should generate valid salt:hash format when hashing password", () => {
    const hashed = hashPassword("testSecret123");
    assert.ok(hashed.includes(":"));
    const parts = hashed.split(":");
    assert.equal(parts.length, 2);
    assert.equal(parts[0].length, 32); // 16 bytes hex salt
    assert.equal(parts[1].length, 128); // 64 bytes hex hash
  });

  it("should correctly verify matching password", () => {
    const raw = "mySecurePassword!9";
    const hashed = hashPassword(raw);
    assert.equal(verifyPassword(raw, hashed), true);
  });

  it("should reject incorrect password", () => {
    const raw = "correctPassword";
    const hashed = hashPassword(raw);
    assert.equal(verifyPassword("wrongPassword", hashed), false);
  });

  it("should safely reject malformed stored password strings", () => {
    assert.equal(verifyPassword("test", ""), false);
    assert.equal(verifyPassword("test", "invalidhashstring"), false);
    assert.equal(verifyPassword("test", "saltOnly:"), false);
  });

  it("should generate unique 64-character hex session tokens", () => {
    const token1 = generateToken();
    const token2 = generateToken();
    assert.equal(typeof token1, "string");
    assert.equal(token1.length, 64);
    assert.notEqual(token1, token2);
  });
});

describe("Backend Data & Validation Utilities", () => {
  it("should calculate attendance percentage correctly", () => {
    assert.equal(calculateAttendancePercent(25, 32), 78);
    assert.equal(calculateAttendancePercent(30, 30), 100);
    assert.equal(calculateAttendancePercent(0, 32), 0);
  });

  it("should handle edge cases for attendance calculation safely", () => {
    assert.equal(calculateAttendancePercent(10, 0), 0);
    assert.equal(calculateAttendancePercent(5, -1), 0);
  });

  it("should validate email format accurately", () => {
    assert.equal(isValidEmail("user@example.com"), true);
    assert.equal(isValidEmail("student.rohit@university.edu"), true);
    assert.equal(isValidEmail("invalid-email"), false);
    assert.equal(isValidEmail("user@domain"), false);
    assert.equal(isValidEmail(""), false);
  });
});

describe("Student Filter & CSV Generation Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "s1",
      name: "Alice Smith",
      rollNo: "101",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "alice@example.com",
      phone: "+91 9999911111",
      attendancePercent: 90,
      totalClasses: 20,
      presentDays: 18,
      absentDays: 2,
      status: "Present",
      photo: "photo1.jpg",
    },
    {
      id: "s2",
      name: "Bob Jones",
      rollNo: "102",
      classId: "ce-2a",
      className: "Civil Engineering - 2A",
      email: "bob@example.com",
      phone: "+91 9999922222",
      attendancePercent: 60,
      totalClasses: 20,
      presentDays: 12,
      absentDays: 8,
      status: "Absent",
      photo: "photo2.jpg",
    },
  ];

  it("should filter students by classId correctly", () => {
    const res = filterStudentsList(mockStudents, { classId: "cs-3b" });
    assert.equal(res.length, 1);
    assert.equal(res[0].name, "Alice Smith");
  });

  it("should filter students by status correctly", () => {
    const res = filterStudentsList(mockStudents, { status: "absent" });
    assert.equal(res.length, 1);
    assert.equal(res[0].name, "Bob Jones");
  });

  it("should filter students by minimum attendance percentage", () => {
    const res = filterStudentsList(mockStudents, { minAttendance: "75" });
    assert.equal(res.length, 1);
    assert.equal(res[0].name, "Alice Smith");
  });

  it("should generate valid CSV header and rows from student list", () => {
    const csv = generateStudentsCSV(mockStudents);
    assert.ok(csv.includes("Roll No,Name,Class,Email,Phone,Attendance %,Present Days,Absent Days,Status"));
    assert.ok(csv.includes('"101","Alice Smith","Computer Science - 3B","alice@example.com"'));
    assert.ok(csv.includes('"102","Bob Jones","Civil Engineering - 2A","bob@example.com"'));
  });
});

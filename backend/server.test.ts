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
  calculateSummaryStats,
  calculateRiskLevel,
  getAtRiskStudents,
  sortStudentsList,
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
      biometricRegistered: true,
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
      biometricRegistered: false,
    },
    {
      id: "s3",
      name: "Charlie Brown",
      rollNo: "103",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "charlie@example.com",
      phone: "+91 9999933333",
      attendancePercent: 80,
      totalClasses: 20,
      presentDays: 16,
      absentDays: 4,
      status: "Medical",
      photo: "photo3.jpg",
      biometricRegistered: true,
    },
  ];

  it("should filter students by classId correctly", () => {
    const res = filterStudentsList(mockStudents, { classId: "cs-3b" });
    assert.equal(res.length, 2);
    assert.equal(res[0].name, "Alice Smith");
  });

  it("should filter students by status correctly", () => {
    const res = filterStudentsList(mockStudents, { status: "absent" });
    assert.equal(res.length, 1);
    assert.equal(res[0].name, "Bob Jones");
  });

  it("should filter students by minimum attendance percentage", () => {
    const res = filterStudentsList(mockStudents, { minAttendance: "75" });
    assert.equal(res.length, 2);
    assert.equal(res[0].name, "Alice Smith");
  });

  it("should perform multi-field search across name, rollNo, email, subject, and phone", () => {
    const mockWithSubject: Student[] = [
      ...mockStudents,
      {
        id: "s4",
        name: "David Miller",
        rollNo: "104",
        classId: "cs-3b",
        className: "Computer Science - 3B",
        email: "david.m@example.com",
        phone: "+91 9888844444",
        attendancePercent: 85,
        totalClasses: 20,
        presentDays: 17,
        absentDays: 3,
        status: "Present",
        photo: "photo4.jpg",
        subject: "Operating Systems",
      },
    ];

    const byRoll = filterStudentsList(mockWithSubject, { search: "104" });
    assert.equal(byRoll.length, 1);
    assert.equal(byRoll[0].name, "David Miller");

    const byEmail = filterStudentsList(mockWithSubject, { search: "david.m@example.com" });
    assert.equal(byEmail.length, 1);
    assert.equal(byEmail[0].name, "David Miller");

    const bySubject = filterStudentsList(mockWithSubject, { search: "Operating Systems" });
    assert.equal(bySubject.length, 1);
    assert.equal(bySubject[0].name, "David Miller");

    const bySubjectFilter = filterStudentsList(mockWithSubject, { subject: "Operating Systems" });
    assert.equal(bySubjectFilter.length, 1);
    assert.equal(bySubjectFilter[0].name, "David Miller");
  });

  it("should generate valid CSV header and rows from student list", () => {
    const csv = generateStudentsCSV(mockStudents);
    assert.ok(csv.includes("Roll No,Name,Class,Email,Phone,Attendance %,Present Days,Absent Days,Status"));
    assert.ok(csv.includes('"101","Alice Smith","Computer Science - 3B","alice@example.com"'));
    assert.ok(csv.includes('"102","Bob Jones","Civil Engineering - 2A","bob@example.com"'));
  });
});

describe("Attendance Analytics Summary Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "std-1",
      name: "Student One",
      rollNo: "201",
      classId: "cs-3b",
      className: "CS",
      email: "s1@test.com",
      phone: "1234567890",
      attendancePercent: 100,
      totalClasses: 10,
      presentDays: 10,
      absentDays: 0,
      status: "Present",
      photo: "",
      biometricRegistered: true,
    },
    {
      id: "std-2",
      name: "Student Two",
      rollNo: "202",
      classId: "cs-3b",
      className: "CS",
      email: "s2@test.com",
      phone: "1234567891",
      attendancePercent: 50,
      totalClasses: 10,
      presentDays: 5,
      absentDays: 5,
      status: "Absent",
      photo: "",
      biometricRegistered: false,
    },
    {
      id: "std-3",
      name: "Student Three",
      rollNo: "203",
      classId: "ce-2a",
      className: "CE",
      email: "s3@test.com",
      phone: "1234567892",
      attendancePercent: 80,
      totalClasses: 10,
      presentDays: 8,
      absentDays: 2,
      status: "Late",
      photo: "",
      biometricRegistered: true,
    },
  ];

  it("should compute correct summary statistics", () => {
    const summary = calculateSummaryStats(mockStudents);
    assert.equal(summary.totalStudents, 3);
    assert.equal(summary.avgAttendancePercent, 77); // (100 + 50 + 80) / 3 = 76.66 -> 77
    assert.equal(summary.statusBreakdown.Present, 1);
    assert.equal(summary.statusBreakdown.Absent, 1);
    assert.equal(summary.statusBreakdown.Late, 1);
    assert.equal(summary.statusBreakdown.Medical, 0);
    assert.equal(summary.biometricRegisteredCount, 2);
  });

  it("should handle empty student lists gracefully", () => {
    const summary = calculateSummaryStats([]);
    assert.equal(summary.totalStudents, 0);
    assert.equal(summary.avgAttendancePercent, 0);
    assert.equal(summary.statusBreakdown.Present, 0);
    assert.equal(summary.biometricRegisteredCount, 0);
  });
});

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

describe("Attendance Risk Assessment Suite", () => {
  it("should calculate correct risk levels based on attendance percentage threshold", () => {
    assert.equal(calculateRiskLevel(50), "Critical");
    assert.equal(calculateRiskLevel(65), "High");
    assert.equal(calculateRiskLevel(80), "Moderate");
    assert.equal(calculateRiskLevel(92), "Good");
  });

  it("should accurately identify at-risk students and group risk severity breakdown", () => {
    const mockStudents: Student[] = [
      {
        id: "s1",
        name: "Critical Risk Student",
        rollNo: "201",
        classId: "cs-3b",
        className: "CS - 3B",
        email: "crit@example.com",
        phone: "+91 1000000000",
        attendancePercent: 55,
        totalClasses: 20,
        presentDays: 11,
        absentDays: 9,
        status: "Absent",
        photo: "",
      },
      {
        id: "s2",
        name: "High Risk Student",
        rollNo: "202",
        classId: "cs-3b",
        className: "CS - 3B",
        email: "high@example.com",
        phone: "+91 2000000000",
        attendancePercent: 70,
        totalClasses: 20,
        presentDays: 14,
        absentDays: 6,
        status: "Absent",
        photo: "",
      },
      {
        id: "s3",
        name: "Good Student",
        rollNo: "203",
        classId: "cs-3b",
        className: "CS - 3B",
        email: "good@example.com",
        phone: "+91 3000000000",
        attendancePercent: 95,
        totalClasses: 20,
        presentDays: 19,
        absentDays: 1,
        status: "Present",
        photo: "",
      },
    ];

    const report = getAtRiskStudents(mockStudents, 75);
    assert.equal(report.threshold, 75);
    assert.equal(report.totalAtRisk, 2);
    assert.equal(report.breakdown.critical, 1);
    assert.equal(report.breakdown.high, 1);
    assert.equal(report.breakdown.moderate, 0);
    assert.equal(report.students[0].riskLevel, "Critical");
    assert.equal(report.students[1].riskLevel, "High");
  });

  it("should handle custom thresholds and empty student lists safely", () => {
    const emptyReport = getAtRiskStudents([], 75);
    assert.equal(emptyReport.totalAtRisk, 0);
    assert.equal(emptyReport.breakdown.critical, 0);

    const customReport = getAtRiskStudents([], -10);
    assert.equal(customReport.threshold, 75);
  });
});

describe("Student Sorting & Ordering Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "s1",
      name: "Charlie Brown",
      rollNo: "105",
      classId: "cs-3b",
      className: "CS - 3B",
      email: "charlie@example.com",
      phone: "+91 1111111111",
      attendancePercent: 65,
      totalClasses: 20,
      presentDays: 13,
      absentDays: 7,
      status: "Absent",
      photo: "",
    },
    {
      id: "s2",
      name: "Alice Smith",
      rollNo: "101",
      classId: "cs-3b",
      className: "CS - 3B",
      email: "alice@example.com",
      phone: "+91 2222222222",
      attendancePercent: 95,
      totalClasses: 20,
      presentDays: 19,
      absentDays: 1,
      status: "Present",
      photo: "",
    },
    {
      id: "s3",
      name: "Bob Jones",
      rollNo: "102",
      classId: "cs-3b",
      className: "CS - 3B",
      email: "bob@example.com",
      phone: "+91 3333333333",
      attendancePercent: 80,
      totalClasses: 20,
      presentDays: 16,
      absentDays: 4,
      status: "Present",
      photo: "",
    },
  ];

  it("should sort students by name alphabetically (asc and desc)", () => {
    const asc = sortStudentsList(mockStudents, "name", "asc");
    assert.equal(asc[0].name, "Alice Smith");
    assert.equal(asc[1].name, "Bob Jones");
    assert.equal(asc[2].name, "Charlie Brown");

    const desc = sortStudentsList(mockStudents, "name", "desc");
    assert.equal(desc[0].name, "Charlie Brown");
    assert.equal(desc[1].name, "Bob Jones");
    assert.equal(desc[2].name, "Alice Smith");
  });

  it("should sort students by roll number numerically", () => {
    const asc = sortStudentsList(mockStudents, "rollNo", "asc");
    assert.equal(asc[0].rollNo, "101");
    assert.equal(asc[1].rollNo, "102");
    assert.equal(asc[2].rollNo, "105");
  });

  it("should sort students by attendance percentage and present days", () => {
    const desc = sortStudentsList(mockStudents, "attendancePercent", "desc");
    assert.equal(desc[0].attendancePercent, 95);
    assert.equal(desc[1].attendancePercent, 80);
    assert.equal(desc[2].attendancePercent, 65);

    const ascPresent = sortStudentsList(mockStudents, "presentDays", "asc");
    assert.equal(ascPresent[0].presentDays, 13);
    assert.equal(ascPresent[2].presentDays, 19);
  });

  it("should apply sorting through filterStudentsList parameters", () => {
    const sorted = filterStudentsList(mockStudents, { sortBy: "attendancePercent", sortOrder: "desc" });
    assert.equal(sorted[0].name, "Alice Smith");
    assert.equal(sorted[2].name, "Charlie Brown");
  });
});


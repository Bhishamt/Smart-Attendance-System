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
  paginateStudentsList,
  simulateSocialAuth,
  generateStudentsJSON,
  calculateAttendanceStatistics,
  buildClassAttendanceSummary,
  validateStudentRecord,
  findDuplicateStudents,
  calculateAttendanceTrends,
  parseCSVAttendanceData,
  bulkUpdateAttendanceStatus,
  generateAttendanceDefaultersReport,
  detectAttendanceAnomalies,
  predictAttendanceEligibility,
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

describe("Student Pagination & Page Metadata Suite", () => {
  const sampleStudents: Student[] = Array.from({ length: 15 }, (_, i) => ({
    id: `std-${i + 1}`,
    name: `Student ${i + 1}`,
    rollNo: `${100 + i + 1}`,
    classId: "cs-3b",
    className: "Computer Science - 3B",
    email: `student${i + 1}@example.com`,
    phone: "+91 9000000000",
    attendancePercent: 75 + (i % 20),
    totalClasses: 30,
    presentDays: 20,
    absentDays: 10,
    status: "Present",
    photo: "",
  }));

  it("should divide student list into correct page slices", () => {
    const page1 = paginateStudentsList(sampleStudents, 1, 5);
    assert.equal(page1.data.length, 5);
    assert.equal(page1.data[0].id, "std-1");
    assert.equal(page1.data[4].id, "std-5");
    assert.equal(page1.page, 1);
    assert.equal(page1.limit, 5);
    assert.equal(page1.totalItems, 15);
    assert.equal(page1.totalPages, 3);
    assert.equal(page1.hasNextPage, true);
    assert.equal(page1.hasPrevPage, false);

    const page2 = paginateStudentsList(sampleStudents, 2, 5);
    assert.equal(page2.data.length, 5);
    assert.equal(page2.data[0].id, "std-6");
    assert.equal(page2.hasNextPage, true);
    assert.equal(page2.hasPrevPage, true);

    const page3 = paginateStudentsList(sampleStudents, 3, 5);
    assert.equal(page3.data.length, 5);
    assert.equal(page3.data[4].id, "std-15");
    assert.equal(page3.hasNextPage, false);
    assert.equal(page3.hasPrevPage, true);
  });

  it("should handle out-of-bounds page numbers gracefully", () => {
    const pageNegative = paginateStudentsList(sampleStudents, -5, 5);
    assert.equal(pageNegative.page, 1);

    const pageOverflow = paginateStudentsList(sampleStudents, 999, 5);
    assert.equal(pageOverflow.page, 3);
  });

  it("should default page to 1 and limit to 10 when not specified", () => {
    const defaultPage = paginateStudentsList(sampleStudents);
    assert.equal(defaultPage.page, 1);
    assert.equal(defaultPage.limit, 10);
    assert.equal(defaultPage.data.length, 10);
    assert.equal(defaultPage.totalPages, 2);
  });
});

describe("Social Auth Simulation Suite", () => {
  it("should generate simulated social user payload with default provider fallback", () => {
    const user = simulateSocialAuth();
    assert.equal(user.provider, "google");
    assert.equal(user.email, "admin@google.com");
    assert.equal(user.role, "Admin");
    assert.equal(user.name, "Google User");
  });

  it("should build correct user payload for specified social providers", () => {
    const appleUser = simulateSocialAuth("apple", "admin@apple.com", "Apple User", "Super Admin");
    assert.equal(appleUser.provider, "apple");
    assert.equal(appleUser.email, "admin@apple.com");
    assert.equal(appleUser.name, "Apple User");
    assert.equal(appleUser.role, "Super Admin");

    const linkedinUser = simulateSocialAuth("linkedin");
    assert.equal(linkedinUser.provider, "linkedin");
    assert.equal(linkedinUser.email, "admin@linkedin.com");
    assert.equal(linkedinUser.name, "Linkedin User");
  });
});

describe("Student JSON Export & Formatting Suite", () => {
  const sampleStudents: Student[] = [
    {
      id: "json-1",
      name: "Charlie Brown",
      rollNo: "301",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "charlie@example.com",
      phone: "+91 9876543210",
      attendancePercent: 88,
      totalClasses: 25,
      presentDays: 22,
      absentDays: 3,
      status: "Present",
      photo: "photo_c.jpg",
      biometricRegistered: true,
    },
  ];

  it("should format student records into structured JSON string", () => {
    const jsonStr = generateStudentsJSON(sampleStudents);
    assert.equal(typeof jsonStr, "string");
    const parsed = JSON.parse(jsonStr);
    assert.equal(Array.isArray(parsed), true);
    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].id, "json-1");
    assert.equal(parsed[0].name, "Charlie Brown");
  });

  it("should format empty student arrays cleanly without error", () => {
    const emptyJson = generateStudentsJSON([]);
    assert.equal(emptyJson, "[]");
    assert.deepEqual(JSON.parse(emptyJson), []);
  });
});

describe("Attendance Statistics Breakdown Suite", () => {
  const statsMockStudents: Student[] = [
    {
      id: "st-1",
      name: "Student One",
      rollNo: "501",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "st1@example.com",
      phone: "+91 9111111111",
      attendancePercent: 95,
      totalClasses: 20,
      presentDays: 19,
      absentDays: 1,
      status: "Present",
      photo: "photo1.jpg",
      biometricRegistered: true,
    },
    {
      id: "st-2",
      name: "Student Two",
      rollNo: "502",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "st2@example.com",
      phone: "+91 9222222222",
      attendancePercent: 55,
      totalClasses: 20,
      presentDays: 11,
      absentDays: 9,
      status: "Absent",
      photo: "photo2.jpg",
      biometricRegistered: false,
    },
  ];

  it("should compute accurate aggregate statistics for student dataset", () => {
    const stats = calculateAttendanceStatistics(statsMockStudents);
    assert.equal(stats.totalStudents, 2);
    assert.equal(stats.avgAttendancePercent, 75); // (95 + 55) / 2
    assert.equal(stats.totalPresentDays, 30); // 19 + 11
    assert.equal(stats.totalAbsentDays, 10); // 1 + 9
    assert.equal(stats.statusBreakdown.Present, 1);
    assert.equal(stats.statusBreakdown.Absent, 1);
    assert.equal(stats.riskBreakdown.Good, 1); // 95%
    assert.equal(stats.riskBreakdown.Critical, 1); // 55%
    assert.equal(stats.biometricCoveragePercent, 50); // 1 out of 2
  });

  it("should return zeroed statistics safely for empty dataset", () => {
    const emptyStats = calculateAttendanceStatistics([]);
    assert.equal(emptyStats.totalStudents, 0);
    assert.equal(emptyStats.avgAttendancePercent, 0);
    assert.equal(emptyStats.biometricCoveragePercent, 0);
    assert.equal(emptyStats.statusBreakdown.Present, 0);
    assert.equal(emptyStats.riskBreakdown.Critical, 0);
  });
});

describe("Class Attendance Summary Suite", () => {
  const classSummaryStudents: Student[] = [
    {
      id: "cs-1",
      name: "Top Performer",
      rollNo: "601",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "top@example.com",
      phone: "+91 9011111111",
      attendancePercent: 95,
      totalClasses: 20,
      presentDays: 19,
      absentDays: 1,
      status: "Present",
      photo: "photo1.jpg",
      biometricRegistered: true,
    },
    {
      id: "cs-2",
      name: "Critical Student",
      rollNo: "602",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "critical@example.com",
      phone: "+91 9022222222",
      attendancePercent: 55,
      totalClasses: 20,
      presentDays: 11,
      absentDays: 9,
      status: "Absent",
      photo: "photo2.jpg",
      biometricRegistered: false,
    },
    {
      id: "cs-3",
      name: "High Risk Student",
      rollNo: "603",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "high@example.com",
      phone: "+91 9033333333",
      attendancePercent: 70,
      totalClasses: 20,
      presentDays: 14,
      absentDays: 6,
      status: "Absent",
      photo: "photo3.jpg",
      biometricRegistered: false,
    },
    {
      id: "cs-4",
      name: "Late Arrival Student",
      rollNo: "604",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "late@example.com",
      phone: "+91 9044444444",
      attendancePercent: 88,
      totalClasses: 20,
      presentDays: 18,
      absentDays: 2,
      status: "Late",
      photo: "photo4.jpg",
      biometricRegistered: true,
    },
  ];

  it("should aggregate per-class totals, averages, and status breakdowns", () => {
    const summary = buildClassAttendanceSummary("cs-3b", "Computer Science - 3B", classSummaryStudents);
    assert.equal(summary.classId, "cs-3b");
    assert.equal(summary.className, "Computer Science - 3B");
    assert.equal(summary.totalStudents, 4);
    assert.equal(summary.avgAttendancePercent, 77); // (95 + 55 + 70 + 88) / 4
    assert.equal(summary.statusBreakdown.Present, 1);
    assert.equal(summary.statusBreakdown.Absent, 2);
    assert.equal(summary.statusBreakdown.Late, 1);
    assert.equal(summary.statusBreakdown.Medical, 0);
  });

  it("should split students into top performers and those needing attention", () => {
    const summary = buildClassAttendanceSummary("cs-3b", "CS - 3B", classSummaryStudents, { topLimit: 2 });
    assert.equal(summary.atRiskCount, 2); // 55% and 70% fall below 75% threshold
    assert.equal(summary.riskBreakdown.Good, 2);
    assert.equal(summary.riskBreakdown.Critical, 1);
    assert.equal(summary.riskBreakdown.High, 1);
    assert.equal(summary.topPerformers.length, 2);
    assert.equal(summary.topPerformers[0].attendancePercent, 95);
    assert.equal(summary.topPerformers[0].riskLevel, "Good");
    assert.equal(summary.needsAttention.length, 2);
    assert.equal(summary.needsAttention[0].attendancePercent, 55);
    assert.equal(summary.needsAttention[0].riskLevel, "Critical");
    assert.equal(summary.needsAttention[1].riskLevel, "High");
  });

  it("should honor custom thresholds and top limits", () => {
    const summary = buildClassAttendanceSummary("cs-3b", "CS - 3B", classSummaryStudents, {
      atRiskThreshold: 90,
      topLimit: 1,
    });
    assert.equal(summary.atRiskCount, 3); // 55%, 70%, and 88% are below 90%
    assert.equal(summary.topPerformers.length, 1);
    assert.equal(summary.topPerformers[0].attendancePercent, 95);
    assert.equal(summary.needsAttention.length, 1);
    assert.equal(summary.needsAttention[0].attendancePercent, 55);
  });

  it("should handle empty classes and invalid configuration safely", () => {
    const empty = buildClassAttendanceSummary("cs-x", "Missing Class", []);
    assert.equal(empty.totalStudents, 0);
    assert.equal(empty.avgAttendancePercent, 0);
    assert.equal(empty.topPerformers.length, 0);
    assert.equal(empty.needsAttention.length, 0);
    assert.equal(empty.statusBreakdown.Absent, 0);
    assert.equal(empty.riskBreakdown.Critical, 0);

    const safe = buildClassAttendanceSummary("cs-3b", "CS - 3B", classSummaryStudents, { atRiskThreshold: -5, topLimit: 0 });
    assert.equal(safe.topPerformers.length, 1); // topLimit clamps to at least 1
    assert.equal(safe.atRiskCount, 2); // invalid threshold falls back to 75
  });
});





describe("Duplicate Student Detection Suite", () => {
  const dupStudents: Student[] = [
    {
      id: "d1",
      name: "Alice Dup",
      rollNo: "701",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "alice@dupe.edu",
      phone: "+91 9100000000",
      attendancePercent: 80,
      totalClasses: 20,
      presentDays: 16,
      absentDays: 4,
      status: "Present",
      photo: "a.jpg",
    },
    {
      id: "d2",
      name: "Alice Smith",
      rollNo: "702",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "ALICE@DUPE.EDU",
      phone: "+91 9111111111",
      attendancePercent: 90,
      totalClasses: 20,
      presentDays: 18,
      absentDays: 2,
      status: "Present",
      photo: "b.jpg",
    },
    {
      id: "d3",
      name: "Bob Jones",
      rollNo: "701",
      classId: "ce-2a",
      className: "Civil Engineering - 2A",
      email: "bob@dupe.edu",
      phone: "+91 9222222222",
      attendancePercent: 70,
      totalClasses: 20,
      presentDays: 14,
      absentDays: 6,
      status: "Absent",
      photo: "c.jpg",
    },
    {
      id: "d4",
      name: "Unique Student",
      rollNo: "704",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "unique@dupe.edu",
      phone: "+91 9333333333",
      attendancePercent: 95,
      totalClasses: 20,
      presentDays: 19,
      absentDays: 1,
      status: "Present",
      photo: "d.jpg",
    },
  ];

  it("should detect duplicate student records by email ignoring whitespace and case", () => {
    const groups = findDuplicateStudents(dupStudents);
    const emailGroup = groups.find((g) => g.field === "email");
    assert.ok(emailGroup, "expected an email duplicate group");
    assert.equal(emailGroup!.key, "alice@dupe.edu");
    assert.equal(emailGroup!.count, 2);
  });

  it("should detect duplicate student records by roll number", () => {
    const groups = findDuplicateStudents(dupStudents);
    const rollGroup = groups.find((g) => g.field === "rollNo");
    assert.ok(rollGroup, "expected a rollNo duplicate group");
    assert.equal(rollGroup!.key, "701");
    assert.equal(rollGroup!.count, 2);
  });

  it("should exclude unique records from duplicate groups", () => {
    const groups = findDuplicateStudents(dupStudents);
    const groupKeys = groups.map((g) => g.key);
    assert.ok(!groupKeys.includes("unique@dupe.edu"));
    assert.ok(!groupKeys.includes("704"));
  });

  it("should return no duplicate groups for an empty or unique dataset", () => {
    assert.deepEqual(findDuplicateStudents([]), []);
    assert.equal(findDuplicateStudents([dupStudents[3]]).length, 0);
  });
});

describe("Student Record Validation Suite", () => {
  it("should accept a fully valid student record", () => {
    const result = validateStudentRecord({ name: "Valid Student", rollNo: "801", email: "valid@edu.in", attendancePercent: 85 });
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  it("should reject records missing required name and roll number", () => {
    const result = validateStudentRecord({ email: "nope@edu.in" });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("Name")));
    assert.ok(result.errors.some((e) => e.includes("Roll")));
  });

  it("should reject malformed email and out-of-range attendance percentage", () => {
    const result = validateStudentRecord({ name: "X", rollNo: "802", email: "bad-email", attendancePercent: 120 });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.toLowerCase().includes("email")));
    assert.ok(result.errors.some((e) => e.includes("between 0 and 100")));
  });
});

describe("Student Attendance Trends Suite", () => {
  const mockStudents: Student[] = [
    {
      id: "t1",
      name: "Trend Student 1",
      rollNo: "901",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "t1@example.edu",
      phone: "+91 9999988888",
      attendancePercent: 90,
      totalClasses: 20,
      presentDays: 18,
      absentDays: 2,
      status: "Present",
      photo: "photo1.jpg",
    },
    {
      id: "t2",
      name: "Trend Student 2",
      rollNo: "902",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "t2@example.edu",
      phone: "+91 9999977777",
      attendancePercent: 60,
      totalClasses: 20,
      presentDays: 12,
      absentDays: 8,
      status: "Absent",
      photo: "photo2.jpg",
    },
  ];

  it("should calculate multi-day attendance points and summary metrics", () => {
    const trends = calculateAttendanceTrends(mockStudents, 7);
    assert.equal(trends.periodDays, 7);
    assert.equal(trends.points.length, 7);
    assert.ok(trends.averageAttendancePercent >= 0 && trends.averageAttendancePercent <= 100);
    assert.ok(trends.highestAttendanceDay !== null);
    assert.ok(trends.lowestAttendanceDay !== null);
    assert.ok(["improving", "declining", "stable"].includes(trends.trendDirection));
  });

  it("should normalize days boundary parameters between 1 and 30", () => {
    const minTrends = calculateAttendanceTrends(mockStudents, -5);
    assert.equal(minTrends.periodDays, 1);
    assert.equal(minTrends.points.length, 1);

    const maxTrends = calculateAttendanceTrends(mockStudents, 50);
    assert.equal(maxTrends.periodDays, 30);
    assert.equal(maxTrends.points.length, 30);
  });

  it("should handle empty student list safely without crashing", () => {
    const trends = calculateAttendanceTrends([], 5);
    assert.equal(trends.periodDays, 5);
    assert.equal(trends.points.length, 5);
    assert.ok(typeof trends.averageAttendancePercent === "number");
  });
});

describe("CSV Attendance Data Import Suite", () => {
  it("should parse valid CSV content into clean student records", () => {
    const csvStr = `Roll No,Name,Class,Email,Phone,Attendance %,Present Days,Absent Days,Status\n"101","John Doe","CS-3B","john@example.com","+91 9876543210",85,17,3,"Present"\n"102","Jane Smith","CS-3B","jane@example.com","+91 9876543211",90,18,2,"Present"`;
    const { validRecords, invalidRecords } = parseCSVAttendanceData(csvStr);

    assert.equal(validRecords.length, 2);
    assert.equal(invalidRecords.length, 0);
    assert.equal(validRecords[0].name, "John Doe");
    assert.equal(validRecords[0].rollNo, "101");
    assert.equal(validRecords[0].email, "john@example.com");
    assert.equal(validRecords[0].attendancePercent, 85);
    assert.equal(validRecords[1].name, "Jane Smith");
  });

  it("should flag invalid or missing student record fields during parsing", () => {
    const csvStr = `Roll No,Name,Email\n"","No Name Student","invalid-email"\n"103","","valid@example.com"`;
    const { validRecords, invalidRecords } = parseCSVAttendanceData(csvStr);

    assert.equal(validRecords.length, 0);
    assert.equal(invalidRecords.length, 2);
    assert.equal(invalidRecords[0].row, 2);
    assert.ok(invalidRecords[0].errors.length > 0);
  });

  it("should return empty results safely for empty or invalid CSV text", () => {
    const emptyResult = parseCSVAttendanceData("");
    assert.equal(emptyResult.validRecords.length, 0);
    assert.equal(emptyResult.invalidRecords.length, 0);
  });
});

describe("Bulk Attendance Status Update Suite", () => {
  const bulkTestStudents: Student[] = [
    {
      id: "bulk-1",
      name: "Student One",
      rollNo: "701",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "one@example.com",
      phone: "+91 9700000001",
      attendancePercent: 70,
      totalClasses: 10,
      presentDays: 7,
      absentDays: 3,
      status: "Absent",
      photo: "photo1.jpg",
    },
    {
      id: "bulk-2",
      name: "Student Two",
      rollNo: "702",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "two@example.com",
      phone: "+91 9700000002",
      attendancePercent: 80,
      totalClasses: 10,
      presentDays: 8,
      absentDays: 2,
      status: "Absent",
      photo: "photo2.jpg",
    },
    {
      id: "bulk-3",
      name: "Student Three",
      rollNo: "703",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "three@example.com",
      phone: "+91 9700000003",
      attendancePercent: 90,
      totalClasses: 10,
      presentDays: 9,
      absentDays: 1,
      status: "Present",
      photo: "photo3.jpg",
    },
  ];

  it("should update attendance status and recalculate percentage for matching student IDs", () => {
    const studentsCopy = JSON.parse(JSON.stringify(bulkTestStudents));
    const result = bulkUpdateAttendanceStatus(studentsCopy, ["bulk-1", "bulk-2"], "Present", "10:00 AM");

    assert.equal(result.updatedCount, 2);
    assert.equal(result.invalidStatus, false);
    assert.equal(result.updatedStudents.length, 2);

    const s1 = studentsCopy.find((s: Student) => s.id === "bulk-1");
    assert.equal(s1.status, "Present");
    assert.equal(s1.lastMarkedTime, "10:00 AM");
    assert.equal(s1.totalClasses, 11);
    assert.equal(s1.presentDays, 8);
    assert.equal(s1.attendancePercent, 73); // 8/11 = 72.7 -> 73%

    const s3 = studentsCopy.find((s: Student) => s.id === "bulk-3");
    assert.equal(s3.status, "Present");
    assert.equal(s3.totalClasses, 10); // Untouched
  });

  it("should reject invalid status parameter gracefully", () => {
    const studentsCopy = JSON.parse(JSON.stringify(bulkTestStudents));
    const result = bulkUpdateAttendanceStatus(studentsCopy, ["bulk-1"], "UnknownStatus" as any);

    assert.equal(result.updatedCount, 0);
    assert.equal(result.invalidStatus, true);
    assert.equal(result.updatedStudents.length, 0);
  });

  it("should return empty result safely when studentIds list is empty or invalid", () => {
    const studentsCopy = JSON.parse(JSON.stringify(bulkTestStudents));
    const result = bulkUpdateAttendanceStatus(studentsCopy, [], "Present");

    assert.equal(result.updatedCount, 0);
    assert.equal(result.invalidStatus, false);
  });
});

describe("Student Attendance Defaulter Analysis Suite", () => {
  const defaulterTestStudents: Student[] = [
    {
      id: "def-1",
      name: "Critical Defaulter",
      rollNo: "801",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "critical@example.com",
      phone: "+91 9800000001",
      attendancePercent: 50,
      totalClasses: 20,
      presentDays: 10,
      absentDays: 10,
      status: "Absent",
      photo: "photo1.jpg",
    },
    {
      id: "def-2",
      name: "Warning Defaulter",
      rollNo: "802",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "warning@example.com",
      phone: "+91 9800000002",
      attendancePercent: 70,
      totalClasses: 20,
      presentDays: 14,
      absentDays: 6,
      status: "Present",
      photo: "photo2.jpg",
    },
    {
      id: "def-3",
      name: "Good Student",
      rollNo: "803",
      classId: "ee-3a",
      className: "Electrical Engineering - 3A",
      email: "good@example.com",
      phone: "+91 9800000003",
      attendancePercent: 90,
      totalClasses: 20,
      presentDays: 18,
      absentDays: 2,
      status: "Present",
      photo: "photo3.jpg",
    },
  ];

  it("should identify defaulters below target threshold and calculate required additional classes", () => {
    const report = generateAttendanceDefaultersReport(defaulterTestStudents, 75, 60);

    assert.equal(report.targetThresholdPercent, 75);
    assert.equal(report.criticalThresholdPercent, 60);
    assert.equal(report.totalStudentsEvaluated, 3);
    assert.equal(report.totalDefaulters, 2);
    assert.equal(report.criticalCount, 1);
    assert.equal(report.warningCount, 1);

    const critical = report.defaulters.find((d) => d.id === "def-1");
    assert.ok(critical);
    assert.equal(critical?.riskTier, "critical");
    assert.equal(critical?.classesNeededToTarget, 20);

    const warning = report.defaulters.find((d) => d.id === "def-2");
    assert.ok(warning);
    assert.equal(warning?.riskTier, "warning");
    assert.equal(warning?.classesNeededToTarget, 4);
  });

  it("should aggregate class breakdown accurately for defaulters", () => {
    const report = generateAttendanceDefaultersReport(defaulterTestStudents, 75, 60);
    assert.equal(report.classBreakdown.length, 1);
    assert.equal(report.classBreakdown[0].classId, "cs-3b");
    assert.equal(report.classBreakdown[0].defaulterCount, 2);
    assert.equal(report.classBreakdown[0].criticalCount, 1);
    assert.equal(report.classBreakdown[0].warningCount, 1);
  });

  it("should handle empty dataset safely without throwing errors", () => {
    const report = generateAttendanceDefaultersReport([], 75, 60);
    assert.equal(report.totalStudentsEvaluated, 0);
    assert.equal(report.totalDefaulters, 0);
    assert.equal(report.defaulters.length, 0);
    assert.equal(report.classBreakdown.length, 0);
  });
});

describe("Student Attendance Anomaly Detection Suite", () => {
  const anomalyTestStudents: Student[] = [
    {
      id: "anom-1",
      name: "Critical Student",
      rollNo: "901",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "critical901@example.com",
      phone: "+91 9900000001",
      attendancePercent: 55,
      totalClasses: 40,
      presentDays: 22,
      absentDays: 18,
      status: "Absent",
      photo: "photo1.jpg",
      biometricRegistered: true,
    },
    {
      id: "anom-2",
      name: "Warning Student",
      rollNo: "902",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "warning902@example.com",
      phone: "+91 9900000002",
      attendancePercent: 72,
      totalClasses: 40,
      presentDays: 28,
      absentDays: 12,
      status: "Present",
      photo: "photo2.jpg",
      biometricRegistered: true,
    },
    {
      id: "anom-3",
      name: "Unregistered Student",
      rollNo: "903",
      classId: "ee-3a",
      className: "Electrical Engineering - 3A",
      email: "unreg903@example.com",
      phone: "+91 9900000003",
      attendancePercent: 70,
      totalClasses: 40,
      presentDays: 28,
      absentDays: 12,
      status: "Absent",
      photo: "photo3.jpg",
      biometricRegistered: false,
    },
    {
      id: "anom-4",
      name: "Exemplary Student",
      rollNo: "904",
      classId: "ee-3a",
      className: "Electrical Engineering - 3A",
      email: "exemplary904@example.com",
      phone: "+91 9900000004",
      attendancePercent: 95,
      totalClasses: 40,
      presentDays: 38,
      absentDays: 2,
      status: "Present",
      photo: "photo4.jpg",
      biometricRegistered: true,
    },
  ];

  it("should identify critical and low attendance anomalies accurately", () => {
    const report = detectAttendanceAnomalies(anomalyTestStudents, 75);

    assert.equal(report.totalAnalyzed, 4);
    assert.equal(report.criticalRiskCount, 1);
    assert.equal(report.highRiskCount, 2);

    const critical = report.anomalies.find((a) => a.studentId === "anom-1");
    assert.ok(critical);
    assert.equal(critical?.anomalyType, "CRITICAL_ATTENDANCE");
    assert.equal(critical?.severity, "critical");

    const warning = report.anomalies.find((a) => a.studentId === "anom-2" && a.anomalyType === "LOW_ATTENDANCE");
    assert.ok(warning);
    assert.equal(warning?.severity, "high");
  });

  it("should flag unregistered biometric students with vulnerable attendance", () => {
    const report = detectAttendanceAnomalies(anomalyTestStudents, 75);

    const unreg = report.anomalies.find((a) => a.studentId === "anom-3" && a.anomalyType === "UNREGISTERED_BIOMETRIC");
    assert.ok(unreg);
    assert.equal(unreg?.severity, "medium");
    assert.ok(unreg?.message.includes("lacks biometric registration"));
  });

  it("should handle custom threshold settings and empty datasets safely", () => {
    const customReport = detectAttendanceAnomalies(anomalyTestStudents, 70);
    assert.equal(customReport.totalAnalyzed, 4);

    const emptyReport = detectAttendanceAnomalies([], 75);
    assert.equal(emptyReport.totalAnalyzed, 0);
    assert.equal(emptyReport.anomaliesFound, 0);
    assert.equal(emptyReport.anomalies.length, 0);
  });
});

describe("Student Attendance Forecasting & Exam Eligibility Suite", () => {
  const forecastingTestStudents: Student[] = [
    {
      id: "fc-1",
      name: "Daniel Green",
      rollNo: "901",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "daniel@example.com",
      phone: "+91 9900000001",
      attendancePercent: 90,
      totalClasses: 30,
      presentDays: 27,
      absentDays: 3,
      status: "Present",
      photo: "photo1.jpg",
    },
    {
      id: "fc-2",
      name: "Emma Watson",
      rollNo: "902",
      classId: "cs-3b",
      className: "Computer Science - 3B",
      email: "emma@example.com",
      phone: "+91 9900000002",
      attendancePercent: 70,
      totalClasses: 30,
      presentDays: 21,
      absentDays: 9,
      status: "Present",
      photo: "photo2.jpg",
    },
    {
      id: "fc-3",
      name: "Frank Miller",
      rollNo: "903",
      classId: "ee-3a",
      className: "Electrical Engineering - 3A",
      email: "frank@example.com",
      phone: "+91 9900000003",
      attendancePercent: 40,
      totalClasses: 30,
      presentDays: 12,
      absentDays: 18,
      status: "Absent",
      photo: "photo3.jpg",
    },
  ];

  it("should calculate max/min reachable attendance and categorize eligibility status accurately", () => {
    const report = predictAttendanceEligibility(forecastingTestStudents, 10, 75);

    assert.equal(report.totalAnalyzed, 3);
    assert.equal(report.eligibleCount, 1);
    assert.equal(report.atRiskCount, 1);
    assert.equal(report.ineligibleCount, 1);

    const eligible = report.predictions.find((p) => p.studentId === "fc-1");
    assert.ok(eligible);
    assert.equal(eligible?.eligibilityStatus, "ELIGIBLE");
    assert.equal(eligible?.minPossiblePercent, 68);
    assert.equal(eligible?.maxPossiblePercent, 93);

    const atRisk = report.predictions.find((p) => p.studentId === "fc-2");
    assert.ok(atRisk);
    assert.equal(atRisk?.eligibilityStatus, "AT_RISK");
    assert.ok(atRisk?.minClassesToAttend! > 0);

    const ineligible = report.predictions.find((p) => p.studentId === "fc-3");
    assert.ok(ineligible);
    assert.equal(ineligible?.eligibilityStatus, "INELIGIBLE");
    assert.equal(ineligible?.maxPossiblePercent, 55);
  });

  it("should calculate minimum future classes required to reach threshold", () => {
    const report = predictAttendanceEligibility(forecastingTestStudents, 10, 75);
    const atRisk = report.predictions.find((p) => p.studentId === "fc-2");

    assert.equal(atRisk?.minClassesToAttend, 9);
    assert.ok(atRisk?.message.includes("Must attend at least 9 of next 10 classes"));
  });

  it("should handle custom remaining classes, custom threshold settings, and empty datasets safely", () => {
    const customReport = predictAttendanceEligibility(forecastingTestStudents, 20, 80);
    assert.equal(customReport.remainingClasses, 20);
    assert.equal(customReport.targetThreshold, 80);

    const emptyReport = predictAttendanceEligibility([], 10, 75);
    assert.equal(emptyReport.totalAnalyzed, 0);
    assert.equal(emptyReport.eligibleCount, 0);
    assert.equal(emptyReport.atRiskCount, 0);
    assert.equal(emptyReport.ineligibleCount, 0);
    assert.equal(emptyReport.predictions.length, 0);
  });
});





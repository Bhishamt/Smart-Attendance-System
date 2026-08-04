import { Student } from "../types";

export function exportStudentsToCSV(students: Student[], filename = "attendance_report.csv") {
  const headers = ["Roll No", "Name", "Class", "Email", "Phone", "Attendance %", "Present Days", "Absent Days", "Status"];
  const rows = students.map((s) => [
    `"${s.rollNo}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.className.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    s.attendancePercent,
    s.presentDays,
    s.absentDays,
    `"${s.status}"`,
  ].join(","));

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(","), ...rows].join("\n"));
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

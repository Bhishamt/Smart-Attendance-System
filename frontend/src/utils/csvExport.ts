import { Student } from "../types";

export function generateCSVContent(students: Student[]): string {
  const headers = ["Roll No", "Name", "Class", "Email", "Phone", "Attendance %", "Present Days", "Absent Days", "Status"];
  const rows = students.map((s) => [
    `"${s.rollNo || ""}"`,
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.className || "").replace(/"/g, '""')}"`,
    `"${s.email || ""}"`,
    `"${s.phone || ""}"`,
    s.attendancePercent ?? 0,
    s.presentDays ?? 0,
    s.absentDays ?? 0,
    `"${s.status || "Present"}"`,
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

export function parseCSVContent(csvText: string): Partial<Student>[] {
  if (!csvText || typeof csvText !== "string") return [];

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  const parseRow = (str: string): string[] => {
    const result: string[] = [];
    let curr = "";
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '"') {
        if (inQuotes && str[i + 1] === '"') {
          curr += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(curr.trim());
        curr = "";
      } else {
        curr += char;
      }
    }
    result.push(curr.trim());
    return result;
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase());
  const records: Partial<Student>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const record: Partial<Student> = {};

    headers.forEach((header, idx) => {
      const val = values[idx] || "";
      if (header.includes("roll")) record.rollNo = val;
      else if (header.includes("name")) record.name = val;
      else if (header.includes("class")) record.className = val;
      else if (header.includes("email")) record.email = val;
      else if (header.includes("phone")) record.phone = val;
      else if (header.includes("attendance")) {
        const num = parseFloat(val);
        if (!isNaN(num)) record.attendancePercent = num;
      } else if (header.includes("present")) {
        const num = parseInt(val, 10);
        if (!isNaN(num)) record.presentDays = num;
      } else if (header.includes("absent")) {
        const num = parseInt(val, 10);
        if (!isNaN(num)) record.absentDays = num;
      } else if (header.includes("status")) {
        if (["Present", "Absent", "Late", "Medical"].includes(val)) {
          record.status = val as any;
        }
      }
    });

    if (record.name || record.rollNo) {
      records.push(record);
    }
  }

  return records;
}

export function exportStudentsToCSV(students: Student[], filename = "attendance_report.csv") {
  const content = generateCSVContent(students);
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(content);
  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

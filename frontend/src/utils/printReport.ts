import { Student } from "../types";

export function generatePrintableAttendanceReport(students: Student[], reportTitle: string = "Student Attendance Audit Report"): string {
  const generatedAt = new Date().toLocaleString();
  const total = students.length;
  const avgAttendance = total === 0 ? 0 : Math.round(students.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / total);
  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;
  const lateCount = students.filter((s) => s.status === "Late").length;
  const medicalCount = students.filter((s) => s.status === "Medical").length;

  const rows = students
    .map(
      (s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td>${escapeHtml(s.rollNo)}</td>
      <td>${escapeHtml(s.className || "-")}</td>
      <td>${s.attendancePercent}%</td>
      <td>${s.presentDays}/${s.totalClasses}</td>
      <td><span class="badge status-${s.status.toLowerCase()}">${s.status}</span></td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(reportTitle)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #1e293b; background: #fff; }
    h1 { margin-bottom: 4px; color: #0f172a; font-size: 24px; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 20px; }
    .stats-bar { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat-card { border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 8px; flex: 1; text-align: center; }
    .stat-val { font-size: 20px; font-weight: bold; color: #3b82f6; }
    .stat-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { background: #f8fafc; text-align: left; padding: 10px 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 600; }
    td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    .badge { padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .status-present { background: #dcfce7; color: #166534; }
    .status-absent { background: #fee2e2; color: #991b1b; }
    .status-late { background: #fef3c7; color: #92400e; }
    .status-medical { background: #e0e7ff; color: #3730a3; }
  </style>
</head>
<body>
  <h1>${escapeHtml(reportTitle)}</h1>
  <div class="meta">Generated: ${generatedAt} | Total Students Listed: ${total}</div>
  
  <div class="stats-bar">
    <div class="stat-card"><div class="stat-val">${total}</div><div class="stat-lbl">Total Students</div></div>
    <div class="stat-card"><div class="stat-val">${avgAttendance}%</div><div class="stat-lbl">Avg Attendance</div></div>
    <div class="stat-card"><div class="stat-val">${presentCount}</div><div class="stat-lbl">Present</div></div>
    <div class="stat-card"><div class="stat-val">${absentCount}</div><div class="stat-lbl">Absent</div></div>
    <div class="stat-card"><div class="stat-val">${lateCount}</div><div class="stat-lbl">Late</div></div>
    <div class="stat-card"><div class="stat-val">${medicalCount}</div><div class="stat-lbl">Medical</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Student Name</th>
        <th>Roll No</th>
        <th>Class</th>
        <th>Attendance %</th>
        <th>Days (Pres/Tot)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="7" style="text-align:center;padding:20px;color:#94a3b8;">No student records available</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function triggerReportPrint(students: Student[], reportTitle: string = "Student Attendance Audit Report"): boolean {
  if (typeof window === "undefined") return false;
  const html = generatePrintableAttendanceReport(students, reportTitle);
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
  return true;
}

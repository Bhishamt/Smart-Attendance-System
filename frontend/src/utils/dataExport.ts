import { Student } from "../types";
import { exportStudentsToCSV } from "./csvExport";

export { exportStudentsToCSV };

export function formatStudentsJSON(students: Student[]): string {
  return JSON.stringify(students, null, 2);
}

export function exportStudentsToJSON(students: Student[], filename = "attendance_report.json") {
  const jsonContent = "data:application/json;charset=utf-8," + encodeURIComponent(formatStudentsJSON(students));
  const link = document.createElement("a");
  link.setAttribute("href", jsonContent);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

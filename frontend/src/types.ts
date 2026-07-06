/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  classId: string;
  className: string;
  email: string;
  phone: string;
  attendancePercent: number;
  totalClasses: number;
  presentDays: number;
  absentDays: number;
  status: "Present" | "Absent" | "Late" | "Medical";
  photo: string;
  lastMarkedTime?: string;
  biometricRegistered?: boolean;
  semester?: string;
  subject?: string;
  approved?: boolean;
}

export interface AttendanceActivity {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: "attendance" | "student" | "report" | "backup";
  timestamp: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  totalStudents: number;
  avgAttendance: number;
  dept: string;
  semester?: string;
  subjects?: string[];
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "HOD" | "Teacher";
  department?: string; // HOD and Teacher
  classId?: string; // Teacher (Class Incharge)
}

export interface CloudStorageAccount {
  email: string;
  name: string;
  photo?: string;
}

export interface CloudStorageFile {
  id: string;
  name: string;
  createdTime: string;
  size?: string;
}

export interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  connectedDriveAccount: CloudStorageAccount | null;
}

export interface DashboardStats {
  totalStudents: number;
  todayPresent: number;
  todayAbsent: number;
  attendancePercent: number;
  topClasses: { name: string; percent: number; color: string }[];
  weeklyTrends: { day: string; percent: number }[];
  monthlyData: { month: string; percent: number }[];
}

export type ActiveTab = 
  | "splash"
  | "auth"
  | "dashboard"
  | "students"
  | "mark"
  | "analytics"
  | "history"
  | "settings"
  | "profile";


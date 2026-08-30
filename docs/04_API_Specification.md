# API Specification

All API endpoints are prefixed with `/api`.

## Students

### GET /api/students
Returns all students.
**Response:** `Student[]`

### POST /api/students
Add a new student.
**Body:** `{ name, email, rollNumber, class, section, department, image? }`
**Response:** `{ success, student }`

### GET /api/students/:id
Get a single student by ID.
**Response:** `Student`

### PUT /api/students/:id
Update a student.
**Body:** Partial student fields
**Response:** `{ success, student }`

### DELETE /api/students/:id
Delete a student.
**Response:** `{ success }`

### GET /api/students/stats/breakdown
Get aggregate attendance statistics breakdown (totals, risk distribution, biometric coverage).
**Query:** `search?`, `classId?`, `status?`, `minAttendance?`, `subject?`
**Response:** `AttendanceStatistics`

### POST /api/students/validate
Validate a student record before adding or importing it.
**Body:** `{ name?, rollNo?, email?, attendancePercent? }`
**Response:** `{ valid, errors: string[] }`

### GET /api/students/duplicates
Detect student records sharing the same email address or roll number.
**Response:** `{ totalDuplicates, groups: DuplicateGroup[] }` where each group is `{ key, field: "email" | "rollNo", count, students }`

### POST /api/students/import/csv
Parse and batch import student records from a CSV string payload.
**Body:** `{ csvContent: string }`
**Response:** `{ message, importedCount, invalidCount, invalidRecords: { row: number, errors: string[] }[] }`

### GET /api/students/defaulters
Evaluate students against minimum attendance threshold (default 75%) and return defaulter list with required classes calculation.
**Query:** `threshold?`, `critical?`
**Response:** `DefaultersReport` — includes `targetThresholdPercent`, `totalDefaulters`, `defaulterPercentage`, `criticalCount`, `warningCount`, `defaulters`, and `classBreakdown`

## Classes

### GET /api/classes/:id/summary
Get a per-class attendance summary with aggregates, top performers, and students needing attention.
**Query:** `topLimit?`, `threshold?`
**Response:** `ClassAttendanceSummary` — includes `totalStudents`, `avgAttendancePercent`, `statusBreakdown`, `riskBreakdown`, `atRiskCount`, `topPerformers`, and `needsAttention`

## Attendance


### GET /api/attendance
Get attendance records.
**Query:** `date?`, `class?`, `section?`, `subject?`
**Response:** `AttendanceActivity[]`

### POST /api/attendance
Mark attendance for a student.
**Body:** `{ studentId, class, section, subject, date, status }`
**Response:** `{ success, activity }`

## Staff

### GET /api/staff
List all staff.
**Response:** `Staff[]`

### POST /api/staff
Add staff member (Super Admin only).
**Body:** `{ name, email, role, department, phone }`
**Response:** `{ success, staff }`

### PUT /api/staff/:id
Update staff details.
**Response:** `{ success, staff }`

### DELETE /api/staff/:id
Remove staff member.
**Response:** `{ success }`

## Dashboard

### GET /api/dashboard
Get dashboard statistics.
**Response:** `DashboardStats`

## AI

### POST /api/ai/analyze
Analyze attendance data with AI.
**Body:** `{ query: string, context?: DashboardStats }`
**Response:** `{ success, response: string }`

## Auth / Cloud Storage

### GET /api/auth/drive
Initiate Google Drive OAuth flow.
**Response:** Redirect to Google consent screen.

### GET /api/auth/social/simulate
Simulate social provider authentication (OAuth interactive demo).
**Query:** `provider?`, `email?`, `name?`, `role?`
**Response:** `{ success: boolean, user: { email, name, role, provider } }`

### POST /api/sync/drive
Backup data to Google Drive.
**Body:** `{ code: string }`
**Response:** `{ success, fileId }`

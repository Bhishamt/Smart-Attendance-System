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

### POST /api/sync/drive
Backup data to Google Drive.
**Body:** `{ code: string }`
**Response:** `{ success, fileId }`

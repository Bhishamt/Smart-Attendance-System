# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2026-08-30

### Added
- Student attendance defaulter analysis utility (`generateAttendanceDefaultersReport`) and API endpoint (`GET /api/students/defaulters`) in `backend/server.ts` evaluating students against minimum required attendance thresholds and computing exact additional classes needed to reach target percentage.
- Dedicated backend unit test suite (`Student Attendance Defaulter Analysis Suite`) in `backend/server.test.ts` testing defaulter identification, risk tier categorization, target class calculation, and class breakdown aggregation.
- Frontend attendance defaulter calculation and risk evaluation helpers (`calculateClassesNeededToTarget`, `evaluateDefaulterRiskTier`, `formatDefaulterSummary`) in `frontend/src/utils/defaulterAnalysis.ts`.
- Dedicated frontend unit test suite (`Frontend Defaulter Analysis Suite`) in `frontend/src/utils/defaulterAnalysis.test.ts` covering consecutive class math, risk tier thresholds, summary text formatting, and edge case safety.

## [1.7.0] - 2026-08-29

### Added
- Bulk attendance status update utility (`bulkUpdateAttendanceStatus`) and API endpoint (`POST /api/students/bulk-status`) in `backend/server.ts` updating student attendance statuses, recalculating total classes, present/absent days, and overall percentages.
- Dedicated backend unit test suite (`Bulk Attendance Status Update Suite`) in `backend/server.test.ts` testing multi-student batch status changes, attendance math recalculation, status validation, and empty selection handling.
- Frontend bulk attendance status formatters and preview calculators (`formatBulkStatusSummary`, `filterStudentsForBulkAction`, `calculateBulkAttendancePreview`) in `frontend/src/utils/bulkAttendance.ts`.
- Dedicated frontend unit test suite (`Frontend Bulk Attendance Utility Suite`) in `frontend/src/utils/bulkAttendance.test.ts` covering status summary formatting, student filtering, and projected preview metrics.

## [1.6.0] - 2026-08-23

### Added
- CSV attendance data parser utility (`parseCSVAttendanceData`) and batch import endpoint (`POST /api/students/import/csv`) in `backend/server.ts` parsing CSV payloads into student records and flagging invalid rows.
- Dedicated backend unit test suite (`CSV Attendance Data Import Suite`) in `backend/server.test.ts` testing valid CSV parsing, missing column fallbacks, row validation error reporting, and empty payload safety.
- Frontend CSV content generation and parsing utilities (`generateCSVContent`, `parseCSVContent`) in `frontend/src/utils/csvExport.ts`.
- Dedicated frontend unit test suite (`Frontend CSV Export Suite`) in `frontend/src/utils/csvExport.test.ts` covering double-quote escaping, header formatting, roundtrip CSV parsing, and edge case safety.

## [1.5.0] - 2026-08-22

### Added
- Multi-day student attendance trend analytics utility (`calculateAttendanceTrends`) and API endpoint (`GET /api/students/trends`) in `backend/server.ts` delivering period metrics, highest/lowest attendance days, and directional trend indicators (`improving`, `declining`, `stable`).
- Dedicated backend unit test suite (`Student Attendance Trends Suite`) in `backend/server.test.ts` validating trend point creation, boundary normalization, peak/lowest detection, and empty dataset safety.
- Frontend attendance trend direction evaluator utility (`evaluateAttendanceTrend`) in `frontend/src/utils/attendanceInsights.ts`.
- Dedicated frontend unit test suite (`Frontend Attendance Insights Suite`) in `frontend/src/utils/attendanceInsights.test.ts` covering risk level mapping, top performer ranking, at-risk filtering, class summaries, and trend evaluation.

## [1.4.0] - 2026-08-18


### Added
- Per-class attendance summary aggregation utility (`buildClassAttendanceSummary`) and API endpoint (`GET /api/classes/:id/summary`) in `backend/server.ts` delivering class totals, average attendance, status breakdowns, risk breakdowns, at-risk counts, top performers, and students needing attention.
- Duplicate student detection utility (`findDuplicateStudents`) and endpoint (`GET /api/students/duplicates`) in `backend/server.ts` flagging records sharing an email address or roll number.
- Student record validation utility (`validateStudentRecord`) and endpoint (`POST /api/students/validate`) in `backend/server.ts` checking required fields, email format, and attendance range.
- Attendance insights utility (`getTopPerformers`, `getNeedsAttention`, `summarizeByClass`, `calculateRiskLevelValue`) in `frontend/src/utils/attendanceInsights.ts`.
- Interactive "Student Insights" section in `frontend/src/screens/AnalyticsView.tsx` rendering per-class at-risk summaries alongside top performers and students needing attention.
- Expanded backend unit test suites (`Class Attendance Summary Suite`, `Duplicate Student Detection Suite`, `Student Record Validation Suite`) in `server.test.ts` covering aggregation math, custom thresholds, duplicate grouping, and validation edge cases.

### Fixed
- Backend unit test runner now detects the Node.js test runner via `NODE_TEST_CONTEXT` so `tsx --test` suites exit cleanly without lingering server sockets.
- At-risk count in class summary now honors the configured attendance threshold instead of a fixed risk band.
- Scoped TypeScript lint projects per package (`frontend/tsconfig.json`, `backend/tsconfig.json`) and added missing `@types/react` / `@types/react-dom` devDependencies so CI type-checking no longer pulls `backend/server.ts` through the root project config.

## [1.3.0] - 2026-08-13

### Added
- Attendance statistics breakdown utility (`calculateAttendanceStatistics`) and API endpoint (`GET /api/students/stats/breakdown`) in `backend/server.ts` delivering total counts, average attendance percentages, present/absent days totals, status counts, risk breakdowns, and biometric registration coverage.
- Printable HTML attendance report utility (`generatePrintableAttendanceReport`, `triggerReportPrint`) in `frontend/src/utils/printReport.ts`.
- Interactive "Print Report" action toolbar button in `frontend/src/screens/StudentsView.tsx`.
- Dedicated unit test suite (`Attendance Statistics Breakdown Suite`) in `backend/server.test.ts` covering aggregate statistics, edge cases, and zeroed empty datasets.
- Frontend print report unit test suite (`frontend/src/utils/printReport.test.ts`) validating HTML document structure, title headers, entity escaping, and empty dataset handling.

## [1.2.0] - 2026-08-12


### Added
- Data export utilities (`exportStudentsToJSON`, `formatStudentsJSON`, `generateStudentsJSON`) in `frontend/src/utils/dataExport.ts` and `backend/server.ts` for structured JSON data downloads.
- Interactive "Export JSON" action button in `StudentsView` header alongside CSV export.
- Expanded backend unit test suite (`Student JSON Export & Formatting Suite`) in `server.test.ts` validating JSON output structure and empty dataset edge cases.

### Fixed
- Guarded top-level `startServer()` execution in `backend/server.ts` with cross-platform `--test` and `NODE_ENV` checks to ensure unit test suites exit cleanly without open sockets.

## [1.1.0] - 2026-08-11

### Added
- Social authentication simulation endpoint (`GET /api/auth/social/simulate`) in backend `server.ts` supporting provider parameters (`google`, `apple`, `linkedin`) and user role configuration.
- Unit test suite (`Social Auth Simulation Suite`) in `server.test.ts` covering provider defaults, fallback roles, and activity log tracking.

### Fixed
- Resolved argument count type error in frontend `AuthView.tsx` social sign-in buttons by passing structured user objects with provider metadata.

## [1.0.9] - 2026-08-10

### Added
- Student list pagination utility (`paginateStudentsList`) and query parameter support (`page`, `limit`) in backend endpoint (`GET /api/students`).
- Interactive pagination bar in frontend `StudentsView` with item count indicators ("Showing X-Y of Z"), per-page size selector dropdown (6, 12, 24, All), and page navigation buttons.
- Unit test suite expansion (`Student Pagination & Page Metadata Suite`) in `server.test.ts` covering page slicing, boundary metadata, limits, and out-of-bounds fallbacks.

## [1.0.8] - 2026-08-09

### Added
- Student sorting utility (`sortStudentsList`) and query parameter support (`sortBy`, `sortOrder`) in `filterStudentsList` and backend endpoint (`GET /api/students`).
- Interactive "Sort by" selection dropdown (Name, Roll No, Attendance %, Present Days) and Ascending/Descending toggle button in frontend `StudentsView`.
- Unit test suite expansion (`Student Sorting & Ordering Suite`) in `server.test.ts` covering alphabetical, numerical, and attendance-based sorting criteria.

## [1.0.7] - 2026-08-08

### Added
- Multi-field student search and subject query filtering support in `filterStudentsList` utility and API endpoints (`GET /api/students`, `GET /api/students/summary`, `GET /api/students/export/csv`).
- Enhanced search input supporting querying across student name, roll number, email address, subject, and contact phone number.
- Dedicated "All Subjects" dropdown filter control in frontend `StudentsView`.
- Unit test suite expansion in `server.test.ts` for multi-field search and subject filtering.

## [1.0.6] - 2026-08-07

### Added
- Attendance risk level assessment utilities (`calculateRiskLevel`, `getAtRiskStudents`) and low-attendance endpoint (`GET /api/students/at-risk`).
- Quick "At Risk" filter toggle (<75% attendance) and color-coded Risk Level badges (`Critical Risk`, `High Risk`, `Moderate`, `Good`) on student cards in `StudentsView`.
- Expanded unit test suite (`Attendance Risk Assessment Suite`) in `server.test.ts` covering risk level calculations, custom thresholds, and at-risk breakdown reports.

## [1.0.5] - 2026-08-06

### Added
- Bulk student attendance status update endpoint (`POST /api/students/bulk-status`) and attendance analytics summary endpoint (`GET /api/students/summary`).
- Summary analytics metrics cards (Total Listed, Present, Absent/Medical, Avg Attendance %) in frontend `StudentsView`.
- Multi-select checkbox selection for student directory cards with "Select All" / "Deselect All" filter controls.
- Floating batch action toolbar allowing one-click status updates (`Present`, `Absent`, `Late`, `Medical`) for multiple selected students.
- Unit test suite coverage in `server.test.ts` for `calculateSummaryStats` utility and edge case handling.

## [1.0.4] - 2026-08-04

### Added
- Attendance status filtering (`Present`, `Absent`, `Late`, `Medical`) and CSV report export backend endpoint (`GET /api/students/export/csv`).
- Status filter dropdown and "Export CSV" instant download button in frontend `StudentsView`.
- Client-side CSV generator utility (`exportStudentsToCSV`) in `frontend/src/utils/csvExport.ts`.
- Automated test coverage in `server.test.ts` for CSV export formatting and student query filter logic.

## [1.0.3] - 2026-08-03

### Added
- Extended unit test coverage in `server.test.ts` for attendance percentage calculations, email format validation, and password hash error handling.
- Enhanced backend utility functions (`calculateAttendancePercent`, `isValidEmail`) for reusability.

## [1.0.2] - 2026-08-02

### Added
- Automated unit test suite (`server.test.ts`) covering backend crypto authentication and session token utilities
- TypeScript linting script (`tsc --noEmit`) to backend and unified `lint` script to root `package.json`
- Root workspace `test` script (`npm test`)

### Fixed
- Resolved `TS2304` compilation error in frontend `App.tsx` AuthView OAuth fallback callback

## [1.0.1] - 2026-07-14

### Added
- Docker support with multi-stage build and docker-compose
- Root package.json with convenience scripts
- Setup scripts for Windows (PowerShell) and Unix (bash)
- Project governance files: CODE_OF_CONDUCT, SECURITY policy
- Editor configuration: .editorconfig, .gitattributes
- 20 documentation files covering architecture, API, design, and development guides
- README with features, tech stack, setup guide, and API reference

### Changed
- Updated CONTRIBUTING.md with development process and commit conventions
- Enhanced README with screenshots gallery and architecture diagram

## [1.0.0] - 2026-07-06

### Added
- Professional folder structure separating frontend and backend
- Complete documentation including README, LICENSE, CONTRIBUTING, and PROJECT_STRUCTURE
- Comprehensive UI for student attendance, analytics, and reporting

### Changed
- Complete project rebranding to "Smart Attendance Management System"
- Enhanced generic integration for Cloud Storage Sync
- Enhanced "Smart AI Assistant" for intelligent attendance insights

### Removed
- All outdated template remnants
- Experimental flags and labels

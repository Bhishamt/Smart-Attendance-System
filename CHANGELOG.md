# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

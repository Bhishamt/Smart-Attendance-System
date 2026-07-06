# Smart Attendance Management System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## Project Description
A professional, modern, and cloud-ready SaaS platform tailored for educational institutions to track, manage, and analyze student attendance seamlessly. Featuring real-time dashboard analytics, robust role-based access, automated cloud synchronization, and smart attendance insights driven by an integrated AI engine.

## Features
- **Authentication**: Role-based access control for Admins, Teachers, and Students.
- **Student Management**: Seamlessly add, view, edit, and organize student profiles across classes and departments.
- **Attendance Tracking**: Rapidly mark attendance through a clean, responsive interface designed for speed.
- **Analytics Dashboard**: Real-time insights, multi-department attendance averages, and visual consistency metrics.
- **Reports**: Generate, export (PDF/Excel), and auto-sync attendance reports directly to Cloud Storage.
- **Cloud Sync**: Securely backup and synchronize attendance records to a connected Cloud Workspace.
- **Notifications**: Automated alerts for at-risk students and system activities.
- **Premium UI**: Stunning dark-mode native interface featuring smooth Framer Motion animations and sleek glassmorphism design.

## Screenshots Gallery

<div align="center">
  <h3>Auth & Onboarding</h3>
  <img src="assets/screenshots/Screenshot%202026-07-06%20092137.png" width="32%" alt="Splash Screen">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092425.png" width="32%" alt="Create Account / Login">
</div>

<div align="center">
  <h3>Core Dashboard & Management</h3>
  <img src="assets/screenshots/Screenshot%202026-07-06%20092144.png" width="32%" alt="Admin Dashboard">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092157.png" width="32%" alt="Student List">
  <img src="assets/screenshots/Screenshot%202026-07-06%20091118.png" width="32%" alt="Add Student">
</div>

<div align="center">
  <h3>Attendance Tracking</h3>
  <img src="assets/screenshots/Screenshot%202026-07-06%20092239.png" width="32%" alt="Mark Attendance (Detailed)">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092247.png" width="32%" alt="Attendance List">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092211.png" width="32%" alt="Student Profile (Individual Attendance)">
</div>

<div align="center">
  <h3>Analytics & Configuration</h3>
  <img src="assets/screenshots/Screenshot%202026-07-06%20092257.png" width="32%" alt="Analytics">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092306.png" width="32%" alt="Reports & Export">
  <img src="assets/screenshots/Screenshot%202026-07-06%20092318.png" width="32%" alt="Settings & Cloud Sync">
</div>

## Tech Stack

**Frontend**:
- React 19 (Web)
- Vite
- TypeScript
- Tailwind CSS & Framer Motion

**Backend**:
- Node.js
- Express
- TypeScript

**Database**:
- In-Memory Data Store (Easily swappable with MongoDB / PostgreSQL)
- Cloud Storage Sync via API

## Architecture Diagram

```mermaid
graph TD
    Client[React Frontend] -->|REST API| Server[Express Backend]
    Server -->|Sync Data| CloudStore[Cloud Storage]
    Server -->|Analyze Trends| AI[Smart AI Engine]
    Server --> DB[(Database)]
```

## Project Structure

```
Smart-Attendance-System/
├── frontend/               # React Client Application
│   ├── src/                # React Source Code
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Full-page application views
│   │   ├── services/       # API integration functions
│   │   ├── App.tsx         # Main application routing & state
│   │   └── index.css       # Tailwind entry and global styles
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
├── backend/                # Express Server Application
│   ├── server.ts           # Main Express server and API routes
│   ├── types.ts            # Shared TypeScript types
│   └── package.json        # Backend dependencies
│
├── docs/                   # Documentation and Guides
├── assets/                 # Static Assets and Screenshots
├── README.md               # Main project documentation
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
└── CHANGELOG.md            # Release history
```

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Smart-Attendance-System.git
   cd Smart-Attendance-System
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

## Running Frontend

To start the Vite development server for the React UI:
```bash
cd frontend
npm run dev
```

## Running Backend

To start the Express server (handling API requests and cloud integrations):
```bash
cd backend
npm run dev
```

## Future Features
- Biometric & Face Recognition Integration
- Push Notifications for Guardians
- Offline Mode Support
- Native Mobile Applications (iOS / Android)
- Enterprise Single Sign-On (SSO) Integration

## Author

**Bhisham Thakur**  
*Computer Engineering Student*

## License

This project is licensed under the [MIT License](LICENSE).

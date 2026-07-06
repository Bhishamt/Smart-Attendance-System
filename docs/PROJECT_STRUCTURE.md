# Project Structure

The Smart Attendance Management System is organized as a monorepo-style structure, separating the client-side UI and the server-side API.

```
Smart-Attendance-System/
├── frontend/               # React Client Application
│   ├── src/                # React Source Code
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Full-page views
│   │   ├── services/       # API integration functions
│   │   ├── App.tsx         # Main application routing & state
│   │   ├── index.css       # Tailwind entry and global styles
│   │   └── types.ts        # TypeScript definitions
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
├── backend/                # Express Server Application
│   ├── server.ts           # Main Express server and API routes
│   └── package.json        # Backend dependencies
│
├── docs/                   # Documentation and Guides
│
├── README.md               # Main project documentation
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
└── CHANGELOG.md            # Release history
```

## Architecture Details

- **Frontend**: Utilizes Vite for fast bundling, React for the UI, and Tailwind CSS for styling. Data is managed primarily in `App.tsx` and passed down to screens and components via props.
- **Backend**: A lightweight Node.js Express server (`server.ts`) handling RESTful API endpoints for attendance records, student profiles, and cloud storage integrations.
- **Cloud Storage Integration**: Handled securely via the backend API to synchronize records automatically.
- **Smart AI Assistant**: Integrated on the server side to analyze aggregated attendance trends.

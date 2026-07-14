# Security

## Authentication & Authorization

- **Role-Based Access Control**: Four roles — Super Admin, HOD, Teacher, Student
- **Session Management**: In-memory session state in App.tsx
- **OAuth 2.0**: Google Drive integration uses OAuth 2.0 for secure API access

## Data Protection

- **API Keys**: `AI_API_KEY` is loaded from environment variables, never hardcoded
- **OAuth Credentials**: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` stored in `.env`
- **`.env` files excluded from git** via `.gitignore`
- **In-memory storage**: No persistent database means no SQL injection risk in current version

## Best Practices

- All API responses return minimal necessary data
- CORS configured for same-origin requests via Vite proxy
- Input validation on all API endpoints
- No sensitive data logged to console
- Cookie-based session handling with `cookie-parser`

## Future Security Enhancements

- JWT-based authentication tokens
- HTTPS enforcement
- Rate limiting on API endpoints
- SQL/NoSQL database with parameterized queries
- Password hashing with bcrypt
- CSRF protection
- Security headers (Helmet middleware)

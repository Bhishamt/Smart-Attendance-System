# Logging

## Current Logging Approach

The application uses `console.log` / `console.error` for development logging.

## Logging Levels

| Level | Usage |
|-------|-------|
| INFO | API requests, user actions, state changes |
| WARN | Degraded mode (e.g., AI fallback), retry attempts |
| ERROR | API failures, unhandled exceptions, auth failures |
| DEBUG | Development-only detailed traces |

## Current Log Points

- API route entries and responses
- AI analysis requests (with fallback indication)
- Google Drive OAuth flow steps
- Data modification operations

## Future Logging Strategy (Planned)

- **Structured logging** with Winston or Pino in JSON format
- **Centralized log aggregation** via CloudWatch or similar
- **Log levels** configurable via `LOG_LEVEL` environment variable
- **Sensitive data filtering** — never log passwords, tokens, or personal data
- **Request IDs** for tracing requests across the stack
- **Error stack traces** captured and logged with context

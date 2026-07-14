# Testing

## Testing Strategy

The project uses a three-tier testing approach for quality assurance.

## Test Categories

### Unit Tests
- **Frontend**: Component rendering, state management, utility functions
- **Backend**: API endpoint handlers, data transformation, validation

### Integration Tests
- API endpoint integration with in-memory data store
- AI analysis flow (with simulated fallback)
- Google Drive OAuth flow

### End-to-End Tests
- Complete user workflows (login → mark attendance → view dashboard)
- Cross-screen navigation and state persistence

## Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Test Coverage Goals

| Layer | Target |
|-------|--------|
| Frontend components | 80% |
| API routes | 90% |
| Data models | 95% |

## Testing Tools (Planned)

- Vitest for unit/integration tests
- Playwright for E2E testing
- MSW (Mock Service Worker) for API mocking
- Testing Library for React component tests

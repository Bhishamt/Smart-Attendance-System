# Error Handling

## Frontend Error Handling

### API Errors
```typescript
try {
  const res = await fetch('/api/endpoint');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
} catch (err) {
  showToast('Failed to load data. Please try again.', 'error');
  return null;
}
```

### UI States
Every data-fetching component handles three states:
- **Loading** — Show skeleton or spinner
- **Error** — Show error message with retry button
- **Empty** — Show "No data" message with action CTA

### Global Error Boundary (Planned)
React error boundary to catch rendering errors and show fallback UI.

## Backend Error Handling

### API Response Format
```typescript
// Success
{ success: true, data: ... }

// Error
{ success: false, error: "Message", code: "ERROR_CODE" }
```

### HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | Success |
| 400 | Bad request / validation error |
| 404 | Resource not found |
| 500 | Internal server error |

### Validation
- Input validation on all POST/PUT endpoints
- Type checking with TypeScript
- Sanitize string inputs
- Validate required fields before processing

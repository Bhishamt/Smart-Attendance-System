# Performance

## Current Performance Characteristics

- **In-memory data store** — Extremely fast reads/writes but no persistence
- **Single-page application** — Fast navigation after initial load
- **Vite dev server** — Instant HMR for development

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial page load | < 1.5s |
| API response time | < 200ms |
| Attendance marking | < 500ms |
| Dashboard render | < 1s |
| AI analysis response | < 3s |
| Lighthouse score | > 90 |

## Optimization Opportunities

### Frontend
- Code splitting with React.lazy for screen components
- Memoize expensive calculations with useMemo
- Debounce search inputs
- Lazy load charts (Recharts) on dashboard
- Optimize bundle with tree-shaking

### Backend
- Implement response caching for dashboard stats
- Paginate student list queries
- Use connection pooling for future database
- Compress API responses with gzip

### Vite Configuration
- Enable CSS code splitting
- Configure build target for modern browsers
- Use Rollup manual chunks for vendor splitting

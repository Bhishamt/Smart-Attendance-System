# Monitoring

## Current Monitoring

The application has minimal monitoring — currently relies on development console logs and manual testing.

## Planned Monitoring Strategy

### Health Checks
- `GET /api/health` endpoint returning server status
- In-memory data store integrity checks
- AI service connectivity status

### Metrics to Track
| Metric | Source |
|--------|--------|
| API response times | Backend middleware |
| Request rate | Backend counter |
| Error rate | Backend error handler |
| Active users | Frontend activity tracking |
| Attendance ops/sec | Backend operation counter |
| AI analysis latency | Backend timer |

### Alerting (Planned)
- Error rate spike > 5%
- API response time > 1s average
- Server down / health check failure
- AI API Key expired or quota exceeded

### Tools (Planned)
- **Sentry** — Error tracking and performance monitoring
- **Grafana/Prometheus** — Metrics visualization
- **UptimeRobot** — External uptime monitoring
- **Console logging** — Development debugging only

# AI Architecture

## Overview

The Smart Attendance Management System integrates **Google Gemini AI** for intelligent attendance analysis. When the API key is not configured, a simulated fallback provides contextual responses based on attendance data.

## Integration

- **Library**: `@google/genai`
- **Endpoint**: `POST /api/ai/analyze`
- **Model**: Gemini Pro (via Google AI SDK)

## Flow

```
User Query
    │
    ▼
App.tsx — POST /api/ai/analyze { query, context }
    │
    ▼
server.ts — GeminiClient.analyze(query, context)
    │
    ├── AI_API_KEY configured? ──► Google Gemini API ──► AI Response
    │
    └── No API key ──► Simulated Response ──► Contextual answer
    │
    ▼
AiAssistantModal — Display response in chat UI
```

## Capabilities

- Attendance trend analysis (weekly/monthly patterns)
- At-risk student identification
- Department-wide attendance insights
- Recommendations for improvement
- Natural language query processing

## Simulated Fallback

When `AI_API_KEY` is not set in `.env`, the system analyzes attendance data locally and generates contextual responses using template-based reasoning without external API calls.

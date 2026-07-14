# Environment Configuration

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_API_KEY` | No | — | Google Gemini API key for AI features |
| `APP_URL` | No | `http://localhost:5173` | Application URL |
| `GOOGLE_CLIENT_ID` | No | — | Google OAuth client ID for Drive |
| `GOOGLE_CLIENT_SECRET` | No | — | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | No | `http://localhost:3000/api/auth/drive/callback` | OAuth redirect URI |
| `PORT` | No | `3000` | Express server port |
| `NODE_ENV` | No | `development` | Environment mode |

## Environment Files

| File | Purpose |
|------|---------|
| `.env` | Local development (gitignored) |
| `.env.example` | Template with placeholder values (committed) |
| `.env.production` | Production environment (gitignored) |

## Running in Different Environments

### Development
```bash
cd backend
npm run dev
# Vite HMR at localhost:5173
# API at localhost:3000
```

### Production
```bash
cd backend
NODE_ENV=production npm start
# Everything served from port 3000
```

## Notes
- Never commit `.env` files containing real credentials
- The AI Assistant works in fallback mode without `AI_API_KEY`
- Google Drive features require full OAuth setup

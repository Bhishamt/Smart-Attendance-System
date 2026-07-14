# Deployment

## Build Process

```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Build frontend for production
cd frontend
npm run build

# The built files go to frontend/dist/
```

## Deployment Options

### Option 1: Single Server (Vite + Express)

```bash
# Backend serves built frontend via Vite middleware
cd backend
NODE_ENV=production npm run start
```

### Option 2: Separate Hosting

Deploy `frontend/dist/` to a static host (Vercel, Netlify) and `backend/` to a Node.js host (Railway, Render, Fly.io).

### Option 3: Docker (Planned)

```bash
docker build -t smart-attendance .
docker run -p 3000:3000 smart-attendance
```

## Environment Variables

```
AI_API_KEY=your_gemini_api_key
APP_URL=https://your-app.com
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
GOOGLE_REDIRECT_URI=https://your-app.com/api/auth/drive/callback
```

## Production Considerations

- Set up a persistent database (PostgreSQL recommended)
- Configure proper CORS for production domain
- Enable HTTPS with SSL certificate
- Set up monitoring and logging
- Configure environment-specific `.env` files

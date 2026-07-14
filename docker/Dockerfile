FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY . .

RUN cd frontend && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
RUN npm ci --production

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]

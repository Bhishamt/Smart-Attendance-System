#!/usr/bin/env bash
set -e

echo "=== Smart Attendance Management System Setup ==="

echo ""
echo "Installing backend dependencies..."
cd backend
npm install

echo ""
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Copying environment file..."
cd ..
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — please configure it."
fi

echo ""
echo "Setup complete!"
echo "Run 'cd backend && npm run dev' to start."

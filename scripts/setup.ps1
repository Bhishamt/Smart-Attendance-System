Write-Host "=== Smart Attendance Management System Setup ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install

Write-Host ""
Write-Host "Copying environment file..." -ForegroundColor Yellow
Set-Location ..
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created .env from .env.example - please configure it." -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host "Run 'cd backend && npm run dev' to start." -ForegroundColor White

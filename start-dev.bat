@echo off
echo.
echo 🚀 QuillSync Dev Launcher
echo.
echo 1) Local (npm)
echo 2) Docker
set /p MODE="Choose mode [1/2]: "

if "%MODE%"=="2" (
  echo.
  echo Starting with Docker Compose...
  docker compose up --build
  exit /b 0
)

if not exist "backend" ( echo ❌ Run from the QuillSync root directory & exit /b 1 )
if not exist "frontend" ( echo ❌ Run from the QuillSync root directory & exit /b 1 )

if not exist "backend\node_modules" ( cd backend & call npm install & cd .. )
if not exist "frontend\node_modules" ( cd frontend & call npm install & cd .. )

echo.
echo ✅ Dependencies ready!
echo.

cd backend
start "QuillSync Backend" cmd /k npm run dev
cd ..

timeout /t 2 /nobreak

cd frontend
start "QuillSync Frontend" cmd /k npm run dev
cd ..

echo.
echo ✨ Both servers starting!
echo Frontend: http://localhost:5174
echo Backend:  http://localhost:5000
echo.

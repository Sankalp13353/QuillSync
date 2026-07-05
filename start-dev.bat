@echo off
REM QuillSync Development Server Launcher (Windows)
REM This batch file starts both backend and frontend development servers

echo.
echo 🚀 Starting QuillSync Development Servers...
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the QuillSync root directory
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Please run this script from the QuillSync root directory
    exit /b 1
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ✅ Dependencies ready!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Starting Backend Server (Port 5000)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start backend in new window
cd backend
start "QuillSync Backend" cmd /k npm start
cd ..

timeout /t 2 /nobreak

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Starting Frontend Server (Port 5174)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start frontend in new window
cd frontend
start "QuillSync Frontend" cmd /k npm run dev
cd ..

echo.
echo ✨ Both servers are starting!
echo.
echo Frontend:  http://localhost:5174
echo Backend:   http://localhost:5000
echo.
echo Check the new terminal windows for server output
echo.

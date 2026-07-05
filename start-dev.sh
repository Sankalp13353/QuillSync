#!/bin/bash

# QuillSync Development Server Launcher
# This script starts both backend and frontend development servers

echo "🚀 Starting QuillSync Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the QuillSync root directory"
    exit 1
fi

# Function to install dependencies if needed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing dependencies for $dir..."
        cd "$dir"
        npm install
        cd ..
    fi
}

# Check and install backend dependencies
echo "🔍 Checking backend dependencies..."
check_dependencies "backend"

# Check and install frontend dependencies
echo "🔍 Checking frontend dependencies..."
check_dependencies "frontend"

echo ""
echo -e "${GREEN}✅ Dependencies ready!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Starting Backend Server (Port 5000)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start backend in background
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 2

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Starting Frontend Server (Port 5174)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Trap to kill both processes on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo -e "${GREEN}✨ Both servers are running!${NC}"
echo ""
echo "Frontend:  http://localhost:5174"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

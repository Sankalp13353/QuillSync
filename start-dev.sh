#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🚀 QuillSync Dev Launcher"
echo ""
echo "1) Local (npm)"
echo "2) Docker"
read -p "Choose mode [1/2]: " MODE

if [ "$MODE" = "2" ]; then
  echo ""
  echo -e "${BLUE}Starting with Docker Compose...${NC}"
  docker compose up --build
  exit 0
fi

# Local mode
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "❌ Run from the QuillSync root directory"
  exit 1
fi

[ ! -d "backend/node_modules" ] && echo "📦 Installing backend deps..." && cd backend && npm install && cd ..
[ ! -d "frontend/node_modules" ] && echo "📦 Installing frontend deps..." && cd frontend && npm install && cd ..

echo -e "${GREEN}✅ Dependencies ready!${NC}"
echo ""

(cd backend && npm run dev) &
BACKEND_PID=$!

sleep 2

(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo -e "${GREEN}✨ Both servers running!${NC}"
echo "Frontend: http://localhost:5174"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"

wait

#!/bin/bash

# Change to the backend directory
cd "$(dirname "$0")/.."

echo "🗑️ Clearing users from database..."
npx ts-node scripts/clearUsers.ts

echo "🚀 Starting Prisma Studio..."
# Start Prisma Studio in the background
npx prisma studio &
PRISMA_PID=$!

echo "⏳ Waiting for Prisma Studio to start..."
sleep 3

echo "🔄 Starting backend server..."
# Start backend server in the background
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend server to start..."
sleep 5

echo "🌐 Starting frontend server..."
# Go to frontend (parent) directory and start frontend
cd ..
npm run dev &
FRONTEND_PID=$!

echo "🎉 All services started!"
echo "📝 Prisma Studio: http://localhost:5555"
echo "🖥️ Backend: http://localhost:3001 or 3003"
echo "🌐 Frontend: http://localhost:5173 or 5174"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo '⏹️ Stopping all services...'; kill $PRISMA_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 
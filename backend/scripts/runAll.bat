@echo off
setlocal

rem Change to the backend directory
cd /d "%~dp0\.."

echo 🗑️ Clearing users from database...
call npx ts-node scripts/clearUsers.ts

echo 🚀 Starting Prisma Studio...
rem Start Prisma Studio in a new window
start "Prisma Studio" cmd /c "npx prisma studio"

echo ⏳ Waiting for Prisma Studio to start...
timeout /t 3 /nobreak >nul

echo 🔄 Starting backend server...
rem Start backend server in a new window
start "Backend Server" cmd /c "npm run dev"

echo ⏳ Waiting for backend server to start...
timeout /t 5 /nobreak >nul

echo 🌐 Starting frontend server...
rem Go to frontend (parent) directory and start frontend
cd ..
start "Frontend Server" cmd /c "npm run dev"

echo 🎉 All services started!
echo 📝 Prisma Studio: http://localhost:5555
echo 🖥️ Backend: http://localhost:3001 or 3003
echo 🌐 Frontend: http://localhost:5173 or 5174
echo.
echo Services are running in separate windows. Close the windows to stop the services.

pause 
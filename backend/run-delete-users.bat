@echo off
echo.
echo ================================
echo   USER DELETION SCRIPT
echo ================================
echo.
echo This will delete ALL users from the database!
echo.
set /p confirm=Are you sure? Type 'yes' to continue: 

if /I "%confirm%" NEQ "yes" (
    echo.
    echo Operation cancelled.
    pause
    exit /b
)

echo.
echo Running deletion script...
echo.

node clearAllUsers.js

echo.
echo Script completed.
pause 
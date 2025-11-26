@echo off
cls
color 0B

echo ====================================================================
echo.
echo               AUTH KEY STORAGE SYSTEM
echo                   Quick Start
echo.
echo ====================================================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [1/4] Starting Docker containers...
echo.
docker-compose up -d
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start containers.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/4] Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo [3/4] Initializing database...
echo.
call init-database.bat
if errorlevel 1 (
    echo.
    echo [WARNING] Database initialization had some issues.
    echo          You may need to run init-database.bat manually.
    echo.
)

echo.
echo [4/4] Checking service status...
echo.
docker-compose ps

echo.
echo ====================================================================
echo.
echo   SUCCESS! Application is running!
echo.
echo ====================================================================
echo.
echo   Frontend:  http://localhost
echo   Backend:   http://localhost:8080
echo   API Docs:  http://localhost:8080/swagger-ui.html
echo.
echo ====================================================================
echo.
echo   Test User Account:
echo   ------------------
echo   Email: test@example.com
echo   Password: Test123!
echo   Master Password: Test123!
echo.
echo   Admin Account:
echo   --------------
echo   Email: admin@example.com
echo   Password: Admin123!
echo   Master Password: Admin123!
echo.
echo ====================================================================
echo.
echo   Press any key to view backend logs (Ctrl+C to exit logs)
pause >nul

docker-compose logs -f backend

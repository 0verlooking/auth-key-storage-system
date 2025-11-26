@echo off
REM ============================================================================
REM Load Test Data Script (Windows)
REM ============================================================================
REM This script loads sample auth keys and test data into the database
REM ============================================================================

echo.
echo =========================================
echo   Loading Test Data
echo =========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running or not accessible.
    echo        Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

REM Check if postgres container is running
docker ps --format "{{.Names}}" | findstr /C:"postgres" >nul
if errorlevel 1 (
    echo ERROR: PostgreSQL container is not running.
    echo        Please start the application first with: docker-compose up -d
    echo.
    pause
    exit /b 1
)

echo Loading test data into database...
echo.

REM Execute SQL file
docker-compose exec -T postgres psql -U auth_user -d auth_storage_db < backend\src\main\resources\data-test.sql

if errorlevel 1 (
    echo.
    echo ERROR: Failed to load test data.
    echo        Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================
echo   Test Data Loaded Successfully!
echo =========================================
echo.
echo Test Users Created:
echo   1. User: test@example.com
echo      Password: Test123!
echo      Master Password: Test123!
echo      Auth Keys: 10
echo.
echo   2. Admin: admin@example.com
echo      Password: Admin123!
echo      Master Password: Admin123!
echo      Auth Keys: 4
echo.
echo Folders: Work, Personal, Development
echo Tags: Important, Shared, Development
echo.
echo Navigate to http://localhost and login!
echo.
pause

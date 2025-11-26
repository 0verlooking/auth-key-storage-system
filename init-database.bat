@echo off
REM ============================================================================
REM Initialize Database Script (Windows)
REM ============================================================================
REM This script initializes the database schema and loads test data
REM ============================================================================

echo.
echo =========================================
echo   Database Initialization
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

echo Checking if database tables exist...
echo.

REM Check if users table exists
docker-compose exec -T postgres psql -U auth_user -d auth_storage_db -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');" > temp_check.txt
set /p TABLE_EXISTS=<temp_check.txt
del temp_check.txt

if "%TABLE_EXISTS%"=="f" (
    echo Tables not found. Creating database schema...
    echo.

    REM Create schema
    docker-compose exec -T postgres psql -U auth_user -d auth_storage_db < backend\src\main\resources\schema.sql

    if errorlevel 1 (
        echo.
        echo ERROR: Failed to create database schema.
        echo        Check the error messages above.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo Database schema created successfully!
    echo.
) else (
    echo Database tables already exist.
    echo.
)

REM Load test data
echo Loading test data into database...
echo.

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
echo   Database Initialized Successfully!
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

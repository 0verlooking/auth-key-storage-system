@echo off
REM ============================================================================
REM Complete Reset and Rebuild Script for Auth Key Storage System
REM ============================================================================

echo.
echo ========================================
echo   Auth Key Storage System
echo   Complete Reset and Rebuild
echo ========================================
echo.

REM Step 1: Stop ALL Docker containers
echo [1/6] Stopping ALL Docker containers...
docker stop $(docker ps -aq) 2>nul
if errorlevel 1 (
    echo No containers to stop.
) else (
    echo All containers stopped.
)

REM Step 2: Remove ALL containers
echo.
echo [2/6] Removing ALL Docker containers...
docker rm -f $(docker ps -aq) 2>nul
if errorlevel 1 (
    echo No containers to remove.
) else (
    echo All containers removed.
)

REM Step 3: Remove project volumes
echo.
echo [3/6] Removing project volumes...
docker volume rm auth-key-storage-postgres-data 2>nul
docker volume rm auth-key-storage-redis-data 2>nul
docker volume rm auth-key-storage-pgadmin-data 2>nul
echo Volumes removed (if existed).

REM Step 4: Remove project network
echo.
echo [4/6] Removing project network...
docker network rm auth-key-storage-network 2>nul
echo Network removed (if existed).

REM Step 5: Clean Docker system
echo.
echo [5/6] Cleaning Docker system...
docker system prune -f
echo Docker system cleaned.

REM Step 6: Rebuild and start
echo.
echo [6/6] Building and starting containers...
echo This will take 2-3 minutes...
echo.
docker-compose up -d --build

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Waiting 10 seconds for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Checking service status...
docker-compose ps

echo.
echo ========================================
echo   Application URLs:
echo ========================================
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8080
echo   Swagger:  http://localhost:8080/api/v1/swagger-ui.html
echo ========================================
echo.
echo To view logs:
echo   docker-compose logs -f backend
echo   docker-compose logs -f frontend
echo.
echo Login credentials:
echo   Email: test@example.com
echo   Password: Test123!
echo   Master Password: Test123!
echo.

pause

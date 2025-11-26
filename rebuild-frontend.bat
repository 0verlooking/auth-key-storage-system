@echo off
REM ====================================
REM Rebuild ONLY Frontend Container
REM ====================================

echo.
echo ========================================
echo   Rebuilding Frontend Container
echo ========================================
echo.

echo [1/4] Stopping frontend...
docker-compose stop frontend
if errorlevel 1 (
    echo ERROR: Failed to stop frontend
    pause
    exit /b 1
)

echo.
echo [2/4] Removing frontend container...
docker-compose rm -f frontend
if errorlevel 1 (
    echo ERROR: Failed to remove frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Building and starting frontend...
docker-compose up -d --build frontend
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

echo.
echo [4/4] Checking status...
timeout /t 3 /nobreak >nul
docker-compose ps frontend

echo.
echo ========================================
echo   Frontend Rebuilt Successfully!
echo ========================================
echo.
echo Open http://localhost in your browser
echo.
pause

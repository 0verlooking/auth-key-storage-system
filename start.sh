#!/bin/bash

clear

echo "===================================================================="
echo ""
echo "               AUTH KEY STORAGE SYSTEM"
echo "                   Quick Start"
echo ""
echo "===================================================================="
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "[ERROR] Docker is not running!"
    echo ""
    echo "Please start Docker and try again."
    echo ""
    exit 1
fi

echo "[1/4] Starting Docker containers..."
echo ""
docker compose up -d
if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Failed to start containers."
    echo ""
    exit 1
fi

echo ""
echo "[2/4] Waiting for services to start (30 seconds)..."
sleep 30

echo ""
echo "[3/4] Initializing database..."
echo ""
./init-database.sh
if [ $? -ne 0 ]; then
    echo ""
    echo "[WARNING] Database initialization had some issues."
    echo "          You may need to run ./init-database.sh manually."
    echo ""
fi

echo ""
echo "[4/4] Checking service status..."
echo ""
docker compose ps

echo ""
echo "===================================================================="
echo ""
echo "   SUCCESS! Application is running!"
echo ""
echo "===================================================================="
echo ""
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:8080"
echo "   API Docs:  http://localhost:8080/swagger-ui.html"
echo ""
echo "===================================================================="
echo ""
echo "   Test User Account:"
echo "   ------------------"
echo "   Email: test@example.com"
echo "   Password: Test123!"
echo "   Master Password: Test123!"
echo ""
echo "   Admin Account:"
echo "   --------------"
echo "   Email: admin@example.com"
echo "   Password: Admin123!"
echo "   Master Password: Admin123!"
echo ""
echo "===================================================================="
echo ""
read -p "Press Enter to view backend logs (Ctrl+C to exit logs)..."

docker compose logs -f backend

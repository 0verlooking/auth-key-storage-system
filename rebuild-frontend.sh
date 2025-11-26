#!/bin/bash
# ====================================
# Rebuild ONLY Frontend Container
# ====================================

set -e

echo ""
echo "========================================"
echo "   Rebuilding Frontend Container"
echo "========================================"
echo ""

echo "[1/4] Stopping frontend..."
docker compose stop frontend

echo ""
echo "[2/4] Removing frontend container..."
docker compose rm -f frontend

echo ""
echo "[3/4] Building and starting frontend..."
docker compose up -d --build frontend

echo ""
echo "[4/4] Checking status..."
sleep 3
docker compose ps frontend

echo ""
echo "========================================"
echo "   Frontend Rebuilt Successfully!"
echo "========================================"
echo ""
echo "Open http://localhost in your browser"
echo ""

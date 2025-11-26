#!/bin/bash
# ============================================================================
# Load Test Data Script
# ============================================================================
# This script loads sample auth keys and test data into the database
# ============================================================================

echo "========================================="
echo "  Loading Test Data"
echo "========================================="
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "❌ Error: Docker is not running or you don't have permission to access it."
    echo "   Please start Docker and try again."
    exit 1
fi

# Check if postgres container is running
if ! docker ps --format '{{.Names}}' | grep -q "postgres"; then
    echo "❌ Error: PostgreSQL container is not running."
    echo "   Please start the application first with: docker compose up -d"
    exit 1
fi

echo "📥 Loading test data into database..."
echo ""

# Copy SQL file into container and execute it
docker compose exec -T postgres psql -U auth_user -d auth_storage_db < backend/src/main/resources/data-test.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "  ✅ Test Data Loaded Successfully!"
    echo "========================================="
    echo ""
    echo "Test Users Created:"
    echo "  1. User: test@example.com"
    echo "     Password: Test123!"
    echo "     Master Password: Test123!"
    echo "     Auth Keys: 10"
    echo ""
    echo "  2. Admin: admin@example.com"
    echo "     Password: Admin123!"
    echo "     Master Password: Admin123!"
    echo "     Auth Keys: 4"
    echo ""
    echo "📁 Folders: Work, Personal, Development"
    echo "🏷️  Tags: Important, Shared, Development"
    echo ""
    echo "Navigate to http://localhost and login!"
    echo ""
else
    echo ""
    echo "❌ Error loading test data."
    echo "   Check the error messages above."
    exit 1
fi

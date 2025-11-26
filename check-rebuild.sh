#!/bin/bash
echo "=== Перевірка чи frontend був перебудований ==="
echo ""
echo "1. Перевірка коли був створений frontend image:"
docker images auth-key-storage-system-frontend --format "{{.CreatedAt}}"
echo ""
echo "2. Перевірка коли був створений frontend container:"
docker ps -a --filter "name=frontend" --format "{{.CreatedAt}}"
echo ""
echo "3. Останні зміни в git:"
git log --oneline -3
echo ""
echo "Якщо час створення image старіший за останній коміт - треба перебудувати!"

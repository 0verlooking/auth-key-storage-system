@echo off
cls
color 0A

echo ================================================================
echo.
echo       АВТОМАТИЧНЕ ВИПРАВЛЕННЯ INFINITE LOOP
echo.
echo ================================================================
echo.
echo Що буде зроблено:
echo   1. Зупинка frontend контейнера
echo   2. Видалення старого контейнера
echo   3. Видалення старого image
echo   4. Перебудова з новим кодом
echo   5. Запуск нового frontend
echo.
echo ================================================================
echo.
pause

echo.
echo [1/5] Зупинка frontend...
docker-compose stop frontend
echo ✓ Зупинено

echo.
echo [2/5] Видалення контейнера...
docker-compose rm -f frontend
echo ✓ Видалено

echo.
echo [3/5] Видалення старого image (щоб не використовувати кеш)...
docker image rm -f auth-key-storage-system-frontend
echo ✓ Image видалено

echo.
echo [4/5] Перебудова frontend з НОВИМ кодом (без кешу)...
docker-compose build --no-cache frontend
echo ✓ Перебудовано

echo.
echo [5/5] Запуск нового frontend...
docker-compose up -d frontend
echo ✓ Запущено

echo.
echo ================================================================
echo   Чекаємо 10 секунд поки frontend запуститься...
echo ================================================================
timeout /t 10 /nobreak

echo.
echo ================================================================
echo   Перевірка статусу:
echo ================================================================
docker-compose ps frontend

echo.
echo ================================================================
echo.
echo   ✓✓✓ ГОТОВО! ✓✓✓
echo.
echo   Тепер відкрийте: http://localhost
echo.
echo   Login: admin@example.com
echo   Password: Admin123!
echo   Master Password: Admin123!
echo.
echo   Має працювати БЕЗ блимання!
echo.
echo ================================================================
echo.

echo Натисніть будь-яку клавішу щоб подивитись логи...
pause > nul

echo.
echo Логи frontend (Ctrl+C щоб вийти):
docker-compose logs -f frontend

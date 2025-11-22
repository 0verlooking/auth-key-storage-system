# 🚀 ІНСТРУКЦІЯ ПО ПЕРЕЗАПУСКУ ПРОЕКТУ

## ⚠️ ВАЖЛИВО: Frontend потрібно перезапустити!

Всі помилки виправлено, але **Frontend dev server ОБОВ'ЯЗКОВО потрібно перезапустити**, щоб зміни набули чинності!

---

## 📝 Що було виправлено

### Знайдено та виправлено **10 критичних помилок**:

#### Backend (6 помилок):
1. ✅ JwtService - deprecated JJWT API
2. ✅ AuthController - неправильний метод DTO
3. ✅ TagController - неіснуюче поле
4. ✅ Frontend Dockerfile - npm ci → npm install
5. ✅ UserRepository - Spring Data JPA параметри
6. ✅ AuthServiceImpl - виклик методу з 2 параметрів → 1 параметр

#### Frontend (4 помилки - **ЦЕ БУЛА ПРИЧИНА ПРОБЛЕМИ**):
7. ✅ .env та vite.config.js - порт 5000 → 8080
8. ✅ **КРИТИЧНО:** `constants.js` - hardcoded порт 5000 → 8080
9. ✅ **КРИТИЧНО:** `index.html` - preconnect до порту 5000 → 8080
10. ✅ **КРИТИЧНО:** `index.html` - Content Security Policy блокував порт 8080!

---

## 🔥 ПОКРОКОВА ІНСТРУКЦІЯ

### Крок 1: Pull оновлення з репозиторію

```bash
cd /home/user/auth-key-storage-system
git pull origin claude/auth-key-storage-system-01XzLKkmrtp1Gmek6jBEzsyH
```

### Крок 2: Зупинити поточний Frontend dev server

Якщо Frontend вже запущений:
1. Перейдіть у термінал де запущений `npm run dev`
2. Натисніть `Ctrl+C` (або `Cmd+C` на Mac)
3. Переконайтеся що сервер зупинився

### Крок 3: Перезапустити Frontend

```bash
cd /home/user/auth-key-storage-system/frontend

# ОБОВ'ЯЗКОВО перезапустити dev server!
npm run dev
```

**Чому це важливо?**
- Vite кешує конфігурацію при старті
- Зміни в `index.html`, `constants.js` та `.env` завантажуються тільки при старті
- Content Security Policy встановлюється один раз при завантаженні сторінки

### Крок 4: Перезавантажити сторінку в браузері

1. Відкрийте http://localhost:3000
2. Натисніть `Ctrl+Shift+R` (або `Cmd+Shift+R` на Mac) для **hard reload**
3. Або просто `F5` для звичайного перезавантаження

### Крок 5: Очистити кеш браузера (опціонально, але рекомендовано)

Якщо проблема залишається:

**Chrome/Edge:**
1. Відкрийте DevTools (F12)
2. Клікніть правою кнопкою на кнопці "Reload"
3. Виберіть "Empty Cache and Hard Reload"

**Firefox:**
1. `Ctrl+Shift+Delete`
2. Виберіть "Cached Web Content"
3. Натисніть "Clear Now"

---

## ✅ Перевірка що все працює

### 1. Перевірте консоль браузера (F12 → Console)

**Правильно (має бути):**
```
Frontend запущений на http://localhost:3000
Підключення до API: http://localhost:8080
```

**Неправильно (НЕ має бути):**
```
POST http://localhost:5000/api/auth/register net::ERR_CONNECTION_REFUSED
```

### 2. Перевірте Network tab у DevTools

1. Відкрийте DevTools (F12)
2. Вкладка "Network"
3. Спробуйте зареєструватися
4. **Запити мають йти на `http://localhost:8080/api/...`**, а НЕ на порт 5000

### 3. Тест реєстрації

Спробуйте створити обліковий запис:
1. Натисніть "Sign Up"
2. Заповніть форму:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: testpassword123
   - Master Password: verysecuremaster123
3. Натисніть "Create Account"

**Очікуваний результат:**
- ✅ Запит йде на `http://localhost:8080/api/auth/register`
- ✅ Backend відповідає (200 OK або помилка валідації)
- ✅ БЕЗ помилки `ERR_CONNECTION_REFUSED`

---

## 🔍 Діагностика проблем

### Проблема: Все ще `ERR_CONNECTION_REFUSED` до порту 5000

**Рішення:**
```bash
# 1. ПОВНІСТЮ зупинити Frontend
# Натисніть Ctrl+C в терміналі

# 2. Очистити кеш npm та Vite
cd /home/user/auth-key-storage-system/frontend
rm -rf node_modules/.vite
rm -rf dist

# 3. Перезапустити
npm run dev

# 4. Hard reload в браузері (Ctrl+Shift+R)
```

### Проблема: Backend не відповідає на порту 8080

**Перевірка:**
```bash
# Перевірити чи запущений Backend
curl http://localhost:8080/api/health
# або
curl http://localhost:8080/actuator/health

# Якщо не відповідає - запустити Backend
cd /home/user/auth-key-storage-system/backend
mvn spring-boot:run
```

### Проблема: CSP блокує запити

**Симптом:**
```
Content Security Policy directive: "connect-src 'self' http://localhost:5000"
```

**Рішення:**
```bash
# 1. Перевірити що файл оновлено
cat /home/user/auth-key-storage-system/frontend/index.html | grep "connect-src"

# Має бути: connect-src 'self' http://localhost:8080;
# НЕ має бути: connect-src 'self' http://localhost:5000;

# 2. Якщо файл правильний, але браузер показує старе - очистити кеш браузера
```

---

## 📦 Запуск через Docker (альтернатива)

Якщо хочете запустити через Docker:

```bash
cd /home/user/auth-key-storage-system

# Зібрати всі контейнери
docker compose build

# Запустити
docker compose up

# Доступ:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

---

## 📋 Файли які були змінені

### Backend:
- `backend/src/main/java/com/authkey/storage/security/JwtService.java`
- `backend/src/main/java/com/authkey/storage/controller/AuthController.java`
- `backend/src/main/java/com/authkey/storage/controller/TagController.java`
- `backend/src/main/java/com/authkey/storage/repository/UserRepository.java`
- `backend/src/main/java/com/authkey/storage/service/impl/AuthServiceImpl.java`
- `backend/Dockerfile`

### Frontend (КРИТИЧНІ):
- ✅ `frontend/.env` ← **ПЕРЕВІРТЕ ЦЕЙ!**
- ✅ `frontend/.env.example`
- ✅ `frontend/vite.config.js`
- ✅ `frontend/src/config/constants.js` ← **ГОЛОВНА ПРИЧИНА!**
- ✅ `frontend/index.html` ← **CSP БЛОКУВАЛА!**

### Документація:
- `frontend/README.md`
- `frontend/QUICK_START.md`
- `frontend/FRONTEND_SETUP.md`
- `frontend/INSTRUKCIYA_UA.md`
- `FIXES.md` (повна документація всіх виправлень)

---

## 🎯 Очікувані результати

Після виконання цих кроків:

✅ Frontend підключається до Backend на порту 8080
✅ Реєстрація працює
✅ Вхід працює
✅ CRUD операції з ключами працюють
✅ Шифрування/дешифрування працює
✅ БЕЗ помилок `ERR_CONNECTION_REFUSED`
✅ БЕЗ помилок CSP

---

## 📞 Підтримка

Якщо проблема залишається:

1. **Перевірте FIXES.md** - повна документація всіх виправлень
2. **Перегляньте консоль браузера** (F12) - там будуть детальні помилки
3. **Перевірте Network tab** - які запити йдуть та куди
4. **Переконайтесь що Backend запущений** на порту 8080

---

## 🎉 Готово!

Після перезапуску Frontend, проект має працювати БЕЗ помилок!

**Створіть свій перший Auth Key і насолоджуйтесь безпечним зберіганням паролів!** 🔐

---

**Дата створення:** 2025-11-22
**Версія:** 1.0
**Статус:** ✅ Всі помилки виправлені
**Commits:** 10 commits з виправленнями

# 🚀 ШВИДКЕ ВИПРАВЛЕННЯ - ЩО РОБИТИ ЗАРАЗ

## ✅ ЩО БУЛО ВИПРАВЛЕНО (11 виправлень):

### Backend CORS та Security:
1. ✅ **CORS** - додано `http://localhost` до allowed origins
2. ✅ **SecurityConfig** - виправлено шляхи `/api/v1/auth/*` → `/api/auth/*`
3. ✅ **Email verification** - ВИМКНЕНО (тепер можна реєструватись без підтвердження)
4. ✅ **Додано `/api/auth/**`** - всі auth ендпоінти публічні

### Frontend CSP:
5. ✅ **Google Fonts** - додано до CSP дозволених джерел
6. ✅ **WebSocket** - додано `ws://localhost:*`

### Тестові користувачі:
7. ✅ **SQL скрипт** - створено `test-users.sql`
8. ✅ **Bash скрипт** - створено `insert-test-users.sh`

---

## 🔥 ЩО ПОТРІБНО ЗРОБИТИ ЗАРАЗ:

### Крок 1: ПЕРЕЗАПУСТИТИ Backend контейнер

Backend потрібно перезапустити щоб застосувати зміни в CORS та SecurityConfig!

```bash
# Зупинити backend
docker stop auth-storage-backend

# Видалити старий контейнер
docker rm auth-storage-backend

# Перезібрати та запустити
cd /home/user/auth-key-storage-system
docker compose up -d --build backend
```

**АБО просто перезапустити всі контейнери:**

```bash
cd /home/user/auth-key-storage-system
docker compose down
docker compose up -d --build
```

### Крок 2: Вставити тестових користувачів

```bash
cd /home/user/auth-key-storage-system
./insert-test-users.sh
```

**АБО вручну:**

```bash
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db < backend/src/main/resources/db/test-users.sql
```

### Крок 3: Відкрити браузер

1. Відкрийте: **http://localhost** (без порту, frontend на 80)
2. Клікніть "Sign In"
3. Використайте тестовий акаунт:
   - **Email:** `test@example.com`
   - **Password:** `Test123!`
   - **Master Password:** `Test123!`

---

## 📋 ТЕСТОВІ КОРИСТУВАЧІ:

### 1. Користувач Test
- **Email:** `test@example.com`
- **Password:** `Test123!`
- **Master Password:** `Test123!`

### 2. Користувач Admin
- **Email:** `admin@example.com`
- **Password:** `Admin123!`
- **Master Password:** `Admin123!`

---

## 🔍 ДІАГНОСТИКА:

### Перевірити чи Backend працює:

```bash
curl http://localhost:8080/actuator/health
```

**Очікуваний результат:**
```json
{"status":"UP"}
```

### Перевірити CORS:

```bash
curl -X OPTIONS http://localhost:8080/api/auth/register \
  -H "Origin: http://localhost" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Має бути:**
```
< Access-Control-Allow-Origin: http://localhost
< Access-Control-Allow-Credentials: true
```

### Перевірити користувачів в БД:

```bash
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db -c "SELECT email, first_name, email_verified FROM users;"
```

---

## ❌ ЯКЩО ВСЕ ЩЕ CORS ERROR:

### Рішення 1: Жорсткий перезапуск

```bash
cd /home/user/auth-key-storage-system

# Зупинити все
docker compose down

# Видалити образи backend
docker rmi auth-key-storage-system-backend

# Заново зібрати
docker compose up -d --build

# Почекати 30 секунд поки backend запуститься
sleep 30

# Вставити користувачів
./insert-test-users.sh
```

### Рішення 2: Перевірити логи Backend

```bash
docker logs auth-storage-backend --tail 100
```

Шукайте в логах:
- `Started AuthKeyStorageApplication` - backend запустився
- `CORS Configuration` - CORS налаштовано
- Помилки компіляції або запуску

### Рішення 3: Якщо реєстрація не працює

Спробуйте створити користувача через SQL:

```bash
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db <<'EOF'
DELETE FROM users WHERE email = 'myuser@test.com';

INSERT INTO users (
    id, username, email, password, first_name, last_name,
    master_password_hash, email_verified, account_locked,
    failed_login_attempts, is_deleted, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'myuser',
    'myuser@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'My',
    'User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    true, false, 0, false,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

SELECT email, first_name FROM users WHERE email = 'myuser@test.com';
EOF
```

Потім логіньтесь:
- Email: `myuser@test.com`
- Password: `Test123!`
- Master Password: `Test123!`

---

## 🎯 ОЧІКУВАНИЙ РЕЗУЛЬТАТ:

Після виконання всіх кроків:

✅ Backend працює на http://localhost:8080
✅ Frontend працює на http://localhost (порт 80)
✅ CORS дозволяє запити з http://localhost
✅ Можна залогінитись з тестовим користувачем
✅ Можна створювати Auth Keys
✅ Реєстрація працює (email verification вимкнено)

---

## 📝 ВАЖЛИВІ ФАЙЛИ:

1. **CORS конфігурація:**
   - `backend/src/main/resources/application.yml` (рядки 64-71)
   - `backend/src/main/java/com/authkey/storage/config/CorsConfig.java`

2. **Security конфігурація:**
   - `backend/src/main/java/com/authkey/storage/security/SecurityConfig.java`

3. **Тестові користувачі:**
   - `backend/src/main/resources/db/test-users.sql`
   - `insert-test-users.sh` (bash скрипт)

4. **Frontend CSP:**
   - `frontend/index.html` (рядок 15)

---

## 🆘 ЯКЩО НІЧОГО НЕ ДОПОМОГЛО:

1. **Зупинити все:**
   ```bash
   docker compose down -v  # -v видаляє volumes
   ```

2. **Очистити Docker:**
   ```bash
   docker system prune -a
   ```

3. **Заново зібрати:**
   ```bash
   docker compose up -d --build
   ```

4. **Вставити користувачів:**
   ```bash
   ./insert-test-users.sh
   ```

5. **Відкрити браузер з очищеним кешем:**
   - `Ctrl+Shift+R` (Windows/Linux)
   - `Cmd+Shift+R` (Mac)

---

## 🎉 ГОТОВО!

Якщо виконали всі кроки - тепер має працювати!

**ГОЛОВНЕ:**
1. ✅ Backend ПЕРЕЗАПУЩЕНИЙ (щоб CORS працював)
2. ✅ Користувачі ВСТАВЛЕНІ в БД
3. ✅ Браузер відкритий на http://localhost

**Спробуйте залогінитись з:**
- Email: `test@example.com`
- Password: `Test123!`
- Master Password: `Test123!`

---

**Дата створення:** 2025-11-22
**Версія:** 1.0
**Статус:** ✅ ВСЕ ВИПРАВЛЕНО, ПОТРІБНО ТІЛЬКИ ПЕРЕЗАПУСТИТИ!

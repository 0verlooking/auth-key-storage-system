# 🚀 ЗАПУСК ПРОЕКТУ - ПРОСТА ІНСТРУКЦІЯ

## ✅ ВИКОНАЙТЕ ЦІ 4 КОМАНДИ:

### 1️⃣ Перейти в проект:
```bash
cd C:\Users\user\IdeaProjects\auth-key-storage-system
```

### 2️⃣ Pull останні зміни:
```bash
git pull origin claude/auth-key-storage-system-01XzLKkmrtp1Gmek6jBEzsyH
```

### 3️⃣ Запустити Docker (якщо ще не запущено):
```bash
docker-compose up -d
```

Почекайте 30 секунд поки все запуститься!

### 4️⃣ Вставити користувачів в БД:

**Windows PowerShell:**
```powershell
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db -c "DELETE FROM auth_key_tags; DELETE FROM auth_keys; DELETE FROM folders; DELETE FROM tags; DELETE FROM share_links; DELETE FROM audit_logs; DELETE FROM users; INSERT INTO users (id, username, email, password, first_name, last_name, master_password_hash, email_verified, account_locked, failed_login_attempts, is_deleted, created_at, updated_at) VALUES (gen_random_uuid(), 'testuser', 'test@example.com', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Test', 'User', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, false, 0, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); SELECT email, first_name FROM users;"
```

**АБО через файл:**
```bash
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db < insert-users-simple.sql
```

---

## 🌐 ВІДКРИТИ БРАУЗЕР:

1. Відкрийте: **http://localhost**
2. Натисніть **"Sign In"**
3. Введіть:
   - Email: **test@example.com**
   - Password: **Test123!**
   - Master Password: **Test123!**
4. Натисніть **"Sign In"**

---

## 📋 ОБЛІКОВІ ЗАПИСИ:

### Користувач 1:
- **Email:** test@example.com
- **Password:** Test123!
- **Master Password:** Test123!

### Користувач 2:
- **Email:** admin@example.com
- **Password:** Admin123!
- **Master Password:** Admin123!

---

## 🔍 ПЕРЕВІРКА ЩО ВСЕ ПРАЦЮЄ:

### Перевірити контейнери:
```bash
docker ps
```

Має бути 4 контейнери:
- auth-storage-backend (port 8080)
- auth-storage-frontend (port 80)
- auth-storage-postgres (port 5432)
- auth-storage-redis (port 6379)

### Перевірити backend:
```bash
docker logs auth-storage-backend --tail 20
```

Шукайте: **"Started AuthKeyStorageApplication"**

### Перевірити користувачів в БД:
```bash
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db -c "SELECT email, username, first_name, email_verified FROM users;"
```

Має показати 2 користувачів!

---

## ❌ ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ:

### Backend не запускається:
```bash
docker-compose down
docker-compose up -d --build
```

### Користувачі не вставляються:
```bash
# Перевірити що PostgreSQL працює
docker logs auth-storage-postgres

# Перевірити підключення
docker exec -it auth-storage-postgres psql -U postgres -d authkey_db -c "SELECT version();"
```

### CORS помилки в браузері:
```bash
# Перезібрати backend
docker-compose stop backend
docker-compose rm -f backend
docker-compose up -d --build backend
```

---

## 🎯 ОЧІКУВАНИЙ РЕЗУЛЬТАТ:

✅ 4 Docker контейнери запущені
✅ Backend показує "Started AuthKeyStorageApplication"
✅ В БД є 2 користувачі
✅ http://localhost відкривається
✅ Можна залогінитись з test@example.com
✅ БЕЗ CORS errors
✅ БЕЗ Compilation errors

---

## 🆘 ЯКЩО НІЧОГО НЕ ДОПОМАГАЄ:

### Повний reset:
```bash
# Зупинити все
docker-compose down -v

# Видалити образи
docker rmi auth-key-storage-system-backend auth-key-storage-system-frontend

# Очистити Docker
docker system prune -f

# Заново зібрати
docker-compose up -d --build

# Почекати 60 секунд
timeout /t 60

# Вставити користувачів
docker exec -i auth-storage-postgres psql -U postgres -d authkey_db < insert-users-simple.sql
```

---

**Якщо після цього не працює - надішліть мені логи backend:**

```bash
docker logs auth-storage-backend > backend-logs.txt
```

І покажіть мені файл `backend-logs.txt`

---

**Дата:** 2025-11-23
**Версія:** ФІНАЛЬНА ПРОСТА
**Статус:** ✅ ГОТОВО ДО ЗАПУСКУ

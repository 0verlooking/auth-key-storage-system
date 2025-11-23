# 🚀 ЗАПУСК ПРОЕКТУ - ОСТАТОЧНА ІНСТРУКЦІЯ

## ✅ ВИКОНАЙТЕ ЦІ 5 КОМАНД:

### 1️⃣ Pull останні зміни:
```bash
cd C:\Users\user\IdeaProjects\auth-key-storage-system
git pull origin claude/auth-key-storage-system-01XzLKkmrtp1Gmek6jBEzsyH
```

### 2️⃣ Зупинити всі контейнери:
```bash
docker-compose down
```

### 3️⃣ Запустити Docker ЗАНОВО (пересоздасть БД):
```bash
docker-compose up -d --build
```

**ВАЖЛИВО:** Почекайте **60 секунд** поки все запуститься!

### 4️⃣ Вставити користувачів в БД:

**Windows PowerShell:**
```powershell
docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db < insert-users-simple.sql
```

**АБО Windows CMD:**
```cmd
type insert-users-simple.sql | docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db
```

### 5️⃣ Відкрити браузер та залогінитись!

1. Відкрийте: **http://localhost**
2. Натисніть **"Sign In"**
3. Введіть:
   - **Email:** `test@example.com`
   - **Password:** `Test123!`
4. Натисніть **"Sign In"**

---

## 📋 ОБЛІКОВІ ЗАПИСИ:

### Користувач 1:
- **Email:** test@example.com
- **Password:** Test123!

### Користувач 2 (ADMIN):
- **Email:** admin@example.com
- **Password:** Admin123!

---

## 🔍 ПЕРЕВІРКА ЩО ВСЕ ПРАЦЮЄ:

### Перевірити контейнери:
```bash
docker ps
```

Має бути **4 контейнери** з статусом "Up":
- auth-storage-backend (port 8080)
- auth-storage-frontend (port 80)
- auth-storage-postgres (port 5432)
- auth-storage-redis (port 6379)

### Перевірити backend логи:
```bash
docker logs auth-storage-backend --tail 30
```

Шукайте рядок: **"Started AuthKeyStorageApplication"** ← backend готовий!

### Перевірити користувачів в БД:
```bash
docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db -c "SELECT id, email, username, first_name, role FROM users;"
```

Має показати **2 користувачів**: test@example.com та admin@example.com

---

## ❌ ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ:

### Backend не запускається:
```bash
# Переглянути логи
docker logs auth-storage-backend --tail 50

# Якщо є помилки компіляції
docker-compose down
docker rmi auth-key-storage-system-backend
docker-compose up -d --build
```

### Користувачі не вставляються:
```bash
# Перевірити що PostgreSQL працює
docker logs auth-storage-postgres --tail 20

# Перевірити підключення
docker exec -it auth-storage-postgres psql -U auth_user -d auth_storage_db -c "SELECT version();"

# Перевірити структуру таблиці
docker exec -it auth-storage-postgres psql -U auth_user -d auth_storage_db -c "\d users"
```

### CORS помилки в браузері:
```bash
# Переглянути логи backend
docker logs auth-storage-backend --tail 30 --follow

# Перезібрати backend
docker-compose stop backend
docker-compose rm -f backend
docker-compose up -d --build backend
```

---

## 🎯 ОЧІКУВАНИЙ РЕЗУЛЬТАТ:

Після виконання всіх кроків:

✅ 4 Docker контейнери запущені
✅ Backend показує "Started AuthKeyStorageApplication"
✅ В БД є 2 користувачі (test@example.com та admin@example.com)
✅ http://localhost відкривається
✅ Можна залогінитись з test@example.com / Test123!
✅ **БЕЗ CORS errors**
✅ **БЕЗ Compilation errors**
✅ **БЕЗ Database errors**

---

## 🆘 ПОВНИЙ RESET (якщо нічого не допомагає):

```bash
# Зупинити все та видалити volumes
docker-compose down -v

# Видалити образи
docker rmi auth-key-storage-system-backend auth-key-storage-system-frontend

# Очистити Docker
docker system prune -f

# Заново зібрати
docker-compose up -d --build

# Почекати 90 секунд
timeout /t 90

# Вставити користувачів
docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db < insert-users-simple.sql

# Перевірити
docker logs auth-storage-backend --tail 20
```

---

## 📝 ЩО БУЛО ВИПРАВЛЕНО В ЦЬОМУ ОНОВЛЕННІ:

1. ✅ **SQL insert script** - виправлено структуру INSERT:
   - Прибрано `gen_random_uuid()` (ID тепер auto-increment)
   - Прибрано неіснуючу колонку `master_password_hash`
   - Виправлено назви колонок (`is_email_verified` замість `email_verified`)
   - Додано колонку `role` зі значеннями USER/ADMIN

2. ✅ **Docker-compose.yml** - змінено DDL режим:
   - `JPA_DDL_AUTO: update` → `JPA_DDL_AUTO: create`
   - Hibernate тепер **ПЕРЕСОЗДАСТЬ** схему БД з усіма потрібними колонками
   - База даних буде мати ВСІ колонки з User Entity

3. ✅ **Database schema** - тепер повністю відповідає User Entity:
   - Всі колонки з BaseEntity (created_at, updated_at, deleted_at, is_deleted)
   - Всі колонки з User (email_verification_token_expires_at, password_reset_token, тощо)

---

## 🎉 ГОТОВО!

**Виконайте 5 простих кроків і ВСЕ ЗАПРАЦЮЄ!**

1. ✅ `git pull`
2. ✅ `docker-compose down`
3. ✅ `docker-compose up -d --build` (почекати 60 секунд)
4. ✅ Вставити користувачів через SQL скрипт
5. ✅ Відкрити **http://localhost** та залогінитись!

---

**Якщо є проблеми - читайте розділ "ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ"!**

**Дата:** 2025-11-23
**Версія:** ОСТАТОЧНА (DATABASE SCHEMA FIX)
**Статус:** ✅ ГОТОВО ДО ЗАПУСКУ

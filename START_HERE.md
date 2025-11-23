# 🚀 ЗАПУСК ПРОЕКТУ - НАЙПРОСТІША ІНСТРУКЦІЯ

## ✅ ВИКОНАЙТЕ ЦІ 3 КОМАНДИ:

### 1️⃣ Pull останні зміни:
```bash
cd C:\Users\user\IdeaProjects\auth-key-storage-system
git pull origin claude/auth-key-storage-system-01XzLKkmrtp1Gmek6jBEzsyH
```

### 2️⃣ Перезапустити Docker:
```bash
docker-compose down
docker-compose up -d --build
```

**ВАЖЛИВО:** Почекайте **60-90 секунд** поки все запуститься!

### 3️⃣ Відкрити браузер та залогінитись!

1. Відкрийте: **http://localhost**
2. Натисніть **"Sign In"**
3. Введіть:
   - **Email:** `test@example.com`
   - **Password:** `Test123!`
4. Натисніть **"Sign In"**

**ВСЕ!** Користувачі створюються АВТОМАТИЧНО при запуску backend!

---

## 📋 ОБЛІКОВІ ЗАПИСИ (створюються автоматично):

### Користувач 1:
- **Email:** test@example.com
- **Password:** Test123!
- **Role:** USER

### Користувач 2 (ADMIN):
- **Email:** admin@example.com
- **Password:** Admin123!
- **Role:** ADMIN

**Примітка:** Backend автоматично створює цих користувачів при старті, якщо база даних порожня!

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
docker logs auth-storage-backend --tail 50
```

Шукайте:
- **"Started AuthKeyStorageApplication"** ← backend запустився
- **"Database seeding completed successfully!"** ← користувачі створені
- **"Created user: test@example.com"** ← тестовий користувач створений
- **"Created user: admin@example.com"** ← адмін створений

### Перевірити користувачів в БД:
```bash
docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db -c "SELECT id, email, username, first_name, role, is_email_verified FROM users;"
```

Має показати **2 користувачів**: test@example.com (USER) та admin@example.com (ADMIN)

---

## ❌ ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ:

### Backend не запускається:
```bash
# Переглянути повні логи
docker logs auth-storage-backend

# Якщо є помилки компіляції, перезібрати
docker-compose down
docker rmi auth-key-storage-system-backend
docker-compose up -d --build backend
```

### Користувачі не створюються автоматично:
```bash
# Перевірити логи backend на наявність помилок seeding
docker logs auth-storage-backend | grep -i "seed\|created user"

# Якщо база не порожня, очистити та перезапустити
docker-compose down -v
docker-compose up -d --build
```

### CORS помилки в браузері:
```bash
# Переглянути логи backend в реальному часі
docker logs auth-storage-backend --tail 30 --follow

# Перевірити що CORS налаштовано правильно
docker logs auth-storage-backend | grep -i "cors"
```

### Login не працює:
```bash
# Перевірити що користувач існує
docker exec -i auth-storage-postgres psql -U auth_user -d auth_storage_db -c "SELECT email, username, role, is_email_verified FROM users WHERE email='test@example.com';"

# Якщо користувача немає, перевірити чому seeder не спрацював
docker logs auth-storage-backend | grep -i "error\|exception"
```

---

## 🎯 ОЧІКУВАНИЙ РЕЗУЛЬТАТ:

Після виконання 3 простих кроків:

✅ 4 Docker контейнери запущені
✅ Backend показує "Started AuthKeyStorageApplication"
✅ Backend показує "Database seeding completed successfully!"
✅ В БД є 2 користувачі (створені автоматично!)
✅ http://localhost відкривається
✅ Можна залогінитись з test@example.com / Test123!
✅ **БЕЗ CORS errors**
✅ **БЕЗ Compilation errors**
✅ **БЕЗ Database errors**
✅ **БЕЗ потреби вручну вставляти користувачів!**

---

## 🆘 ПОВНИЙ RESET (якщо нічого не допомагає):

```bash
# Зупинити все та видалити volumes (очистити БД)
docker-compose down -v

# Видалити образи
docker rmi auth-key-storage-system-backend auth-key-storage-system-frontend

# Очистити Docker
docker system prune -f

# Заново зібрати
docker-compose up -d --build

# Почекати 90 секунд
timeout /t 90

# Перевірити логи
docker logs auth-storage-backend --tail 50
```

Шукайте в логах:
- ✅ "Started AuthKeyStorageApplication"
- ✅ "Database seeding completed successfully!"
- ✅ "Created user: test@example.com"
- ✅ "Created user: admin@example.com"

---

## 📝 ЩО БУЛО ВИПРАВЛЕНО В ЦЬОМУ ОНОВЛЕННІ:

1. ✅ **Automatic Database Seeding** - КЛЮЧОВА ЗМІНА!
   - Backend тепер АВТОМАТИЧНО створює тестових користувачів при старті
   - Перевіряє чи база порожня, якщо так - створює test@example.com та admin@example.com
   - Паролі хешуються ПРАВИЛЬНО (SHA-256 на frontend, потім BCrypt на backend)
   - **БЕЗ ПОТРЕБИ ВРУЧНУ ЗАПУСКАТИ SQL СКРИПТИ!**

2. ✅ **Password Hashing Fix**:
   - Frontend хешує пароль з SHA-256 перед відправкою
   - Backend зберігає BCrypt hash від цього SHA-256 хешу
   - DatabaseSeeder використовує ТУ САМУ логіку хешування
   - Тепер паролі співпадають і login працює!

3. ✅ **Docker-compose.yml** - DDL режим `create`:
   - Hibernate ПЕРЕСОЗДАСТЬ схему БД з усіма колонками
   - База даних буде мати ВСІ колонки з User Entity та BaseEntity

4. ✅ **Simplified Workflow**:
   - Раніше: pull → down → up → wait → run SQL script → login
   - ТЕПЕР: pull → down → up → wait → login
   - **НА 1 КРОК МЕНШЕ!**

---

## 🎉 ГОТОВО!

**Виконайте 3 прості кроки і ВСЕ ЗАПРАЦЮЄ!**

1. ✅ `git pull`
2. ✅ `docker-compose down && docker-compose up -d --build`
3. ✅ Почекати 60-90 секунд, відкрити **http://localhost** та залогінитись!

**НЕ ПОТРІБНО вручну вставляти користувачів - вони створюються автоматично!**

---

## 🔥 ДЕТАЛЬНИЙ ПРОЦЕС ЗАПУСКУ:

```bash
# 1. Перейти в проект
cd C:\Users\user\IdeaProjects\auth-key-storage-system

# 2. Pull останні зміни
git pull origin claude/auth-key-storage-system-01XzLKkmrtp1Gmek6jBEzsyH

# 3. Перезапустити Docker
docker-compose down
docker-compose up -d --build

# 4. Почекати та переглянути логи
timeout /t 60
docker logs auth-storage-backend --tail 50

# 5. Відкрити браузер
start http://localhost
```

---

**Якщо є проблеми - читайте розділ "ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ"!**

**Дата:** 2025-11-23
**Версія:** ФІНАЛЬНА (AUTOMATIC SEEDING)
**Статус:** ✅ READY TO USE - NO MANUAL SQL NEEDED!

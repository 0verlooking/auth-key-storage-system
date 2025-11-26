# 🚀 Auth Key Storage System - Quick Start Guide

## ⚠️ ВАЖЛИВО: Якщо у вас проблеми з запуском

### Проблема: Запускається інший проект (BiometricStressAnalysisApplication)

**Причина:** У вас запущені Docker контейнери з іншого проекту або ви в неправильній директорії.

**Рішення:**

#### Windows:
```cmd
cd C:\Users\user\IdeaProjects\auth-key-storage-system
rebuild.bat
```

#### Linux/Mac:
```bash
cd /path/to/auth-key-storage-system
chmod +x rebuild.sh
./rebuild.sh
```

---

## 📋 Автоматичний скрипт (rebuild.bat / rebuild.sh)

Скрипт автоматично:
1. ✅ Зупиняє **ВСІ** Docker контейнери
2. ✅ Видаляє **ВСІ** Docker контейнери
3. ✅ Видаляє volumes проекту (база даних буде очищена!)
4. ✅ Видаляє мережу проекту
5. ✅ Очищає Docker system
6. ✅ Перебудовує і запускає контейнери

---

## 🔧 Ручний запуск (якщо скрипт не працює)

### 1. Переконайтесь що ви в правильній директорії:

```bash
# Windows
cd C:\Users\user\IdeaProjects\auth-key-storage-system

# Linux/Mac
cd /path/to/auth-key-storage-system

# Перевірте що ви в правильному місці:
dir docker-compose.yml   # Windows
ls docker-compose.yml    # Linux/Mac
```

### 2. Зупиніть ВСІ контейнери:

```bash
# Зупинити всі контейнери
docker stop $(docker ps -aq)

# Видалити всі контейнери
docker rm -f $(docker ps -aq)
```

### 3. Видаліть volumes (база даних буде очищена):

```bash
docker volume rm auth-key-storage-postgres-data
docker volume rm auth-key-storage-redis-data
docker volume rm auth-key-storage-pgadmin-data
```

### 4. Очистіть Docker:

```bash
docker system prune -f
```

### 5. Перебудуйте проект:

```bash
# Windows
docker-compose down -v
docker-compose up -d --build

# Linux/Mac
docker compose down -v
docker compose up -d --build
```

### 6. Перевірте статус:

```bash
# Windows
docker-compose ps
docker-compose logs -f backend

# Linux/Mac
docker compose ps
docker compose logs -f backend
```

---

## ✅ Як перевірити що запущено ПРАВИЛЬНИЙ проект

### Перевірте логи backend:

```bash
docker compose logs backend | head -20
```

**✅ ПРАВИЛЬНО** - має бути:
```
Starting AuthKeyStorageApplication
Auth Key Storage System
```

**❌ НЕПРАВИЛЬНО** - якщо бачите:
```
Starting BiometricStressAnalysisApplication
```

Якщо бачите неправильне ім'я - ви запустили **інший проект**! Поверніться до кроку 1.

---

## 🌐 URL додатку після запуску

| Сервіс | URL |
|--------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8080 |
| **Swagger UI** | http://localhost:8080/api/v1/swagger-ui.html |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

---

## 🔐 Тестові облікові дані

### Звичайний користувач:
```
Email: test@example.com
Password: Test123!
Master Password: Test123!
```

### Адміністратор:
```
Email: admin@example.com
Password: Admin123!
Master Password: Admin123!
```

---

## 📦 Ініціалізація бази даних

Після першого запуску база даних буде порожня. Щоб створити схему і завантажити тестові дані:

### Windows:
```cmd
init-database.bat
```

### Linux/Mac:
```bash
chmod +x init-database.sh
./init-database.sh
```

**Цей скрипт автоматично:**
1. ✅ Перевіряє чи існують таблиці в базі даних
2. ✅ Створює схему бази даних (якщо таблиць немає)
3. ✅ Завантажує тестові дані

### Що буде завантажено:
- ✅ **10 auth keys** для test@example.com
  - GitHub Account, VPN, Jira (Work folder)
  - Gmail, Amazon (Personal folder)
  - AWS API, OpenAI, GitHub Token, SSH Key (Development folder)
  - Google Authenticator backup codes
- ✅ **4 auth keys** для admin@example.com
  - System Admin Panel, Database Root, SSL Certificate, Monitoring API
- ✅ **3 папки**: Work, Personal, Development
- ✅ **3 теги**: Important, Shared, Development
- ✅ Audit log записи

---

## 🛡️ Адмін Панель

Адміністратор має доступ до спеціальної панелі управління:

1. Логін як **admin@example.com**
2. У sidebar з'явиться пункт "Admin Panel"
3. Відкриється панель з вкладками:
   - **Statistics** - загальна статистика системи
   - **Users** - список всіх користувачів (блокування/розблокування)
   - **Auth Keys** - метадані всіх ключів (без розшифрованих значень!)
   - **System Info** - інформація про систему

### Можливості адміна:
- ✅ Перегляд всіх користувачів
- ✅ Блокування/розблокування облікових записів
- ✅ Перегляд статистики (кількість ключів, папок, тегів)
- ✅ Перегляд метаданих auth keys (без паролів!)

---

## 📊 Перевірка чи все працює

### 1. Відкрийте http://localhost у браузері

### 2. Увійдіть з тестовими даними

### 3. Має відкритися Dashboard БЕЗ помилок

### 4. Спробуйте створити Auth Key:
   - Натисніть "Add Key"
   - Заповніть форму
   - Збережіть

### 5. Перевірте логи - НЕ має бути спаму:
```bash
docker compose logs -f backend
```

**✅ Правильно:** Тільки важливі повідомлення
**❌ Неправильно:** Сотні рядків "Fetching auth keys..."

---

## 🐛 Troubleshooting

### Проблема: Port already in use

```bash
# Знайти що використовує порт
netstat -ano | findstr :8080   # Windows
lsof -i :8080                  # Linux/Mac

# Вбити процес
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # Linux/Mac
```

### Проблема: Cannot connect to Docker daemon

```bash
# Переконайтесь що Docker Desktop запущено
# Windows: Перевірте трей
# Linux: sudo systemctl start docker
```

### Проблема: Database connection errors

```bash
# Видаліть volumes і перезапустіть
docker compose down -v
docker compose up -d --build
```

### Проблема: CORS errors

Перевірте що CORS налаштовано правильно:
```bash
# Має бути: http://localhost,http://localhost:3000,http://localhost:80
docker compose exec backend env | grep CORS
```

---

## 📝 Корисні команди

```bash
# Переглянути всі контейнери
docker ps -a

# Переглянути логи
docker compose logs -f backend
docker compose logs -f frontend

# Перезапустити окремий сервіс
docker compose restart backend

# Зупинити все
docker compose down

# Зупинити і видалити volumes
docker compose down -v

# Перебудувати без кешу
docker compose build --no-cache
docker compose up -d
```

---

## 🎯 Очікувана поведінка

### ✅ Що має працювати:

1. **Login** - вхід з тестовими даними
2. **Dashboard** - відображається без постійних запитів
3. **Create Auth Key** - можна створити новий ключ
4. **Folders** - управління папками (CRUD)
5. **Tags** - управління тегами (CRUD) з кольорами
6. **Settings** - зміна теми, пароля
7. **Логи backend** - чисті, без спаму

### ❌ Чого НЕ має бути:

1. ❌ Постійні запити до API кожну мілісекунду
2. ❌ Логи забиті SQL запитами
3. ❌ Помилки 500/401/403
4. ❌ CORS errors
5. ❌ База даних видаляється при перезапуску

---

## 💡 Поради

1. **Завжди перевіряйте** що ви в правильній директорії перед запуском
2. **Використовуйте rebuild скрипт** для чистого старту
3. **Перевіряйте логи** після запуску щоб переконатись що все ОК
4. **Не змінюйте** docker-compose.yml без необхідності

---

## 📞 Підтримка

Якщо проблеми залишаються:
1. Запустіть rebuild скрипт
2. Перевірте логи: `docker compose logs -f backend`
3. Перевірте що запущено правильний проект (AuthKeyStorageApplication)
4. Перевірте чи всі порти вільні

---

**Версія:** 1.0.0
**Останнє оновлення:** 2025-11-25

# 🚀 Auth Key Storage System - Quick Start

## ⚡ Швидкий запуск (найпростіший спосіб)

### Windows:
```cmd
start.bat
```

### Linux/Mac:
```bash
./start.sh
```

**Скрипт автоматично:**
1. ✅ Запустить Docker контейнери
2. ✅ Дочекається поки сервіси запустяться
3. ✅ Створить схему бази даних
4. ✅ Завантажить тестові дані
5. ✅ Покаже інформацію для входу

---

## 🌐 Після запуску

Відкрийте браузер: **http://localhost**

### Тестові облікові дані:

**Звичайний користувач:**
```
Email: test@example.com
Password: Test123!
Master Password: Test123!
```

**Адміністратор:**
```
Email: admin@example.com
Password: Admin123!
Master Password: Admin123!
```

---

## 📦 Що включено в тестові дані

### Для test@example.com (10 ключів):
- GitHub Account, VPN, Jira (Work folder)
- Gmail, Amazon (Personal folder)
- AWS API, OpenAI, GitHub Token, SSH Key (Development folder)
- Google Authenticator backup codes

### Для admin@example.com (4 ключі):
- System Admin Panel
- Database Root
- SSL Certificate
- Monitoring API

### Також:
- ✅ 3 папки: Work, Personal, Development
- ✅ 3 теги: Important, Shared, Development
- ✅ Audit log записи

---

## 🛡️ Адмін Панель

1. Логін як **admin@example.com**
2. У sidebar з'явиться пункт "Admin Panel"
3. Доступні вкладки:
   - **Statistics** - загальна статистика системи
   - **Users** - список всіх користувачів
   - **Auth Keys** - метадані всіх ключів (без паролів!)
   - **System Info** - інформація про систему

---

## 🔧 Ручна установка (якщо автоматичний скрипт не спрацював)

### 1. Запустіть контейнери:

```bash
# Windows
docker-compose up -d

# Linux/Mac
docker compose up -d
```

### 2. Почекайте 30 секунд поки все запуститься

### 3. Ініціалізуйте базу даних:

```bash
# Windows
init-database.bat

# Linux/Mac
./init-database.sh
```

### 4. Перевірте статус:

```bash
# Windows
docker-compose ps

# Linux/Mac
docker compose ps
```

---

## 🔄 Повна перебудова (якщо щось не працює)

### Windows:
```cmd
rebuild.bat
```

### Linux/Mac:
```bash
./rebuild.sh
```

Це видалить **ВСЕ** (контейнери, volumes, images) і збере проект з нуля.

**⚠️ УВАГА:** Всі дані в базі даних будуть втрачені!

---

## 🌐 URL сервісів

| Сервіс | URL |
|--------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8080 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

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
docker compose up -d
```

### Проблема: Frontend не завантажується

```bash
# Перебудуйте frontend
docker compose stop frontend
docker compose rm -f frontend
docker compose up -d --build frontend
```

---

## 📝 Корисні команди

### Переглянути логи:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Перезапустити сервіс:
```bash
docker compose restart backend
docker compose restart frontend
```

### Зупинити все:
```bash
docker compose down
```

### Зупинити і видалити volumes:
```bash
docker compose down -v
```

### Перебудувати без кешу:
```bash
docker compose build --no-cache
docker compose up -d
```

---

## ✅ Очікувана поведінка

### Що має працювати:
1. ✅ Login - вхід з тестовими даними
2. ✅ Dashboard - відображається без постійних запитів
3. ✅ Create Auth Key - можна створити новий ключ
4. ✅ Folders - управління папками (CRUD)
5. ✅ Tags - управління тегами (CRUD) з кольорами
6. ✅ Settings - зміна теми, пароля
7. ✅ Admin Panel - для адміністратора

### Чого НЕ має бути:
1. ❌ Постійні запити до API кожну мілісекунду
2. ❌ Логи забиті SQL запитами
3. ❌ Помилки 500/401/403
4. ❌ CORS errors
5. ❌ База даних видаляється при перезапуску
6. ❌ Нескінченне "Loading keys..."

---

## 🎯 Архітектура

### Backend:
- **Framework:** Spring Boot 3.2
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Security:** Spring Security + JWT
- **API Docs:** Swagger/OpenAPI

### Frontend:
- **Framework:** React 18
- **UI:** Material-UI (MUI)
- **State:** React Context API
- **Router:** React Router v6
- **Encryption:** Web Crypto API (AES-256-GCM)

### Security:
- ✅ Zero-knowledge encryption (client-side)
- ✅ JWT authentication
- ✅ Role-based access control (USER, ADMIN)
- ✅ Audit logging
- ✅ Password strength validation
- ✅ 2FA ready (infrastructure)

---

## 📞 Підтримка

Якщо проблеми залишаються:
1. Запустіть rebuild скрипт
2. Перевірте логи: `docker compose logs -f backend`
3. Перевірте що запущено правильний проект (AuthKeyStorageApplication)
4. Перевірте чи всі порти вільні

---

**Версія:** 1.0.0
**Останнє оновлення:** 2025-11-26

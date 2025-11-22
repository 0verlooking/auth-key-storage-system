# Docker Configuration Summary

## Auth Key Storage System - Docker Infrastructure

Дата створення: 2025-11-22

---

## Створені файли

### 1. Backend Dockerfile
**Файл**: `/home/user/auth-key-storage-system/backend/Dockerfile`

**Особливості**:
- Multi-stage build (Maven build + JRE runtime)
- Stage 1: Maven 3.9.6 + JDK 17 для збірки
- Stage 2: Eclipse Temurin 17 JRE для runtime
- Непривілейований користувач (appuser)
- Health check на actuator/health endpoint
- Оптимізований розмір образу

**Розмір**: ~3.9 KB

---

### 2. Frontend Dockerfile
**Файл**: `/home/user/auth-key-storage-system/frontend/Dockerfile`

**Особливості**:
- Multi-stage build (Node.js build + Nginx runtime)
- Stage 1: Node 18 Alpine для збірки з Vite
- Stage 2: Nginx 1.25 Alpine для production
- Build аргументи для Vite змінних
- Health check на /health endpoint
- Оптимізований розмір образу

**Розмір**: ~3.2 KB

---

### 3. Nginx Configuration
**Файл**: `/home/user/auth-key-storage-system/frontend/nginx.conf`

**Особливості**:
- Повна конфігурація для SPA (React Router support)
- API проксі до backend
- Gzip compression
- Security headers (X-Frame-Options, CSP, etc.)
- Cache headers для статичних файлів
- Health check endpoint
- WebSocket support

**Розмір**: ~7.1 KB

---

### 4. Docker Compose
**Файл**: `/home/user/auth-key-storage-system/docker-compose.yml`

**Сервіси**:
1. **postgres**: PostgreSQL 15 Alpine
   - Port: 5432
   - Volume: postgres-data
   - Health check: pg_isready

2. **redis**: Redis 7 Alpine
   - Port: 6379
   - Volume: redis-data
   - Health check: redis-cli ping

3. **backend**: Spring Boot Application
   - Port: 8080
   - Depends on: postgres, redis
   - Health check: actuator/health
   - Resource limits: 2 CPU, 2GB RAM

4. **frontend**: React + Nginx
   - Port: 80
   - Depends on: backend
   - Health check: /health
   - Resource limits: 1 CPU, 512MB RAM

5. **pgadmin**: PostgreSQL Admin (опціонально)
   - Port: 5050
   - Profile: dev/development
   - Volume: pgadmin-data

**Networks**:
- app-network (bridge)

**Volumes**:
- postgres-data
- redis-data
- pgadmin-data

**Розмір**: ~8.9 KB

---

### 5. Backend .dockerignore
**Файл**: `/home/user/auth-key-storage-system/backend/.dockerignore`

**Виключає**:
- Maven build output (target/)
- IDE files (.idea, .vscode, *.iml)
- Git files
- Documentation
- Test files
- Logs and temporary files

**Розмір**: ~1.2 KB

---

### 6. Frontend .dockerignore
**Файл**: `/home/user/auth-key-storage-system/frontend/.dockerignore`

**Виключає**:
- node_modules/
- build/dist output
- IDE files
- Git files
- Test files
- Environment files
- Development configurations

**Розмір**: ~1.5 KB

---

### 7. Makefile
**Файл**: `/home/user/auth-key-storage-system/Makefile`

**Категорії команд** (40+ команд):

**Основні**:
- build, build-backend, build-frontend
- up, down, restart
- restart-backend, restart-frontend

**Логи та моніторинг**:
- logs, logs-backend, logs-frontend
- status, health

**Очищення**:
- clean, clean-all, clean-volumes
- prune

**База даних**:
- db-migrate, db-reset
- db-backup, db-restore

**Shell доступ**:
- shell-backend, shell-frontend
- shell-db, shell-redis

**Тестування**:
- test, test-backend

**Розробка**:
- dev (з pgadmin)
- prod (production mode)
- rebuild

**Інформація**:
- info, urls, help

**Розмір**: ~14 KB

---

### 8. Environment Template
**Файл**: `/home/user/auth-key-storage-system/.env.docker`

**Секції**:
1. **Application Settings**: Spring profiles
2. **Database**: PostgreSQL credentials and settings
3. **Redis**: Password and configuration
4. **JWT**: Secret keys and expiration times
5. **Backend**: Ports, CORS, logging
6. **Frontend**: Vite build variables
7. **Email**: SMTP configuration
8. **PgAdmin**: Development tools

**Безпека**:
- Усі паролі мають placeholder значення
- Детальні інструкції для production
- Warnings про зміну секретів

**Розмір**: ~5.9 KB

---

### 9. Documentation
**Файл**: `/home/user/auth-key-storage-system/docs/DOCKER_SETUP.md`

**Розділи**:
1. Вимоги (Docker, Docker Compose, Make)
2. Швидкий старт
3. Структура проекту
4. Конфігурація сервісів
5. Використання
6. Makefile команди
7. Troubleshooting
8. Production Deployment
9. Моніторинг
10. Backup та Recovery

**Особливості**:
- Детальні інструкції для кожного кроку
- Приклади команд
- Best practices
- Security considerations
- Disaster recovery plan

**Розмір**: ~22 KB

---

## Загальна структура проекту

```
auth-key-storage-system/
├── backend/
│   ├── src/
│   ├── Dockerfile              ✅ Створено
│   ├── .dockerignore           ✅ Створено
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── Dockerfile              ✅ Створено
│   ├── nginx.conf              ✅ Створено
│   ├── .dockerignore           ✅ Створено
│   └── package.json
├── docs/
│   └── DOCKER_SETUP.md         ✅ Створено
├── docker-compose.yml          ✅ Створено
├── Makefile                    ✅ Створено
└── .env.docker                 ✅ Створено
```

---

## Швидкий старт

### 1. Налаштування

```bash
# Копіювати environment файл
cp .env.docker .env

# (Опціонально) Редагувати змінні оточення
nano .env
```

### 2. Запуск з Make (рекомендовано)

```bash
# Показати всі команди
make help

# Збудувати образи
make build

# Запустити всі сервіси
make up

# Перевірити статус
make status
```

### 3. Запуск з Docker Compose

```bash
# Збудувати та запустити
docker-compose up -d --build

# Перевірити статус
docker-compose ps

# Переглянути логи
docker-compose logs -f
```

### 4. Перевірка

Після запуску сервіси доступні за адресами:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **PgAdmin** (dev mode): http://localhost:5050

```bash
# Перевірка через Make
make health

# Або через curl
curl http://localhost:8080/actuator/health
curl http://localhost/health
```

---

## Основні команди

### Щоденне використання

```bash
# Запустити проект
make up

# Переглянути логи
make logs

# Перезапустити backend після змін
make restart-backend

# Зупинити проект
make down
```

### Розробка

```bash
# Запустити з PgAdmin
make dev

# Доступ до бази даних
make shell-db

# Backup бази даних
make db-backup

# Переглянути всі URLs
make urls
```

### Production

```bash
# Створити production .env
cp .env.docker .env.production

# Редагувати налаштування
nano .env.production

# Запустити в production режимі
docker-compose --env-file .env.production up -d --build
```

---

## Технологічний стек

### Backend
- **Framework**: Spring Boot 3.2.3
- **Java**: JDK 17
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Build**: Maven 3.9.6
- **Container**: Eclipse Temurin JRE Alpine

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Web Server**: Nginx 1.25
- **Node**: 18 LTS
- **Container**: Node Alpine + Nginx Alpine

### Infrastructure
- **Orchestration**: Docker Compose 3.8
- **Networking**: Bridge network
- **Volumes**: Named volumes for persistence
- **Monitoring**: Health checks, Actuator metrics

---

## Особливості конфігурації

### 🎯 Production-Ready
- Multi-stage builds для мінімального розміру образів
- Health checks для всіх сервісів
- Resource limits для контролю використання ресурсів
- Security headers в Nginx
- Non-root users в контейнерах

### 🚀 Performance
- Layer caching для швидкої збірки
- Gzip compression
- Оптимізовані JVM параметри
- Redis для кешування

### 🔒 Security
- Непривілейовані користувачі
- Environment-based secrets
- Security headers
- Isolated network

### 🛠 Developer Experience
- One-command setup: `make up`
- Comprehensive Makefile з 40+ командами
- Colored output у Make командах
- PgAdmin для розробки
- Hot reload підтримка

### 📊 Monitoring
- Health endpoints для всіх сервісів
- Actuator metrics
- Centralized logging
- Resource monitoring через `docker stats`

### 💾 Data Persistence
- Named volumes для PostgreSQL
- Named volumes для Redis
- Backup/Restore команди
- Volume management через Make

---

## Вимоги

### Мінімальні
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM
- 2 CPU cores
- 10GB disk space

### Рекомендовані
- Docker 24.0+
- Docker Compose 2.20+
- 8GB RAM
- 4 CPU cores
- 20GB disk space
- Make для зручності

---

## Troubleshooting

### Контейнери не запускаються
```bash
docker-compose logs
docker-compose ps
```

### Порт вже зайнятий
```bash
# Змінити порти в .env
BACKEND_PORT=8081
FRONTEND_PORT=8000
```

### Database connection refused
```bash
# Перезапустити з чистого старту
make down
make clean-volumes
make up
```

### Out of memory
```bash
# Зменшити Java heap в .env
JAVA_OPTS=-Xms256m -Xmx512m
```

Детальніше в [DOCKER_SETUP.md](docs/DOCKER_SETUP.md#troubleshooting)

---

## Production Deployment Checklist

- [ ] Змінити всі паролі в .env.production
- [ ] Згенерувати криптографічно безпечний JWT_SECRET
- [ ] Налаштувати JPA_DDL_AUTO=validate
- [ ] Налаштувати CORS для реального домену
- [ ] Налаштувати SSL/TLS (reverse proxy)
- [ ] Налаштувати автоматичні backups
- [ ] Налаштувати моніторинг та alerting
- [ ] Обмежити доступ до портів PostgreSQL та Redis
- [ ] Налаштувати централізоване логування
- [ ] Протестувати disaster recovery процес

---

## Наступні кроки

1. **Запустити проект**:
   ```bash
   make build
   make up
   ```

2. **Перевірити роботу**:
   ```bash
   make health
   make urls
   ```

3. **Розробка**:
   - Використовувати `make dev` для розробки з PgAdmin
   - Переглядати логи: `make logs`
   - Доступ до бази: `make shell-db`

4. **Production**:
   - Прочитати [DOCKER_SETUP.md](docs/DOCKER_SETUP.md#production-deployment)
   - Налаштувати .env.production
   - Налаштувати SSL/TLS
   - Налаштувати backups

---

## Корисні посилання

- **Документація**: [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)
- **Make команди**: `make help`
- **URLs**: `make urls`
- **Статус**: `make status`

---

## Підтримка

Для питань та проблем:
1. Перевірте [Troubleshooting](docs/DOCKER_SETUP.md#troubleshooting)
2. Перегляньте логи: `make logs`
3. Створіть GitHub Issue

---

**Конфігурацію створено**: 2025-11-22
**Версія**: 1.0.0
**Всього файлів**: 9
**Загальний розмір**: ~67 KB

---

## Автор

Auth Key Storage Team

**Статус**: ✅ Всі файли успішно створено та готові до використання!

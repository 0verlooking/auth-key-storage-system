# Docker Setup Guide

## Auth Key Storage System - Docker Configuration

Повна документація по налаштуванню та використанню Docker для Auth Key Storage System.

---

## Зміст

- [Вимоги](#вимоги)
- [Швидкий старт](#швидкий-старт)
- [Структура проекту](#структура-проекту)
- [Конфігурація](#конфігурація)
- [Використання](#використання)
- [Makefile команди](#makefile-команди)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)
- [Моніторинг](#моніторинг)
- [Backup та Recovery](#backup-та-recovery)

---

## Вимоги

### Системні вимоги

- **Docker**: версія 20.10 або новіша
- **Docker Compose**: версія 2.0 або новіша
- **Make**: для використання Makefile команд (опціонально)
- **Git**: для клонування репозиторію

### Перевірка встановлення

```bash
# Перевірка версії Docker
docker --version
# Очікуваний результат: Docker version 20.10.x або новіша

# Перевірка версії Docker Compose
docker-compose --version
# Очікуваний результат: Docker Compose version v2.x.x або новіша

# Перевірка Make
make --version
# Очікуваний результат: GNU Make 4.x або новіша
```

### Мінімальні ресурси

- **CPU**: 2+ cores (рекомендовано 4+)
- **RAM**: 4GB+ (рекомендовано 8GB+)
- **Disk**: 10GB+ вільного місця

---

## Швидкий старт

### 1. Клонування репозиторію

```bash
git clone <repository-url>
cd auth-key-storage-system
```

### 2. Налаштування змінних оточення

```bash
# Копіювання шаблону .env
cp .env.docker .env

# Редагування змінних оточення (опціонально)
nano .env
```

**ВАЖЛИВО**: Змініть паролі та секрети перед production deployment!

### 3. Запуск за допомогою Make (рекомендовано)

```bash
# Показати всі доступні команди
make help

# Збудувати образи
make build

# Запустити всі сервіси
make up

# Перевірити статус
make status
```

### 4. Запуск за допомогою Docker Compose

```bash
# Збудувати та запустити всі сервіси
docker-compose up -d --build

# Перевірити статус
docker-compose ps

# Переглянути логи
docker-compose logs -f
```

### 5. Перевірка роботи

Після запуску сервіси будуть доступні за наступними адресами:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

```bash
# Перевірка health endpoints
curl http://localhost:8080/actuator/health
curl http://localhost/health
```

---

## Структура проекту

```
auth-key-storage-system/
├── backend/
│   ├── src/
│   ├── Dockerfile              # Multi-stage build для backend
│   ├── .dockerignore
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── Dockerfile              # Multi-stage build для frontend
│   ├── nginx.conf              # Nginx конфігурація
│   ├── .dockerignore
│   └── package.json
├── docs/
│   └── DOCKER_SETUP.md         # Ця документація
├── docker-compose.yml          # Головний файл конфігурації
├── Makefile                    # Команди для зручного управління
└── .env.docker                 # Шаблон змінних оточення
```

---

## Конфігурація

### Docker Compose Services

#### 1. PostgreSQL Database

```yaml
Service: postgres
Image: postgres:15-alpine
Port: 5432 (external: configurable)
Volume: postgres-data
```

**Змінні оточення**:
- `POSTGRES_DB`: Ім'я бази даних
- `POSTGRES_USER`: Користувач БД
- `POSTGRES_PASSWORD`: Пароль БД

#### 2. Redis Cache

```yaml
Service: redis
Image: redis:7-alpine
Port: 6379 (external: configurable)
Volume: redis-data
```

**Змінні оточення**:
- `REDIS_PASSWORD`: Пароль Redis

#### 3. Backend (Spring Boot)

```yaml
Service: backend
Build: ./backend/Dockerfile
Port: 8080 (external: configurable)
Dependencies: postgres, redis
```

**Основні змінні оточення**:
- `SPRING_PROFILES_ACTIVE`: Spring профіль (docker/dev/prod)
- `SPRING_DATASOURCE_URL`: URL бази даних
- `SPRING_DATA_REDIS_HOST`: Redis host
- `JWT_SECRET`: JWT секретний ключ
- `JAVA_OPTS`: JVM параметри

#### 4. Frontend (React + Nginx)

```yaml
Service: frontend
Build: ./frontend/Dockerfile
Port: 80 (external: configurable)
Dependencies: backend
```

**Build аргументи**:
- `VITE_API_BASE_URL`: URL для API запитів
- `VITE_APP_TITLE`: Назва додатку
- `VITE_APP_VERSION`: Версія додатку

#### 5. PgAdmin (Опціонально)

```yaml
Service: pgadmin
Image: dpage/pgadmin4
Port: 5050 (external: configurable)
Profile: dev/development
```

**Змінні оточення**:
- `PGADMIN_DEFAULT_EMAIL`: Email для входу
- `PGADMIN_DEFAULT_PASSWORD`: Пароль для входу

### Environment Variables

Детальний опис усіх змінних оточення в файлі `.env.docker`.

**Критичні змінні для зміни в production**:

```bash
# Безпека
JWT_SECRET=<strong-random-secret-256-bits>
POSTGRES_PASSWORD=<strong-random-password>
REDIS_PASSWORD=<strong-random-password>

# Режим
SPRING_PROFILES_ACTIVE=prod
JPA_DDL_AUTO=validate
LOG_LEVEL_ROOT=WARN
```

---

## Використання

### Основні операції

#### Запуск сервісів

```bash
# З Make
make up

# Без Make
docker-compose up -d
```

#### Зупинка сервісів

```bash
# З Make
make down

# Без Make
docker-compose down
```

#### Перезапуск

```bash
# Всі сервіси
make restart

# Окремий сервіс
make restart-backend
make restart-frontend

# Або через Docker Compose
docker-compose restart backend
```

#### Перегляд логів

```bash
# Всі сервіси
make logs

# Окремий сервіс
make logs-backend
make logs-frontend
make logs-postgres

# Або через Docker Compose
docker-compose logs -f backend
```

#### Статус сервісів

```bash
# З Make
make status

# Без Make
docker-compose ps
```

### Режими роботи

#### Development Mode

Включає PgAdmin для управління базою даних:

```bash
# З Make
make dev

# Без Make
docker-compose --profile dev up -d
```

Доступ до PgAdmin: http://localhost:5050

**Підключення до БД в PgAdmin**:
- Host: `postgres`
- Port: `5432`
- Database: `auth_storage_db`
- Username: `auth_user`
- Password: `auth_password_change_me`

#### Production Mode

Оптимізовані налаштування для production:

```bash
# Створити production .env
cp .env.docker .env.production

# Редагувати налаштування
nano .env.production

# Запустити
docker-compose --env-file .env.production up -d --build
```

### Shell доступ

#### Backend Container

```bash
# З Make
make shell-backend

# Без Make
docker exec -it auth-storage-backend sh
```

#### Frontend Container

```bash
# З Make
make shell-frontend

# Без Make
docker exec -it auth-storage-frontend sh
```

#### PostgreSQL

```bash
# З Make
make shell-db

# Без Make
docker exec -it auth-storage-postgres psql -U auth_user -d auth_storage_db
```

#### Redis CLI

```bash
# З Make
make shell-redis

# Без Make
docker exec -it auth-storage-redis redis-cli -a redis_password_change_me
```

---

## Makefile команди

### Довідка

```bash
make help
```

### Категорії команд

#### Основні команди

- `make build` - Збудувати всі образи
- `make build-backend` - Збудувати backend образ
- `make build-frontend` - Збудувати frontend образ
- `make up` - Запустити всі сервіси
- `make down` - Зупинити всі сервіси
- `make restart` - Перезапустити всі сервіси
- `make restart-backend` - Перезапустити backend
- `make restart-frontend` - Перезапустити frontend

#### Логи та моніторинг

- `make logs` - Логи всіх сервісів
- `make logs-backend` - Логи backend
- `make logs-frontend` - Логи frontend
- `make logs-postgres` - Логи PostgreSQL
- `make logs-redis` - Логи Redis
- `make status` - Статус контейнерів
- `make health` - Health check всіх сервісів

#### Очищення

- `make clean` - Видалити контейнери та образи
- `make clean-all` - Видалити все (включно з volumes)
- `make clean-volumes` - Видалити тільки volumes
- `make prune` - Очистити невикористовувані Docker об'єкти

#### База даних

- `make db-migrate` - Запустити міграції
- `make db-reset` - Скинути базу даних
- `make db-backup` - Створити backup
- `make db-restore FILE=backup.sql` - Відновити з backup

#### Shell доступ

- `make shell-backend` - Shell в backend контейнері
- `make shell-frontend` - Shell в frontend контейнері
- `make shell-db` - PostgreSQL CLI
- `make shell-redis` - Redis CLI

#### Тестування

- `make test` - Запустити всі тести
- `make test-backend` - Запустити backend тести

#### Розробка

- `make dev` - Запустити в режимі розробки (з pgadmin)
- `make prod` - Запустити в production режимі
- `make rebuild` - Повна перебудова

#### Інформація

- `make info` - Інформація про проект
- `make urls` - Показати всі URLs

---

## Troubleshooting

### Проблема: Контейнери не запускаються

**Рішення**:

```bash
# Перевірити логи
docker-compose logs

# Перевірити статус
docker-compose ps

# Перевірити використання портів
netstat -tulpn | grep -E '80|8080|5432|6379'
```

### Проблема: Backend не може підключитися до PostgreSQL

**Симптоми**: Помилка "Connection refused" або "Unknown host"

**Рішення**:

```bash
# Перевірити що PostgreSQL запущено
docker-compose ps postgres

# Перевірити health check
docker inspect auth-storage-postgres | grep -A 10 Health

# Перезапустити з чистого старту
make down
make clean-volumes
make up
```

### Проблема: Frontend показує 502 Bad Gateway

**Причини**:
- Backend ще не запустився
- Помилка в nginx конфігурації

**Рішення**:

```bash
# Перевірити статус backend
docker-compose ps backend

# Перевірити health backend
curl http://localhost:8080/actuator/health

# Перевірити логи nginx
docker-compose logs frontend

# Перевірити nginx конфігурацію
docker exec auth-storage-frontend nginx -t
```

### Проблема: Out of memory

**Симптоми**: Контейнери crashються з exit code 137

**Рішення**:

1. Збільшити Docker memory limit:
   - Docker Desktop: Settings → Resources → Memory

2. Зменшити Java heap size:
```bash
# В .env файлі
JAVA_OPTS=-Xms256m -Xmx512m
```

3. Обмежити ресурси в docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 1G
```

### Проблема: Повільна збірка образів

**Рішення**:

```bash
# Використовувати BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Очистити build cache
docker builder prune

# Збудувати з кешем
docker-compose build
```

### Проблема: Permission denied (volumes)

**Рішення**:

```bash
# Linux: надати права на volumes
sudo chown -R $USER:$USER ./

# Або видалити та створити знову volumes
docker-compose down -v
docker-compose up -d
```

### Проблема: Port already in use

**Симптоми**: "bind: address already in use"

**Рішення**:

```bash
# Знайти процес що використовує порт
lsof -i :8080
# або
netstat -tulpn | grep 8080

# Змінити порт в .env файлі
BACKEND_PORT=8081
FRONTEND_PORT=8000

# Або зупинити процес
kill -9 <PID>
```

### Проблема: Slow database queries

**Рішення**:

```bash
# Увімкнути SQL logging
# В .env:
JPA_SHOW_SQL=true

# Оптимізувати PostgreSQL
# Збільшити shared_buffers та work_mem в docker-compose.yml

# Створити індекси
make shell-db
# Потім в psql:
CREATE INDEX idx_user_email ON users(email);
```

---

## Production Deployment

### Підготовка до production

#### 1. Створити production .env файл

```bash
cp .env.docker .env.production
```

#### 2. Налаштувати змінні оточення

```bash
# .env.production
SPRING_PROFILES_ACTIVE=prod

# Strong passwords (використовуйте password manager)
POSTGRES_PASSWORD=<generated-strong-password>
REDIS_PASSWORD=<generated-strong-password>
JWT_SECRET=<cryptographically-secure-random-256-bit-string>

# Database
JPA_DDL_AUTO=validate  # НЕ використовуйте update в production!
JPA_SHOW_SQL=false

# Logging
LOG_LEVEL_ROOT=WARN
LOG_LEVEL_APP=INFO

# Java
JAVA_OPTS=-Xms1024m -Xmx2048m -XX:+UseG1GC

# CORS (вкажіть реальні домени)
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Email (налаштуйте реальний SMTP)
MAIL_HOST=smtp.yourdomain.com
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=<mail-password>
```

#### 3. SSL/TLS налаштування

Для production рекомендується використовувати reverse proxy (Nginx, Traefik) з SSL:

```yaml
# docker-compose.prod.yml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
```

#### 4. Backup стратегія

```bash
# Налаштувати автоматичні backups (cron job)
0 2 * * * cd /path/to/project && make db-backup
```

### Запуск в production

```bash
# Збудувати образи
docker-compose --env-file .env.production build --no-cache

# Запустити
docker-compose --env-file .env.production up -d

# Перевірити health
make health

# Моніторити логи
docker-compose logs -f --tail=100
```

### Security Best Practices

1. **Не використовуйте root користувача**
   - Dockerfiles вже налаштовані на непривілейованих користувачів

2. **Обмежте мережевий доступ**
   ```bash
   # Не експонуйте PostgreSQL та Redis порти назовні
   # Видаліть "ports:" секції для postgres та redis в production
   ```

3. **Регулярні оновлення**
   ```bash
   # Оновлюйте базові образи
   docker-compose pull
   docker-compose up -d --build
   ```

4. **Secrets Management**
   - Використовуйте Docker Secrets або vault systems
   - Не комітьте .env файли до Git

5. **Моніторинг**
   - Налаштуйте alerting для критичних помилок
   - Використовуйте централізоване логування

---

## Моніторинг

### Health Checks

Всі сервіси мають health checks:

```bash
# Перевірити health всіх сервісів
make health

# Docker native health checks
docker inspect --format='{{.State.Health.Status}}' auth-storage-backend
docker inspect --format='{{.State.Health.Status}}' auth-storage-postgres
```

### Metrics

Backend експонує Actuator metrics:

```bash
# Health endpoint
curl http://localhost:8080/actuator/health

# Metrics endpoint
curl http://localhost:8080/actuator/metrics

# Specific metric
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

### Logging

#### Централізований logging

Опціонально можна додати ELK stack або аналоги:

```yaml
# docker-compose.monitoring.yml
services:
  elasticsearch:
    image: elasticsearch:8.5.0

  logstash:
    image: logstash:8.5.0

  kibana:
    image: kibana:8.5.0
```

#### Переглядати логи

```bash
# Real-time логи
docker-compose logs -f

# Останні 100 рядків
docker-compose logs --tail=100

# Фільтрувати по сервісу
docker-compose logs -f backend | grep ERROR
```

### Resource Monitoring

```bash
# Поточне використання ресурсів
docker stats

# З форматуванням
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Через Make
make status
```

---

## Backup та Recovery

### Database Backup

#### Автоматичний backup

```bash
# Створити backup
make db-backup

# Backup зберігається в ./backups/backup_YYYYMMDD_HHMMSS.sql
```

#### Ручний backup

```bash
# SQL dump
docker exec auth-storage-postgres pg_dump -U auth_user auth_storage_db > backup.sql

# З compression
docker exec auth-storage-postgres pg_dump -U auth_user auth_storage_db | gzip > backup.sql.gz
```

#### Scheduled backups (cron)

```bash
# Додати до crontab
crontab -e

# Щоденний backup о 2:00 AM
0 2 * * * cd /path/to/auth-key-storage-system && make db-backup
```

### Database Restore

```bash
# Через Make
make db-restore FILE=./backups/backup_20240101_020000.sql

# Вручну
cat backup.sql | docker exec -i auth-storage-postgres psql -U auth_user auth_storage_db

# З compressed backup
gunzip -c backup.sql.gz | docker exec -i auth-storage-postgres psql -U auth_user auth_storage_db
```

### Volume Backup

```bash
# Створити backup всього volume
docker run --rm \
  -v auth-key-storage-postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-volume-$(date +%Y%m%d).tar.gz -C /data .

# Restore volume
docker run --rm \
  -v auth-key-storage-postgres-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres-volume-20240101.tar.gz -C /data
```

### Disaster Recovery Plan

1. **Regular backups**: Щоденні автоматичні backups
2. **Off-site storage**: Зберігати backups в іншому місці
3. **Test restores**: Регулярно тестувати процес відновлення
4. **Documentation**: Задокументувати процедури recovery

---

## Додаткова інформація

### Docker Best Practices

1. **Multi-stage builds** - Зменшення розміру образів
2. **Layer caching** - Оптимізація часу збірки
3. **Health checks** - Автоматична перевірка стану
4. **Resource limits** - Обмеження використання ресурсів
5. **Non-root users** - Безпека контейнерів

### Корисні команди

```bash
# Переглянути розмір образів
docker images | grep auth-storage

# Очистити невикористовувані образи
docker image prune -a

# Переглянути volumes
docker volume ls

# Інспектувати volume
docker volume inspect auth-key-storage-postgres-data

# Експорт/Імпорт образу
docker save auth-storage-backend:latest | gzip > backend.tar.gz
docker load < backend.tar.gz
```

### Networking

```bash
# Переглянути мережі
docker network ls

# Інспектувати мережу
docker network inspect auth-key-storage-network

# Переглянути підключені контейнери
docker network inspect auth-key-storage-network | grep -A 10 Containers
```

---

## Підтримка

Якщо у вас виникли проблеми:

1. Перевірте [Troubleshooting](#troubleshooting) секцію
2. Перегляньте логи: `make logs`
3. Перевірте GitHub Issues
4. Створіть новий Issue з детальним описом проблеми

---

## Ліцензія

Цей проект розповсюджується під ліцензією MIT.

---

**Версія документації**: 1.0.0
**Остання оновлення**: 2024-01-01

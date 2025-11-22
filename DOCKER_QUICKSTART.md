# Docker Quick Start Guide

Швидкий посібник для запуску Auth Key Storage System з Docker.

---

## 🚀 Швидкий старт (3 команди)

```bash
# 1. Налаштування
cp .env.docker .env

# 2. Запуск
make build && make up

# 3. Перевірка
make health
```

**Готово!** Проект запущено на:
- Frontend: http://localhost
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## 📋 Основні команди

### Запуск та зупинка

```bash
make up          # Запустити всі сервіси
make down        # Зупинити всі сервіси
make restart     # Перезапустити
```

### Логи

```bash
make logs              # Всі логи
make logs-backend      # Тільки backend
make logs-frontend     # Тільки frontend
```

### Статус

```bash
make status      # Показати статус контейнерів
make health      # Перевірити health endpoints
make urls        # Показати всі доступні URLs
```

---

## 🛠 Розробка

```bash
# Режим розробки з PgAdmin
make dev

# Перезапустити після змін
make restart-backend    # Якщо змінили backend
make restart-frontend   # Якщо змінили frontend

# Доступ до бази даних
make shell-db

# Backup бази даних
make db-backup
```

---

## 🧹 Очищення

```bash
make clean            # Видалити контейнери та образи
make clean-volumes    # Видалити дані БД (з підтвердженням)
make prune           # Видалити всі невикористовувані Docker об'єкти
```

---

## 🔧 Troubleshooting

### Проблема: Порти зайняті

```bash
# Змінити порти в .env файлі
nano .env

# Змінити:
BACKEND_PORT=8081
FRONTEND_PORT=8000
```

### Проблема: Backend не підключається до БД

```bash
# Повний рестарт
make down
make clean-volumes
make up
```

### Проблема: Помилка "out of memory"

```bash
# Зменшити використання пам'яті в .env
JAVA_OPTS=-Xms256m -Xmx512m
```

---

## 📚 Детальна документація

Для повної документації дивіться:
- **Docker Setup**: [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)
- **Make Commands**: `make help`
- **Summary**: [DOCKER_CONFIGURATION_SUMMARY.md](DOCKER_CONFIGURATION_SUMMARY.md)

---

## 🔐 Production

**ВАЖЛИВО**: Перед production deployment:

1. Створити production .env:
   ```bash
   cp .env.docker .env.production
   ```

2. Змінити паролі та секрети:
   ```bash
   nano .env.production
   # Змінити:
   # - POSTGRES_PASSWORD
   # - REDIS_PASSWORD
   # - JWT_SECRET (мінімум 256 біт!)
   ```

3. Запустити:
   ```bash
   docker-compose --env-file .env.production up -d --build
   ```

---

## 📊 Корисні команди Docker

```bash
# Переглянути образи
docker images

# Переглянути використання ресурсів
docker stats

# Переглянути volumes
docker volume ls

# Очистити все
docker system prune -af
```

---

## 🎯 Швидкі перевірки

```bash
# Перевірити що все працює
curl http://localhost:8080/actuator/health
curl http://localhost/health

# Переглянути логи backend
docker logs -f auth-storage-backend

# Підключитися до PostgreSQL
docker exec -it auth-storage-postgres psql -U auth_user -d auth_storage_db

# Підключитися до Redis
docker exec -it auth-storage-redis redis-cli -a redis_password_change_me
```

---

## ✅ Checklist для першого запуску

- [ ] Docker та Docker Compose встановлені
- [ ] Скопійовано `.env` файл: `cp .env.docker .env`
- [ ] Порти 80, 8080, 5432, 6379 вільні
- [ ] Мінімум 4GB RAM доступно
- [ ] Запущено: `make build && make up`
- [ ] Перевірено: `make health`
- [ ] Відкрито браузер: http://localhost

---

**Потрібна допомога?**
- Запустіть `make help` для всіх команд
- Дивіться [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) для детальної інформації
- Перевірте секцію Troubleshooting

# ============================================================================
# Makefile for Auth Key Storage System
# ============================================================================
# Зручні команди для управління Docker контейнерами
# Використання: make [command]
# ============================================================================

.PHONY: help build up down restart logs clean status test db-migrate db-reset shell-backend shell-frontend shell-db dev prod

# Кольори для виводу
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Змінні
DOCKER_COMPOSE := docker-compose
PROJECT_NAME := auth-key-storage
ENV_FILE := .env.docker

# ============================================================================
# DEFAULT TARGET
# ============================================================================
.DEFAULT_GOAL := help

help: ## Показати це повідомлення допомоги
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  Auth Key Storage System - Docker Management$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(YELLOW)Доступні команди:$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

##@ Основні команди

build: ## Збудувати всі Docker образи
	@echo "$(BLUE)🔨 Збірка Docker образів...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✅ Образи успішно зібрано!$(NC)"

build-backend: ## Збудувати тільки backend образ
	@echo "$(BLUE)🔨 Збірка Backend образу...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache backend
	@echo "$(GREEN)✅ Backend образ успішно зібрано!$(NC)"

build-frontend: ## Збудувати тільки frontend образ
	@echo "$(BLUE)🔨 Збірка Frontend образу...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache frontend
	@echo "$(GREEN)✅ Frontend образ успішно зібрано!$(NC)"

up: ## Запустити всі сервіси
	@echo "$(BLUE)🚀 Запуск сервісів...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Сервіси запущено!$(NC)"
	@make status

down: ## Зупинити всі сервіси
	@echo "$(BLUE)🛑 Зупинка сервісів...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Сервіси зупинено!$(NC)"

restart: ## Перезапустити всі сервіси
	@echo "$(BLUE)🔄 Перезапуск сервісів...$(NC)"
	$(DOCKER_COMPOSE) restart
	@echo "$(GREEN)✅ Сервіси перезапущено!$(NC)"

restart-backend: ## Перезапустити backend
	@echo "$(BLUE)🔄 Перезапуск Backend...$(NC)"
	$(DOCKER_COMPOSE) restart backend
	@echo "$(GREEN)✅ Backend перезапущено!$(NC)"

restart-frontend: ## Перезапустити frontend
	@echo "$(BLUE)🔄 Перезапуск Frontend...$(NC)"
	$(DOCKER_COMPOSE) restart frontend
	@echo "$(GREEN)✅ Frontend перезапущено!$(NC)"

##@ Логи та моніторинг

logs: ## Показати логи всіх сервісів
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Показати логи backend
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Показати логи frontend
	$(DOCKER_COMPOSE) logs -f frontend

logs-postgres: ## Показати логи PostgreSQL
	$(DOCKER_COMPOSE) logs -f postgres

logs-redis: ## Показати логи Redis
	$(DOCKER_COMPOSE) logs -f redis

status: ## Показати статус всіх контейнерів
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  Статус контейнерів$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(YELLOW)📊 Використання ресурсів:$(NC)"
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $$(docker ps -q --filter "name=$(PROJECT_NAME)")

health: ## Перевірити health status всіх сервісів
	@echo "$(BLUE)🏥 Перевірка health status...$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend:$(NC)"
	@curl -s http://localhost:8080/actuator/health | jq . || echo "$(RED)❌ Backend недоступний$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s http://localhost/health || echo "$(RED)❌ Frontend недоступний$(NC)"
	@echo ""

##@ Очищення

clean: ## Видалити контейнери та образи
	@echo "$(RED)🧹 Очищення контейнерів та образів...$(NC)"
	$(DOCKER_COMPOSE) down --rmi all
	@echo "$(GREEN)✅ Очищення завершено!$(NC)"

clean-all: ## Видалити контейнери, образи та volumes
	@echo "$(RED)⚠️  УВАГА: Це видалить всі дані з бази даних!$(NC)"
	@read -p "Продовжити? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v --rmi all; \
		echo "$(GREEN)✅ Повне очищення завершено!$(NC)"; \
	fi

clean-volumes: ## Видалити тільки volumes (дані БД)
	@echo "$(RED)⚠️  УВАГА: Це видалить всі дані з бази даних!$(NC)"
	@read -p "Продовжити? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		echo "$(GREEN)✅ Volumes видалено!$(NC)"; \
	fi

prune: ## Видалити всі невикористовувані Docker об'єкти
	@echo "$(YELLOW)🧹 Очищення невикористовуваних Docker об'єктів...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✅ Очищення завершено!$(NC)"

##@ База даних

db-migrate: ## Запустити міграції БД (Hibernate auto-update)
	@echo "$(BLUE)🗄️  Міграція бази даних...$(NC)"
	@echo "$(YELLOW)ℹ️  Hibernate виконає міграції автоматично при запуску backend$(NC)"
	$(DOCKER_COMPOSE) restart backend
	@echo "$(GREEN)✅ Міграції завершено!$(NC)"

db-reset: ## Скинути базу даних (видалити та створити знову)
	@echo "$(RED)⚠️  УВАГА: Це видалить всі дані з бази даних!$(NC)"
	@read -p "Продовжити? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) stop backend; \
		docker exec -it auth-storage-postgres psql -U auth_user -d postgres -c "DROP DATABASE IF EXISTS auth_storage_db;"; \
		docker exec -it auth-storage-postgres psql -U auth_user -d postgres -c "CREATE DATABASE auth_storage_db;"; \
		$(DOCKER_COMPOSE) start backend; \
		echo "$(GREEN)✅ База даних скинута!$(NC)"; \
	fi

db-backup: ## Створити backup бази даних
	@echo "$(BLUE)💾 Створення backup бази даних...$(NC)"
	@mkdir -p ./backups
	@docker exec auth-storage-postgres pg_dump -U auth_user auth_storage_db > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup створено в ./backups/$(NC)"

db-restore: ## Відновити базу даних з backup (використовуйте: make db-restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Помилка: Вкажіть файл backup$(NC)"; \
		echo "$(YELLOW)Використання: make db-restore FILE=./backups/backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)📥 Відновлення бази даних з $(FILE)...$(NC)"
	@cat $(FILE) | docker exec -i auth-storage-postgres psql -U auth_user auth_storage_db
	@echo "$(GREEN)✅ База даних відновлена!$(NC)"

##@ Shell доступ

shell-backend: ## Shell доступ до backend контейнера
	@echo "$(BLUE)🐚 Підключення до Backend контейнера...$(NC)"
	docker exec -it auth-storage-backend sh

shell-frontend: ## Shell доступ до frontend контейнера
	@echo "$(BLUE)🐚 Підключення до Frontend контейнера...$(NC)"
	docker exec -it auth-storage-frontend sh

shell-db: ## Shell доступ до PostgreSQL
	@echo "$(BLUE)🐚 Підключення до PostgreSQL...$(NC)"
	docker exec -it auth-storage-postgres psql -U auth_user -d auth_storage_db

shell-redis: ## Shell доступ до Redis CLI
	@echo "$(BLUE)🐚 Підключення до Redis...$(NC)"
	docker exec -it auth-storage-redis redis-cli -a redis_password_change_me

##@ Тестування

test: ## Запустити всі тести
	@echo "$(BLUE)🧪 Запуск тестів...$(NC)"
	@echo "$(YELLOW)Backend тести:$(NC)"
	docker exec auth-storage-backend sh -c "cd /app && mvn test"
	@echo "$(GREEN)✅ Тести завершено!$(NC)"

test-backend: ## Запустити backend тести
	@echo "$(BLUE)🧪 Запуск Backend тестів...$(NC)"
	docker exec auth-storage-backend sh -c "cd /app && mvn test"

##@ Розробка

dev: ## Запустити в режимі розробки (з pgadmin)
	@echo "$(BLUE)🚀 Запуск в режимі розробки...$(NC)"
	$(DOCKER_COMPOSE) --profile dev up -d
	@echo "$(GREEN)✅ Режим розробки запущено!$(NC)"
	@echo ""
	@echo "$(YELLOW)📋 Доступні сервіси:$(NC)"
	@echo "  Frontend:  http://localhost"
	@echo "  Backend:   http://localhost:8080"
	@echo "  API Docs:  http://localhost:8080/swagger-ui.html"
	@echo "  PgAdmin:   http://localhost:5050"
	@echo ""

prod: ## Запустити в production режимі
	@echo "$(BLUE)🚀 Запуск в production режимі...$(NC)"
	$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)✅ Production режим запущено!$(NC)"

rebuild: ## Повна перебудова (clean + build + up)
	@echo "$(BLUE)🔄 Повна перебудова проекту...$(NC)"
	@make down
	@make build
	@make up
	@echo "$(GREEN)✅ Перебудова завершена!$(NC)"

##@ Інформація

info: ## Показати інформацію про проект
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  Auth Key Storage System - Project Info$(NC)"
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(YELLOW)🔧 Technologies:$(NC)"
	@echo "  Backend:   Spring Boot 3.2.3 (Java 17)"
	@echo "  Frontend:  React 18 + Vite"
	@echo "  Database:  PostgreSQL 15"
	@echo "  Cache:     Redis 7"
	@echo ""
	@echo "$(YELLOW)🌐 URLs:$(NC)"
	@echo "  Frontend:     http://localhost"
	@echo "  Backend API:  http://localhost:8080/api"
	@echo "  Swagger UI:   http://localhost:8080/swagger-ui.html"
	@echo "  Health:       http://localhost:8080/actuator/health"
	@echo ""
	@echo "$(YELLOW)🗄️  Database:$(NC)"
	@echo "  Host:     localhost:5432"
	@echo "  Database: auth_storage_db"
	@echo "  User:     auth_user"
	@echo ""
	@echo "$(YELLOW)💾 Volumes:$(NC)"
	@docker volume ls | grep $(PROJECT_NAME) || echo "  No volumes found"
	@echo ""
	@echo "$(BLUE)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

urls: ## Показати всі доступні URLs
	@echo "$(YELLOW)🌐 Available URLs:$(NC)"
	@echo ""
	@echo "$(GREEN)Frontend:$(NC)"
	@echo "  🌍 http://localhost"
	@echo ""
	@echo "$(GREEN)Backend:$(NC)"
	@echo "  🔌 API:        http://localhost:8080/api"
	@echo "  📚 Swagger:    http://localhost:8080/swagger-ui.html"
	@echo "  ❤️  Health:     http://localhost:8080/actuator/health"
	@echo ""
	@echo "$(GREEN)Database (Dev mode):$(NC)"
	@echo "  🐘 PgAdmin:    http://localhost:5050"
	@echo ""

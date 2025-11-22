# ============================================================================
# Auth Key Storage System - Frontend Dockerfile
# ============================================================================
# Multi-stage build для оптимізації розміру образу
# Stage 1: Build - збирання React додатку з Vite
# Stage 2: Runtime - Nginx для статичних файлів
# ============================================================================

# ============================================================================
# Stage 1: BUILD
# ============================================================================
FROM node:18-alpine AS builder

# Встановлення робочої директорії
WORKDIR /app

# Копіювання package.json та package-lock.json для кешування залежностей
COPY package*.json ./

# Встановлення залежностей
# --legacy-peer-deps: для вирішення конфліктів залежностей
# --ignore-scripts: для безпеки
RUN npm install --legacy-peer-deps --ignore-scripts

# Копіювання вихідного коду
COPY . .

# Аргументи збірки для змінних оточення
ARG VITE_API_BASE_URL=/api
ARG VITE_APP_TITLE="Auth Key Storage System"
ARG VITE_APP_VERSION=1.0.0

# Встановлення змінних оточення для збірки
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_APP_TITLE=$VITE_APP_TITLE \
    VITE_APP_VERSION=$VITE_APP_VERSION

# Збірка додатку для production
# Vite створить оптимізовані статичні файли в /app/dist
RUN npm run build

# Видалення devDependencies для зменшення розміру (опціонально для builder stage)
RUN npm prune --production

# ============================================================================
# Stage 2: RUNTIME (Nginx)
# ============================================================================
FROM nginx:1.25-alpine

# Метадані образу
LABEL maintainer="Auth Key Storage Team"
LABEL description="Frontend for Auth Key Storage System"
LABEL version="1.0.0"

# Копіювання custom nginx конфігурації
COPY nginx.conf /etc/nginx/nginx.conf

# Копіювання зібраних статичних файлів з builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Створення директорії для логів
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Створення непривілейованого користувача
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Експорт порту
EXPOSE 80

# Health check для Nginx
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Запуск Nginx
# daemon off: Nginx працює в foreground для Docker
CMD ["nginx", "-g", "daemon off;"]

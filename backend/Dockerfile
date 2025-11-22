# ============================================================================
# Auth Key Storage System - Backend Dockerfile
# ============================================================================
# Multi-stage build для оптимізації розміру образу
# Stage 1: Build - збирання JAR файлу
# Stage 2: Runtime - запуск додатку
# ============================================================================

# ============================================================================
# Stage 1: BUILD
# ============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Встановлення робочої директорії
WORKDIR /app

# Копіювання pom.xml для кешування залежностей
# Це дозволяє не завантажувати залежності при кожній зміні коду
COPY pom.xml .

# Завантаження залежностей (кешується Docker)
RUN mvn dependency:go-offline -B

# Копіювання вихідного коду
COPY src ./src

# Збірка додатку
# -DskipTests: пропускаємо тести для швидшості збірки
# -B: batch режим для CI/CD
# -q: тихий режим для менших логів
RUN mvn clean package -DskipTests -B

# ============================================================================
# Stage 2: RUNTIME
# ============================================================================
FROM eclipse-temurin:17-jre-alpine

# Метадані образу
LABEL maintainer="Auth Key Storage Team"
LABEL description="Backend for Auth Key Storage System"
LABEL version="1.0.0"

# Створення користувача без root прав для безпеки
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Встановлення робочої директорії
WORKDIR /app

# Копіювання JAR файлу з builder stage
COPY --from=builder /app/target/*.jar app.jar

# Зміна власника файлів
RUN chown -R appuser:appgroup /app

# Перемикання на непривілейованого користувача
USER appuser

# Експорт порту додатку
EXPOSE 8080

# Змінні оточення за замовчуванням
ENV JAVA_OPTS="-Xms512m -Xmx1024m" \
    SPRING_PROFILES_ACTIVE="docker"

# Health check для Docker
# Перевіряє доступність actuator/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Точка входу для запуску додатку
# Використовуємо exec форму для правильної обробки сигналів
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Альтернативний варіант з більш детальними параметрами JVM:
# ENTRYPOINT ["sh", "-c", "java \
#   -XX:+UseContainerSupport \
#   -XX:MaxRAMPercentage=75.0 \
#   -XX:+ExitOnOutOfMemoryError \
#   -Djava.security.egd=file:/dev/./urandom \
#   $JAVA_OPTS \
#   -jar app.jar"]

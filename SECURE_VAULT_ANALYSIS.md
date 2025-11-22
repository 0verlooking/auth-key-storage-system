# ДЕТАЛЬНИЙ АНАЛІЗ ПРОЕКТУ SECURE VAULT

## ЗАГАЛЬНИЙ ОГЛЯД

**Secure Vault** - це повнофункціональна система управління паролями з наскрізним шифруванням (end-to-end encryption) та архітектурою Zero-Knowledge, яка забезпечує максимальну конфіденційність користувацьких даних.

**Гасло проекту:** "THE ONLY KEY IS YOU"

**Архітектура:** Umbrella проект з трьома основними модулями:
- `secure-vault-server` - Backend (Spring Boot)
- `secure-vault-web` - Frontend (Next.js)
- `secure-vault-mobile` - Mobile (React Native) - в розробці

---

## 1. BACKEND - SECURE-VAULT-SERVER

### 1.1 ТЕХНОЛОГІЧНИЙ СТЕК

#### Основні технології:
- **Java 17**
- **Spring Boot 3.2.3**
- **Maven** - система збірки

#### Фреймворки та бібліотеки:

**Spring модулі:**
- `spring-boot-starter-web` - REST API
- `spring-boot-starter-data-mongodb` - MongoDB інтеграція
- `spring-boot-starter-security` - Spring Security 6.3.0
- `spring-boot-starter-validation` - валідація даних
- `spring-boot-starter-data-redis` - Redis кешування
- `spring-boot-starter-thymeleaf` - шаблонізація email
- `spring-boot-starter-mail` - відправка email

**Безпека:**
- **Spring Security 6.3.0**
- **JJWT 0.12.5** (jjwt-api, jjwt-impl, jjwt-jackson) - JWT токени
- **PBKDF2** - хешування паролів з налаштовуваними ітераціями

**Додаткові бібліотеки:**
- **Lombok 1.18.32** - скорочення boilerplate коду
- **SendGrid Java 4.10.1** - email сервіс
- **spring-boot-devtools** - hot reload під час розробки

#### Бази даних та кешування:
- **MongoDB** - основна NoSQL база даних
  - Development: порт 27017
  - Production: порт 27018
- **Redis** - кешування та управління сесіями
  - Development: одиночний інстанс на порту 6379
  - Production: Master-Slave кластер з Redis Sentinel
    - Master: порт 6382
    - Slave 1: порт 6383
    - Slave 2: порт 6384
    - Sentinel: порти 26382-26384

#### Контейнеризація:
- **Docker**
- **Docker Compose** - окремі конфігурації для dev та prod
- **Makefile** - автоматизація команд

### 1.2 СТРУКТУРА ПРОЕКТУ

```
secure-vault-server/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/securevault/main/
│   │   │       ├── MainApplication.java
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       ├── config/
│   │   │       └── util/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-development.yml
│   │       ├── application-production.yml
│   │       ├── dev-env.properties.example
│   │       ├── prod-env.properties.example
│   │       ├── locales/
│   │       ├── static/images/
│   │       └── templates/mail/
│   └── test/
│       └── java/com/securevault/main/
├── Dockerfile
├── Dockerfile.dev
├── compose.dev.yml
├── compose.prod.yml
├── Makefile
├── pom.xml
└── README.md
```

### 1.3 ОСНОВНИЙ ФАЙЛ ДОДАТКУ

**MainApplication.java:**

Анотації:
- `@Slf4j` - логування через Lombok
- `@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})`
- `@EnableMongoRepositories("com.securevault.main.repository")`
- `@EnableScheduling` - підтримка scheduled tasks
- `@EnableConfigurationProperties` - зовнішні конфігурації

### 1.4 КОНФІГУРАЦІЯ DEVELOPMENT (application-development.yml)

#### Server налаштування:
```yaml
server:
  error:
    whitelabel:
      enabled: false
```

#### Spring Boot:
```yaml
spring:
  application:
    name: ${APP_NAME}
  devtools:
    livereload:
      enabled: true
    restart:
      enabled: true
  output:
    ansi:
      enabled: ALWAYS
  messages:
    basename: locales/message
```

#### MongoDB:
```yaml
data:
  mongodb:
    database: ${MONGO_DATABASE}
    username: ${MONGO_INITDB_ROOT_USERNAME}
    password: ${MONGO_INITDB_ROOT_PASSWORD}
    uri: ${MONGO_URI}
    uuid-representation: standard
```

#### Redis:
```yaml
data:
  redis:
    mode: ${REDIS_MODE}
    database: ${REDIS_DATABASE}
    host: ${REDIS_HOST}
    port: ${REDIS_PORT}
    password: ${REDIS_PASSWORD}
    timeout: ${REDIS_TIMEOUT}
    notify-keyspace-events: "Ex"
```

#### Email (SMTP):
```yaml
mail:
  host: ${MAIL_HOST}
  port: ${MAIL_PORT}
  username: ${MAIL_USERNAME}
  password: ${MAIL_PASSWORD}
  properties:
    mail:
      transport:
        protocol: smtp
      smtp:
        auth: true
        ssl:
          enable: false
        tls:
          enable: true
        starttls:
          enable: true
```

#### Логування:
```yaml
logging:
  level:
    root: INFO
    com.securevault.main: DEBUG
    com.securevault.main.service: DEBUG
    com.securevault.main.controller: DEBUG
    org.springframework.security: INFO
    org.springframework.web: INFO
```

#### Custom налаштування:
```yaml
api:
  uri-prefix: ${API_URI_PREFIX}

app:
  pbkdf2:
    secret: ${PBKDF2_SECRET}
    salt-length: ${PBKDF2_SALT_LENGTH}
    iterations: ${PBKDF2_ITERATIONS}
  jwt:
    secret: ${JWT_SECRET}
    token:
      expires-in: ${JWT_TOKEN_EXPIRES_IN}
    refresh-token:
      expires-in: ${JWT_REFRESH_TOKEN_EXPIRES_IN}
    remember-me:
      expires-in: ${JWT_REMEMBER_ME_EXPIRES_IN}
  registration:
    email:
      token:
        expires-in: ${REGISTRATION_EMAIL_TOKEN_EXPIRES_IN}
  redis:
    cleanup:
      enabled: ${REDIS_CLEANUP_ENABLED:true}
      interval: ${REDIS_CLEANUP_INTERVAL:60000}

cookie:
  refresh:
    domain: ${COOKIE_REFRESH_DOMAIN}
    path: ${COOKIE_REFRESH_PATH}
    sameSite: ${COOKIE_REFRESH_SAME_SITE}
    httpOnly: true
    secure: false
```

### 1.5 ЗМІННІ СЕРЕДОВИЩА (dev-env.properties.example)

#### Application & Server:
```properties
APP_NAME=Secure Vault
API_URI_PREFIX=/api
SERVER_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

#### MongoDB:
```properties
MONGO_DATABASE=vault-db
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=change_me_in_dev
MONGO_URI=mongodb://admin:change_me_in_dev@mongodb:27017/vault-db?authSource=vault-db
```

#### Redis:
```properties
REDIS_MODE=standalone
REDIS_DATABASE=0
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=change_me_in_dev
REDIS_TIMEOUT=60000
```

#### Email:
```properties
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

#### Security - PBKDF2:
```properties
PBKDF2_SECRET=change_me_in_dev_environment
PBKDF2_SALT_LENGTH=600000
PBKDF2_ITERATIONS=256
```

#### Security - JWT:
```properties
JWT_SECRET=change_me_in_dev_environment
JWT_TOKEN_EXPIRES_IN=#{60 * 15 * 1000}           # 15 хвилин
JWT_REFRESH_TOKEN_EXPIRES_IN=#{24 * 60 * 60 * 1000}  # 24 години
JWT_REMEMBER_ME_EXPIRES_IN=#{24 * 60 * 60 * 1000 * 7}  # 7 днів
REGISTRATION_EMAIL_TOKEN_EXPIRES_IN=#{24 * 60 * 60 * 1000}  # 24 години
```

#### Cookies:
```properties
COOKIE_REFRESH_DOMAIN=localhost
COOKIE_REFRESH_PATH=/
COOKIE_REFRESH_SAME_SITE=strict
```

### 1.6 DOCKER КОНФІГУРАЦІЯ (compose.dev.yml)

#### MongoDB Service:
```yaml
mongodb:
  image: mongo:latest
  ports:
    - "27018:27017"
  command: --auth
  volumes:
    - mongodb-data-dev:/data/db
  healthcheck:
    enabled: true
```

#### Redis Service:
```yaml
redis:
  image: redis:latest
  ports:
    - "6380:6379"
  environment:
    - REDIS_PASSWORD=${REDIS_PASSWORD}
  volumes:
    - redis-data-dev:/data
  healthcheck:
    enabled: true
```

#### Backend Service:
```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile.dev
    target: dev
  ports:
    - "8080:8080"
  environment:
    - SPRING_PROFILES_ACTIVE=development
    - SPRING_OUTPUT_ANSI_ENABLED=ALWAYS
  volumes:
    - ./src:/app/src  # Live code changes
  depends_on:
    mongodb:
      condition: service_healthy
    redis:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health/live"]
```

### 1.7 MAKEFILE КОМАНДИ

**Налаштування:**
- `make setup-dev` - налаштування development середовища
- `make setup-prod` - налаштування production середовища

**Управління контейнерами:**
- `make up` - запуск контейнерів
- `make down` - зупинка контейнерів
- `make rebuild` - перебудова та перезапуск
- `make restart` - перезапуск сервісів
- `make clean` - видалення контейнерів та томів

**Моніторинг:**
- `make logs` - перегляд логів
- `make logs SERVICE=<name>` - логи конкретного сервісу
- `make ps` - список активних контейнерів
- `make status` - детальний статус

**Розробка:**
- `make shell` - доступ до backend контейнера
- `make mongo-shell` - MongoDB shell
- `make redis-cli` - Redis CLI
- `make test` - запуск тестів
- `make lint` - перевірка стилю коду

**Використання:** `make <command> ENV=prod` для production

### 1.8 ОСОБЛИВОСТІ БЕЗПЕКИ BACKEND

1. **JWT Authentication:**
   - Access токени (15 хвилин)
   - Refresh токени (24 години)
   - Remember-me токени (7 днів)
   - HTTP-only cookies для refresh токенів

2. **Password Hashing:**
   - PBKDF2 алгоритм
   - 600,000 раундів salt
   - 256 ітерацій

3. **Spring Security 6.3.0:**
   - Автентифікація та авторизація
   - CORS налаштування
   - CSRF захист

4. **Email Verification:**
   - Токени верифікації з терміном дії 24 години
   - Thymeleaf шаблони для email

5. **Redis Session Management:**
   - Cleanup автоматичний
   - Keyspace events для моніторингу

---

## 2. FRONTEND - SECURE-VAULT-WEB

### 2.1 ТЕХНОЛОГІЧНИЙ СТЕК

#### Основні технології:
- **Next.js 15** - з App Router та Turbopack
- **React 19** - з останніми оптимізаціями
- **TypeScript** - типізація

#### UI/UX фреймворки:
- **Tailwind CSS** - utility-first стилізація
- **HeroUI 2.7.5** - компонентна бібліотека
- **Framer Motion 11.2.4** - анімації
- **PostCSS** - обробка CSS
- **Josefin Sans** - custom шрифт

#### Управління станом та форми:
- **Zustand 5.0.3** - state management
- **React Hook Form 7.51.5** - форми
- **Zod 3.24.2** - валідація схем
- **@hookform/resolvers 4.1.3** - інтеграція

#### Інтернаціоналізація:
- **next-intl 4.0.2** - i18n підтримка
- **next-themes 0.3.0** - теми (dark/light)

#### Інструменти розробки:
- **ESLint** - лінтінг
- **Prettier** - форматування коду
- **Husky** - git hooks
- **lint-staged** - pre-commit перевірки
- **Yarn 4.7.0+** - package manager

#### Додаткові бібліотеки:
- **@next/bundle-analyzer 15.3.1** - аналіз bundle
- **@t3-oss/env-nextjs 0.12.0** - env змінні
- **clsx 2.1.1** - умовні класи
- **set-cookie-parser 2.7.1** - парсинг cookies

### 2.2 СТРУКТУРА ПРОЕКТУ

```
secure-vault-web/
├── .husky/                    # Git hooks
├── public/                    # Статичні файли
├── messages/                  # i18n переклади
├── src/
│   ├── app/
│   │   ├── [locale]/         # Локалізовані маршрути
│   │   │   ├── (auth)/       # Автентифікація
│   │   │   ├── (protected)/  # Захищені сторінки
│   │   │   │   ├── vaults/   # Vault функціональність
│   │   │   │   ├── layout.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── (public)/     # Публічні сторінки
│   │   │   ├── [...rest]/    # Catch-all routes
│   │   │   ├── layout.tsx
│   │   │   ├── client-providers.tsx
│   │   │   └── not-found.tsx
│   │   └── global-error.tsx
│   ├── core/
│   │   ├── action-utils/     # Утиліти для actions
│   │   ├── config/           # Конфігурації
│   │   │   ├── api-endpoints.ts
│   │   │   ├── pbkdf.ts
│   │   │   ├── site.ts
│   │   │   └── index.ts
│   │   ├── env/              # Змінні середовища
│   │   └── i18n/             # Інтернаціоналізація
│   ├── modules/
│   │   ├── auth/             # Модуль автентифікації
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── vault/            # Модуль vault
│   │       ├── actions/
│   │       ├── services/
│   │       ├── types/
│   │       └── index.ts
│   ├── shared/
│   │   ├── abstractions/     # Абстрактні класи
│   │   ├── components/       # Переиспользуємі компоненти
│   │   ├── enums/            # Енуми та константи
│   │   ├── hooks/            # Custom React hooks
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── models/           # Моделі даних
│   │   ├── services/         # Спільні сервіси
│   │   │   ├── api.service.ts
│   │   │   ├── crypto.service.ts
│   │   │   ├── crypto-function.service.ts
│   │   │   ├── encrypt.service.ts
│   │   │   ├── key-generation.service.ts
│   │   │   ├── storage.service.ts
│   │   │   ├── service-factory.ts
│   │   │   ├── client-service-factory.ts
│   │   │   └── index.ts
│   │   ├── types/            # TypeScript типи
│   │   └── utils/            # Утиліти
│   ├── styles/               # Глобальні стилі
│   └── middleware.ts         # Next.js middleware
├── .env.development
├── .env.production
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── .eslintrc.json
├── .prettierrc.json
├── .yarnrc.yml
└── package.json
```

### 2.3 API ENDPOINTS (api-endpoints.ts)

#### AUTH Endpoints:
```typescript
const API_ENDPOINTS = {
  AUTH: {
    SEND_VERIFICATION_EMAIL: "/v1/auth/send-email-verification",
    VERIFY_EMAIL: "/v1/auth/verify-email",
    FINISH_REGISTRATION: "/v1/auth/finish-registration",
    LOGIN: "/v1/auth/login",
    LOGOUT: "/v1/auth/logout",
    REFRESH_TOKEN: "/v1/auth/refresh-token"
  },

  USER: {
    INFO: "/v1/user/me",
    PROFILE: "/v1/user/profile",
    UPDATE_PROFILE: "/v1/user/profile",
    CHANGE_PASSWORD: "/v1/user/change-password"
  },

  // Закоментовані, в розробці:
  // VAULT: {
  //   LIST: "/v1/vaults",
  //   CREATE: "/v1/vaults",
  //   GET: "/v1/vaults/:id",
  //   UPDATE: "/v1/vaults/:id",
  //   DELETE: "/v1/vaults/:id",
  //   SHARE: "/v1/vaults/:id/share"
  // },

  // SHARED: {
  //   LIST: "/v1/shared",
  //   ACCEPT: "/v1/shared/:id/accept",
  //   REJECT: "/v1/shared/:id/reject"
  // }
}
```

### 2.4 API SERVICE (api.service.ts)

#### Конфігурація:
- **Базовий URL:** з environment змінних
- **Timeout:** 30000ms (30 секунд)
- **Credentials:** configurable withCredentials flag
- **AbortController:** для timeout управління

#### HTTP Методи:
```typescript
class ApiService {
  // GET запити з URL параметрами
  get<T>(url: string, params?: Record<string, any>): Promise<T>

  // POST запити з JSON body
  post<T>(url: string, data?: any): Promise<T>

  // PUT запити для оновлення
  put<T>(url: string, data?: any): Promise<T>

  // DELETE запити
  delete<T>(url: string): Promise<T>

  // Приватний метод для всіх запитів
  private async request<T>(config: RequestConfig): Promise<T>
}
```

#### Обробка помилок:
- **408 Timeout:** "Request has been aborted due to timeout"
- **500 Server Error:** для неочікуваних помилок
- **JSON сериалізація/десериалізація**
- **Content-Type:** автоматичне встановлення

### 2.5 CRYPTO СЕРВІСИ

#### crypto.service.ts:
- Криптографічні операції через Web Crypto API
- Відповідність OWASP стандартам

#### encrypt.service.ts:
- End-to-end шифрування
- Client-side encryption перед відправкою

#### key-generation.service.ts:
- Генерація криптографічних ключів
- Derivation з master password

#### crypto-function.service.ts:
- Додаткові крипто-функції
- Хешування та підписи

#### storage.service.ts:
- Безпечне зберігання в localStorage/sessionStorage
- Шифрування чутливих даних

### 2.6 NEXT.JS КОНФІГУРАЦІЯ (next.config.ts)

```typescript
const config = {
  // Безпека
  poweredByHeader: false,  // Приховує X-Powered-By header

  // Експериментальні можливості
  experimental: {
    taint: true  // React taint API
  },

  // Плагіни
  plugins: [
    nextIntl({
      request: "./src/core/i18n/request.ts"
    }),
    bundleAnalyzer({
      enabled: process.env.ANALYZE === 'true'
    })
  ]
}
```

### 2.7 TAILWIND КОНФІГУРАЦІЯ (tailwind.config.ts)

#### Кольорова палітра:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        // ... до 900: '#581C87'
      }
    },

    // Dark mode палітра
    dark: {
      primary: {
        DEFAULT: '#C084FC',
        // ...
      }
    }
  }
}
```

#### Типографіка:
```typescript
fontFamily: {
  sans: ['Josefin Sans', 'sans-serif']
}
```

#### Анімації:
```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'float-slow': 'float 8s ease-in-out infinite',
  'float-medium': 'float 7s ease-in-out infinite',
  'float-fast': 'float 5s ease-in-out infinite',
  'pulse': 'pulse 3s ease-in-out infinite',
  'pulse-slow': 'pulse 5s ease-in-out infinite',
  'bounce-slow': 'bounce 3s ease-in-out infinite'
}
```

#### Custom ефекти:
- Light та dark box shadows
- Grid pattern backgrounds
- Transition delays (100ms - 1000ms)
- Custom timing functions

#### Плагіни:
```typescript
plugins: [
  heroui({
    addCommonColors: true,
    themes: {
      light: { /* ... */ },
      dark: { /* ... */ }
    }
  })
]
```

### 2.8 SCRIPTS (package.json)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --check --ignore-path .gitignore .",
    "format:fix": "prettier --write --ignore-path .gitignore .",
    "prepare": "husky"
  }
}
```

### 2.9 МОДУЛЬНА АРХІТЕКТУРА

#### Auth Module (src/modules/auth):
```
auth/
├── actions/      # Server Actions для Next.js
├── schemas/      # Zod валідаційні схеми
├── services/     # Auth бізнес-логіка
├── types/        # TypeScript типи
└── index.ts      # Public API модуля
```

**Функціональність:**
- Реєстрація з email верифікацією
- Вхід (login/logout)
- Refresh токен механізм
- Зміна паролю
- Remember me функціональність

#### Vault Module (src/modules/vault):
```
vault/
├── actions/      # CRUD операції з vault
├── services/     # Vault бізнес-логіка
├── types/        # Vault типи
└── index.ts      # Public API модуля
```

**Функціональність (в розробці):**
- Створення vault
- Зберігання паролів
- Шифрування даних
- Secure sharing
- Vault tagging

### 2.10 ОСОБЛИВОСТІ БЕЗПЕКИ FRONTEND

1. **Zero-Knowledge Architecture:**
   - Всі дані шифруються на клієнті
   - Master password ніколи не передається на сервер
   - Сервер не має доступу до незашифрованих даних

2. **Web Crypto API:**
   - Industry-standard алгоритми шифрування
   - PBKDF2 для key derivation
   - AES-GCM для encryption

3. **HTTPS Only:**
   - Обов'язково в production
   - Secure cookies (httpOnly, secure, sameSite)

4. **OWASP Guidelines:**
   - Захист від XSS
   - CSRF токени
   - Безпечні headers

5. **Client-side Encryption:**
   - Дані шифруються перед відправкою
   - Ключі зберігаються локально
   - Автоматичне очищення при logout

6. **Security Headers:**
   - X-Powered-By прихований
   - Content Security Policy
   - CORS правильно налаштований

---

## 3. ВЗАЄМОДІЯ FRONTEND ↔ BACKEND

### 3.1 ПОТІК АВТЕНТИФІКАЦІЇ

#### 1. Реєстрація:
```
1. Користувач → Frontend: email
2. Frontend → Backend: POST /v1/auth/send-email-verification
3. Backend → Email Service: відправка verification email
4. Користувач → Email: клік на посилання
5. Frontend → Backend: POST /v1/auth/verify-email (token)
6. Користувач → Frontend: встановлення master password
7. Frontend: генерація encryption keys з master password (PBKDF2)
8. Frontend → Backend: POST /v1/auth/finish-registration (encrypted data)
9. Backend → MongoDB: збереження користувача
10. Backend → Frontend: JWT токени + cookies
```

#### 2. Вхід:
```
1. Користувач → Frontend: email + master password
2. Frontend: derivation ключів з master password
3. Frontend → Backend: POST /v1/auth/login
4. Backend: перевірка credentials (PBKDF2 hash)
5. Backend → Redis: збереження сесії
6. Backend → Frontend: JWT access token + refresh cookie (httpOnly)
7. Frontend → Storage: збереження ключів шифрування
```

#### 3. Refresh Token Flow:
```
1. Frontend: виявлення expired access token
2. Frontend → Backend: POST /v1/auth/refresh-token (з httpOnly cookie)
3. Backend → Redis: перевірка refresh token
4. Backend → Frontend: новий access token
5. Frontend: продовження роботи
```

#### 4. Logout:
```
1. Користувач → Frontend: logout
2. Frontend → Backend: POST /v1/auth/logout
3. Backend → Redis: видалення сесії
4. Frontend → Storage: очищення ключів та токенів
5. Frontend: редірект на login page
```

### 3.2 ПОТІК ДАНИХ VAULT

#### Збереження паролю:
```
1. Користувач → Frontend: password details
2. Frontend: шифрування з user encryption key (AES-GCM)
3. Frontend → Backend: POST /v1/vaults (encrypted payload)
4. Backend: валідація JWT
5. Backend → MongoDB: збереження encrypted vault item
6. Backend → Frontend: success response
```

#### Отримання паролів:
```
1. Frontend → Backend: GET /v1/vaults (JWT header)
2. Backend → MongoDB: запит vault items користувача
3. Backend → Frontend: encrypted vault items
4. Frontend: розшифрування з user encryption key
5. Frontend → User: відображення паролів
```

### 3.3 АРХІТЕКТУРА БЕЗПЕКИ

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│  Master Password (never leaves client)                       │
│         ↓                                                     │
│  PBKDF2 Key Derivation                                       │
│         ↓                                                     │
│  Encryption Key (stored in memory/localStorage)              │
│         ↓                                                     │
│  AES-GCM Encryption                                          │
│         ↓                                                     │
│  Encrypted Data → HTTPS → Server                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
├─────────────────────────────────────────────────────────────┤
│  JWT Authentication                                          │
│         ↓                                                     │
│  Authorization Check                                         │
│         ↓                                                     │
│  Store Encrypted Data (server never decrypts)                │
│         ↓                                                     │
│  MongoDB (encrypted at rest)                                 │
│         ↓                                                     │
│  Redis Session (refresh tokens)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. РОЗГОРТАННЯ

### 4.1 DEVELOPMENT SETUP

#### Backend:
```bash
# Клонування репозиторію
git clone https://github.com/puneetkakkar/secure-vault-server
cd secure-vault-server

# Налаштування environment
make setup-dev

# Запуск через Docker
make up

# АБО локально
mvn clean install
mvn spring-boot:run

# Перевірка статусу
make ps
make logs

# Доступ до сервісів
# Backend: http://localhost:8080
# MongoDB: localhost:27018
# Redis: localhost:6380
```

#### Frontend:
```bash
# Клонування
git clone https://github.com/puneetkakkar/secure-vault-web
cd secure-vault-web

# Встановлення залежностей
yarn install

# Налаштування .env.development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Запуск dev сервера
yarn dev

# Frontend: http://localhost:3000
```

### 4.2 PRODUCTION SETUP

#### Backend:
```bash
# Налаштування production
make setup-prod ENV=prod

# Запуск production
make up ENV=prod

# Особливості production:
# - Redis Cluster з Master-Slave
# - Redis Sentinel для HA
# - Оптимізовані JVM параметри
# - Production logging
# - Secure cookies
```

#### Frontend:
```bash
# Production build
yarn build

# Запуск
yarn start

# АБО через Docker
docker build -t secure-vault-web .
docker run -p 3000:3000 secure-vault-web
```

---

## 5. ПОРІВНЯННЯ З ІНШИМИ РІШЕННЯМИ

### 5.1 ПЕРЕВАГИ АРХІТЕКТУРИ SECURE VAULT

1. **Zero-Knowledge:**
   - На відміну від LastPass, Dashlane - повна гарантія приватності
   - Навіть при компрометації сервера дані залишаються зашифрованими

2. **Сучасний Tech Stack:**
   - Next.js 15 з App Router - найновіші можливості
   - React 19 - оптимізація продуктивності
   - Spring Boot 3.2.3 - сучасні Java практики

3. **Модульна Архітектура:**
   - Незалежне розгортання компонентів
   - Легка масштабованість
   - Простота підтримки

4. **Open Source:**
   - MIT ліцензія
   - Community contributions
   - Прозорість коду

5. **Multi-Platform:**
   - Web (готове)
   - Mobile (в розробці)
   - Єдина backend API

### 5.2 МОЖЛИВОСТІ ДЛЯ ПОКРАЩЕННЯ

1. **Додати функціональність:**
   - Two-Factor Authentication (2FA/MFA)
   - Biometric authentication
   - Password generator з кастомізацією
   - Password strength checker
   - Breach monitoring
   - Автоматичне заповнення форм
   - Browser extensions (Chrome, Firefox)
   - Desktop додатки (Electron)

2. **Покращити безпеку:**
   - Hardware security key підтримка (YubiKey)
   - Encrypted file attachments
   - Secure notes
   - Emergency access
   - Self-destruct функція
   - Audit logs

3. **UX покращення:**
   - Dark mode (вже є)
   - Vault організація (folders, tags)
   - Advanced search
   - Bulk operations
   - Import/Export (1Password, LastPass, etc.)
   - Password history
   - Favorites

4. **Enterprise Features:**
   - Team vaults
   - Role-based access control
   - Admin dashboard
   - Usage analytics
   - SSO integration
   - Compliance reports (SOC 2, GDPR)

5. **Технічні покращення:**
   - WebAuthn підтримка
   - Progressive Web App (PWA)
   - Offline mode
   - Real-time sync
   - Conflict resolution
   - End-to-end encrypted sharing
   - Rate limiting
   - GraphQL API (альтернатива REST)

6. **Інфраструктура:**
   - Kubernetes deployment
   - Auto-scaling
   - CDN для статики
   - Geo-distributed replicas
   - Automated backups
   - Disaster recovery plan
   - Monitoring та alerting (Prometheus, Grafana)

---

## 6. РЕКОМЕНДАЦІЇ ДЛЯ СТВОРЕННЯ ПОКРАЩЕНОЇ ВЕРСІЇ

### 6.1 BACKEND ПОКРАЩЕННЯ

#### 1. API Versioning:
```java
@RestController
@RequestMapping("${api.uri-prefix}/v1/vaults")
public class VaultController {
    // Версіонування через URL path
}
```

#### 2. GraphQL додатково до REST:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-graphql</artifactId>
</dependency>
```

#### 3. Rate Limiting:
```java
@Component
public class RateLimitInterceptor extends HandlerInterceptorAdapter {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // Bucket4j або Redis-based rate limiting
}
```

#### 4. Audit Logging:
```java
@Entity
public class AuditLog {
    private String userId;
    private String action;
    private String resourceType;
    private String resourceId;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String userAgent;
}
```

#### 5. WebSocket для Real-time:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### 6. Better Error Handling:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(VaultNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleVaultNotFound(
        VaultNotFoundException ex
    ) {
        // Structured error responses
    }
}
```

#### 7. Metrics та Monitoring:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### 6.2 FRONTEND ПОКРАЩЕННЯ

#### 1. Progressive Web App:
```typescript
// next.config.ts
import withPWA from 'next-pwa'

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})
```

#### 2. Offline Support:
```typescript
// Service Worker для offline mode
// IndexedDB для локального кешування
import { openDB } from 'idb'

const db = await openDB('secure-vault', 1, {
  upgrade(db) {
    db.createObjectStore('vaults')
    db.createObjectStore('sync-queue')
  }
})
```

#### 3. Optimistic UI Updates:
```typescript
// Zustand store з optimistic updates
const useVaultStore = create((set) => ({
  vaults: [],

  addVault: async (vault) => {
    // Optimistic update
    set((state) => ({ vaults: [...state.vaults, vault] }))

    try {
      await api.createVault(vault)
    } catch (error) {
      // Rollback on error
      set((state) => ({
        vaults: state.vaults.filter(v => v.id !== vault.id)
      }))
    }
  }
}))
```

#### 4. Advanced Encryption:
```typescript
// Додати підтримку різних алгоритмів
interface EncryptionService {
  encrypt(data: string, algorithm: 'AES-GCM' | 'ChaCha20-Poly1305'): Promise<string>
  decrypt(data: string, algorithm: 'AES-GCM' | 'ChaCha20-Poly1305'): Promise<string>
}
```

#### 5. Password Generator Component:
```typescript
interface PasswordGeneratorOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

const generatePassword = (options: PasswordGeneratorOptions): string => {
  // Cryptographically secure random password
}
```

#### 6. Import/Export:
```typescript
interface ImportExportService {
  exportToFormat(format: '1password' | 'lastpass' | 'csv' | 'json'): Promise<Blob>
  importFromFormat(file: File, format: string): Promise<Vault[]>
}
```

#### 7. WebAuthn Authentication:
```typescript
// Додати підтримку FIDO2/WebAuthn
const registerWebAuthn = async () => {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { name: "Secure Vault" },
      user: {
        id: new Uint8Array(16),
        name: "user@example.com",
        displayName: "User"
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }]
    }
  })
}
```

### 6.3 DEVOPS ПОКРАЩЕННЯ

#### 1. Kubernetes Deployment:
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-vault-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-vault-backend
  template:
    metadata:
      labels:
        app: secure-vault-backend
    spec:
      containers:
      - name: backend
        image: secure-vault-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: production
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

#### 2. Helm Charts:
```yaml
# values.yaml
replicaCount: 3
image:
  repository: secure-vault-backend
  tag: latest
  pullPolicy: IfNotPresent

mongodb:
  enabled: true
  auth:
    enabled: true
  replicaSet:
    enabled: true
    replicas: 3

redis:
  enabled: true
  cluster:
    enabled: true
    nodes: 6
```

#### 3. CI/CD Pipeline (GitHub Actions):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Backend
        run: |
          cd backend
          mvn clean package
          docker build -t secure-vault-backend .

      - name: Build Frontend
        run: |
          cd frontend
          yarn build
          docker build -t secure-vault-frontend .

      - name: Run Tests
        run: |
          mvn test
          yarn test

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
```

#### 4. Monitoring Stack:
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
```

### 6.4 ТЕСТУВАННЯ

#### Backend Tests:
```java
@SpringBootTest
@AutoConfigureMockMvc
class VaultControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldCreateVault() throws Exception {
        mockMvc.perform(post("/api/v1/vaults")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                    "name": "Test Vault",
                    "encryptedData": "..."
                }
            """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

#### Frontend Tests:
```typescript
// vault.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { VaultForm } from './VaultForm'

describe('VaultForm', () => {
  it('should encrypt data before submission', async () => {
    const onSubmit = jest.fn()
    render(<VaultForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'test-password' }
    })

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          encryptedData: expect.any(String)
        })
      )
    })
  })
})
```

#### E2E Tests (Playwright):
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('complete registration flow', async ({ page }) => {
  await page.goto('http://localhost:3000/register')

  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')

  // Verify email sent
  await expect(page.locator('.success-message')).toBeVisible()

  // Simulate email verification
  await page.goto('/verify?token=xxx')

  // Set master password
  await page.fill('input[name="masterPassword"]', 'SecurePass123!')
  await page.fill('input[name="confirmPassword"]', 'SecurePass123!')
  await page.click('button[type="submit"]')

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 7. ВИСНОВКИ ТА РЕЗЮМЕ

### 7.1 КЛЮЧОВІ ВИСНОВКИ

**Secure Vault** - це професійно спроектована система управління паролями з:

1. **Сильна архітектура безпеки:**
   - Zero-Knowledge encryption
   - End-to-end шифрування
   - PBKDF2 + AES-GCM
   - JWT authentication

2. **Сучасний технологічний стек:**
   - Backend: Spring Boot 3.2.3 + Java 17
   - Frontend: Next.js 15 + React 19 + TypeScript
   - Databases: MongoDB + Redis
   - Infrastructure: Docker + Docker Compose

3. **Модульна архітектура:**
   - Незалежні компоненти
   - Чистий код
   - Легка масштабованість

4. **Production-ready інфраструктура:**
   - Redis Sentinel для HA
   - Master-Slave реплікація
   - Health checks
   - Automated deployment

### 7.2 РЕКОМЕНДАЦІЇ ДЛЯ ПОКРАЩЕНОЇ ВЕРСІЇ

#### Обов'язкові покращення:
1. ✅ Two-Factor Authentication (TOTP, SMS, Email)
2. ✅ Password generator з налаштуваннями
3. ✅ Vault folders та tags
4. ✅ Import/Export функціональність
5. ✅ Browser extensions
6. ✅ Password strength meter
7. ✅ Breach monitoring
8. ✅ Audit logs

#### Додаткові функції:
1. ✅ WebAuthn/FIDO2 підтримка
2. ✅ Biometric authentication
3. ✅ Encrypted file attachments
4. ✅ Secure notes
5. ✅ Emergency access
6. ✅ Family/Team sharing
7. ✅ Password history
8. ✅ Auto-fill для браузерів

#### Технічні покращення:
1. ✅ GraphQL API
2. ✅ WebSocket для real-time sync
3. ✅ Progressive Web App
4. ✅ Offline mode з IndexedDB
5. ✅ Rate limiting
6. ✅ Advanced monitoring (Prometheus + Grafana)
7. ✅ Kubernetes deployment
8. ✅ Automated E2E testing

### 7.3 СТРУКТУРА РЕКОМЕНДОВАНОГО ПРОЕКТУ

```
improved-secure-vault/
├── backend/                    # Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vault/
│   │   │   │       ├── auth/
│   │   │   │       ├── vault/
│   │   │   │       ├── user/
│   │   │   │       ├── sharing/
│   │   │   │       ├── audit/
│   │   │   │       ├── mfa/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # Next.js
│   ├── src/
│   │   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── vault/
│   │   │   ├── sharing/
│   │   │   ├── settings/
│   │   │   └── generator/
│   │   ├── shared/
│   │   └── core/
│   ├── public/
│   └── package.json
│
├── browser-extension/          # Chrome/Firefox
│   ├── manifest.json
│   ├── background/
│   ├── content/
│   └── popup/
│
├── mobile/                     # React Native
│   ├── ios/
│   ├── android/
│   └── src/
│
├── infrastructure/
│   ├── k8s/                   # Kubernetes
│   ├── helm/                  # Helm charts
│   ├── terraform/             # Infrastructure as Code
│   └── monitoring/            # Prometheus + Grafana
│
├── docs/                      # Документація
│   ├── api/
│   ├── security/
│   └── deployment/
│
└── .github/
    └── workflows/             # CI/CD
        ├── backend.yml
        ├── frontend.yml
        └── deploy.yml
```

### 7.4 TIMELINE ДЛЯ РОЗРОБКИ (ОРІЄНТОВНИЙ)

**Phase 1 (1-2 місяці):**
- ✅ Core vault functionality
- ✅ Basic auth (registration, login, JWT)
- ✅ Encryption system
- ✅ CRUD для паролів

**Phase 2 (1 місяць):**
- ✅ Two-Factor Authentication
- ✅ Password generator
- ✅ Folders та tags
- ✅ Search та filters

**Phase 3 (1-2 місяці):**
- ✅ Browser extensions
- ✅ Auto-fill
- ✅ Import/Export
- ✅ Password strength meter

**Phase 4 (1 місяць):**
- ✅ Mobile app (React Native)
- ✅ Real-time sync
- ✅ Offline mode

**Phase 5 (1 місяць):**
- ✅ Sharing features
- ✅ Team vaults
- ✅ Emergency access

**Phase 6 (ongoing):**
- ✅ Security audits
- ✅ Performance optimization
- ✅ Scaling infrastructure
- ✅ Additional features

---

## 8. КОРИСНІ РЕСУРСИ

### Документація:
- Spring Security: https://spring.io/projects/spring-security
- Next.js: https://nextjs.org/docs
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- OWASP: https://owasp.org/

### Інструменти безпеки:
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp
- JWT Debugger: https://jwt.io/

### Криптографія:
- PBKDF2: https://en.wikipedia.org/wiki/PBKDF2
- AES-GCM: https://en.wikipedia.org/wiki/Galois/Counter_Mode
- WebAuthn: https://webauthn.guide/

### Кращі практики:
- NIST Password Guidelines: https://pages.nist.gov/800-63-3/
- OWASP Password Storage Cheat Sheet
- CWE Top 25: https://cwe.mitre.org/top25/

---

**Дата аналізу:** 22 листопада 2025

**Автор:** AI Assistant

**Версія:** 1.0

---

*Цей документ надає повний огляд проектів Secure Vault та рекомендації для створення покращеної версії з додатковою функціональністю та кращою безпекою.*

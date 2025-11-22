# SECURE VAULT - КОРОТКИЙ ДОВІДНИК

## ТЕХНОЛОГІЇ

### Backend
- **Java 17** + **Spring Boot 3.2.3**
- **MongoDB** (NoSQL database)
- **Redis** (caching + sessions)
- **Spring Security 6.3.0** + **JWT (JJWT 0.12.5)**
- **PBKDF2** для password hashing
- **Docker + Docker Compose**

### Frontend
- **Next.js 15** (App Router + Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS** + **HeroUI**
- **Zustand** (state management)
- **React Hook Form** + **Zod**
- **Framer Motion** (animations)
- **next-intl** (i18n)

## API ENDPOINTS

### Authentication
```
POST /api/v1/auth/send-email-verification
POST /api/v1/auth/verify-email
POST /api/v1/auth/finish-registration
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
```

### User
```
GET  /api/v1/user/me
GET  /api/v1/user/profile
PUT  /api/v1/user/profile
POST /api/v1/user/change-password
```

### Vault (в розробці)
```
GET    /api/v1/vaults
POST   /api/v1/vaults
GET    /api/v1/vaults/:id
PUT    /api/v1/vaults/:id
DELETE /api/v1/vaults/:id
POST   /api/v1/vaults/:id/share
```

## ЗМІННІ СЕРЕДОВИЩА

### Backend (.env)
```bash
# Application
APP_NAME=Secure Vault
API_URI_PREFIX=/api
SERVER_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGO_DATABASE=vault-db
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_password
MONGO_URI=mongodb://admin:password@mongodb:27017/vault-db?authSource=vault-db

# Redis
REDIS_MODE=standalone
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_TIMEOUT=60000

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Security - PBKDF2
PBKDF2_SECRET=your_secret_key
PBKDF2_SALT_LENGTH=600000
PBKDF2_ITERATIONS=256

# Security - JWT
JWT_SECRET=your_jwt_secret
JWT_TOKEN_EXPIRES_IN=900000              # 15 min
JWT_REFRESH_TOKEN_EXPIRES_IN=86400000    # 24 hours
JWT_REMEMBER_ME_EXPIRES_IN=604800000     # 7 days
REGISTRATION_EMAIL_TOKEN_EXPIRES_IN=86400000  # 24 hours

# Cookies
COOKIE_REFRESH_DOMAIN=localhost
COOKIE_REFRESH_PATH=/
COOKIE_REFRESH_SAME_SITE=strict
```

### Frontend (.env)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## СТРУКТУРА ПРОЕКТУ

### Backend
```
src/main/java/com/securevault/main/
├── MainApplication.java
├── controller/        # REST controllers
├── service/          # Business logic
├── repository/       # MongoDB repositories
├── entity/           # Data models
├── config/           # Configurations
└── util/             # Utilities
```

### Frontend
```
src/
├── app/
│   └── [locale]/          # Локалізовані маршрути
│       ├── (auth)/        # Автентифікація
│       ├── (protected)/   # Захищені сторінки
│       └── (public)/      # Публічні сторінки
├── modules/
│   ├── auth/              # Auth модуль
│   └── vault/             # Vault модуль
├── shared/
│   ├── components/        # Компоненти
│   ├── services/          # API сервіси
│   ├── hooks/             # React hooks
│   └── utils/             # Утиліти
└── core/
    ├── config/            # Конфігурації
    └── i18n/              # Локалізація
```

## ЗАПУСК ПРОЕКТУ

### Backend

**Через Docker (рекомендовано):**
```bash
cd secure-vault-server
make setup-dev
make up
```

**Локально:**
```bash
cd secure-vault-server
mvn clean install
mvn spring-boot:run
```

**Корисні команди:**
```bash
make logs              # Перегляд логів
make ps                # Статус контейнерів
make shell             # Доступ до backend
make mongo-shell       # MongoDB shell
make redis-cli         # Redis CLI
make test              # Запуск тестів
make down              # Зупинка
make clean             # Очищення
```

### Frontend

```bash
cd secure-vault-web
yarn install
yarn dev
```

**Інші команди:**
```bash
yarn build             # Production build
yarn start             # Production start
yarn lint              # Lint check
yarn format:fix        # Auto-format
```

## ПОРТИ

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MongoDB: `localhost:27018` (external: 27017 internal)
- Redis: `localhost:6380` (external: 6379 internal)

### Production
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MongoDB: `localhost:27018`
- Redis Master: `localhost:6382`
- Redis Slave 1: `localhost:6383`
- Redis Slave 2: `localhost:6384`
- Sentinel 1-3: `26382-26384`

## БЕЗПЕКА

### Архітектура Zero-Knowledge
```
User → Master Password (only on client)
     → PBKDF2 Key Derivation
     → Encryption Key (client storage)
     → AES-GCM Encryption
     → Encrypted Data → Server
                     → MongoDB (encrypted at rest)
```

### JWT Токени
- **Access Token:** 15 хвилин (в headers)
- **Refresh Token:** 24 години (httpOnly cookie)
- **Remember Me:** 7 днів

### Password Hashing
- **Алгоритм:** PBKDF2
- **Salt Length:** 600,000
- **Iterations:** 256

### Encryption
- **Клієнт:** AES-GCM
- **Ключі:** Derived з master password через PBKDF2
- **Сервер:** Ніколи не має доступу до незашифрованих даних

## FRONTEND СЕРВІСИ

### API Service
```typescript
apiService.get(url, params)
apiService.post(url, data)
apiService.put(url, data)
apiService.delete(url)
```

### Crypto Services
```typescript
cryptoService.encrypt(data, key)
cryptoService.decrypt(data, key)
keyGenerationService.deriveKey(password, salt)
encryptService.encryptVault(vault)
storageService.secureStore(key, value)
```

## ПОКРАЩЕННЯ ДЛЯ РЕАЛІЗАЦІЇ

### Пріоритет 1 (Must Have)
- [ ] Two-Factor Authentication (TOTP, SMS)
- [ ] Password Generator
- [ ] Vault Folders та Tags
- [ ] Import/Export (1Password, LastPass, CSV)
- [ ] Password Strength Meter
- [ ] Audit Logs

### Пріоритет 2 (Should Have)
- [ ] Browser Extensions (Chrome, Firefox)
- [ ] Auto-fill для форм
- [ ] Breach Monitoring
- [ ] Password History
- [ ] Favorites
- [ ] Advanced Search

### Пріоритет 3 (Nice to Have)
- [ ] WebAuthn/FIDO2
- [ ] Biometric Authentication
- [ ] Encrypted File Attachments
- [ ] Secure Notes
- [ ] Emergency Access
- [ ] Team Sharing
- [ ] Mobile App (React Native)

### Технічні покращення
- [ ] GraphQL API
- [ ] WebSocket (real-time sync)
- [ ] PWA (Progressive Web App)
- [ ] Offline Mode (IndexedDB)
- [ ] Rate Limiting
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Kubernetes Deployment
- [ ] E2E Tests (Playwright)

## ТЕСТУВАННЯ

### Backend
```bash
mvn test
mvn verify
```

### Frontend
```bash
yarn test
yarn test:e2e
yarn test:coverage
```

## МОНІТОРИНГ

### Health Check
```bash
curl http://localhost:8080/api/v1/health/live
```

### Actuator Endpoints (якщо увімкнено)
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
curl http://localhost:8080/actuator/prometheus
```

## DEPLOYMENT

### Docker Build
```bash
# Backend
docker build -t secure-vault-backend .

# Frontend
docker build -t secure-vault-frontend .
```

### Production
```bash
# Backend
make up ENV=prod

# Frontend
yarn build
yarn start
```

## КОРИСНІ ПОСИЛАННЯ

- **Репозиторії:**
  - Backend: https://github.com/puneetkakkar/secure-vault-server
  - Frontend: https://github.com/puneetkakkar/secure-vault-web
  - Main: https://github.com/puneetkakkar/secure-vault

- **Документація:**
  - Spring Boot: https://spring.io/projects/spring-boot
  - Next.js: https://nextjs.org/docs
  - Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

- **Безпека:**
  - OWASP: https://owasp.org/
  - NIST Guidelines: https://pages.nist.gov/800-63-3/

## TROUBLESHOOTING

### Backend не запускається
```bash
# Перевірити логи
make logs SERVICE=backend

# Перевірити MongoDB
make mongo-shell

# Перевірити Redis
make redis-cli
```

### Frontend помилки CORS
- Перевірте FRONTEND_URL в backend env
- Переконайтеся що backend працює на 8080

### JWT токени не працюють
- Перевірте JWT_SECRET
- Перевірте час на сервері
- Очистіть cookies та localStorage

### MongoDB connection refused
```bash
# Перевірити статус
docker ps | grep mongo

# Перезапустити
make restart SERVICE=mongodb
```

---

**Швидкий старт:**
1. Клонувати репозиторії
2. Налаштувати .env файли
3. `make setup-dev && make up` (backend)
4. `yarn install && yarn dev` (frontend)
5. Відкрити http://localhost:3000

**Повний аналіз:** Дивіться SECURE_VAULT_ANALYSIS.md

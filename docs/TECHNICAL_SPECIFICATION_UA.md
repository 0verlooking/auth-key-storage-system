# Технічна Специфікація

**Назва проекту:** Auth Key Storage System  
**Тип:** Курсова робота  
**Мова:** Java 17, TypeScript  
**Фреймворки:** Spring Boot 3.2, React 18  
**Версія:** 1.0  
**Дата:** 2024

---

## 1. Вступ

### 1.1. Мета Проекту

Розробка повнофункціональної веб-системи для безпечного зберігання паролів, API ключів, OAuth токенів та інших конфіденційних даних з використанням Zero-Knowledge шифрування.

### 1.2. Актуальність

У сучасному цифровому світі кожна людина має десятки облікових записів та API ключів. Зберігання цих даних у незахищеному вигляді є серйозною проблемою безпеки. Існуючі рішення часто:

- Зберігають дані на сервері в розшифрованому вигляді
- Не надають гнучких можливостей організації
- Мають складний або застарілий інтерфейс
- Не підтримують безпечний обмін ключами

**Auth Key Storage System** вирішує ці проблеми, надаючи:
- Zero-Knowledge шифрування (сервер не має доступу до даних)
- Інтуїтивний сучасний інтерфейс
- Гнучку систему організації (папки + теги)
- Безпечний обмін через одноразові посилання

### 1.3. Цілі та Завдання

**Головна ціль:** Створити безпечну, зручну та масштабовану систему для зберігання конфіденційних даних.

**Завдання:**

1. **Backend розробка:**
   - Реалізувати RESTful API на Spring Boot
   - Налаштувати автентифікацію та авторизацію (JWT)
   - Інтегрувати PostgreSQL для зберігання даних
   - Інтегрувати Redis для кешування
   - Реалізувати всі бізнес-процеси

2. **Frontend розробка:**
   - Створити SPA на React 18
   - Реалізувати Zero-Knowledge шифрування
   - Розробити адаптивний UI (responsive design)
   - Забезпечити UX відповідно до сучасних стандартів

3. **DevOps:**
   - Контейнеризація через Docker
   - Налаштування Docker Compose
   - Автоматизація розгортання

4. **Документація:**
   - UML діаграми (Sequence, Component, Class)
   - API документація (Swagger/OpenAPI)
   - Технічна документація
   - Інструкції для користувачів

### 1.4. Область Застосування

- Індивідуальні користувачі для особистого використання
- Розробники для зберігання API ключів
- Команди для обміну обліковими даними
- IT фахівці для організації інфраструктурних ключів

---

## 2. Функціональні Вимоги

### 2.1. Модуль Автентифікації та Авторизації

**FR-AUTH-001**: Система повинна надавати можливість реєстрації нових користувачів  
- Поля: повне ім'я, email, username, пароль, master password
- Валідація всіх полів
- Унікальність email та username
- Мінімальна довжина паролю: 8 символів

**FR-AUTH-002**: Система повинна надавати можливість входу  
- Вхід по username або email
- Перевірка паролю через BCrypt
- Генерація JWT access та refresh токенів
- Збереження сесії в Redis

**FR-AUTH-003**: Система повинна підтримувати оновлення токенів  
- Refresh token для продовження сесії
- Автоматичне оновлення при закінченні access токену

**FR-AUTH-004**: Система повинна надавати можливість виходу  
- Інвалідація поточного токену
- Видалення сесії з Redis

**FR-AUTH-005**: Система повинна захищати API endpoints  
- JWT фільтр для всіх захищених endpoints
- Перевірка прав доступу
- Rate limiting для запобігання brute force

### 2.2. Модуль Управління Ключами

**FR-KEY-001**: Створення нових ключів  
- Підтримка типів: PASSWORD, API_KEY, SSH_KEY, OAUTH_TOKEN, DATABASE_CREDENTIALS
- Zero-Knowledge шифрування на клієнті
- Збереження зашифрованого значення на сервері
- Опціональні поля: опис, папка, теги

**FR-KEY-002**: Перегляд ключів  
- Список всіх ключів користувача
- Фільтрація за папкою, тегами, типом
- Пошук за назвою та описом
- Пагінація (20 елементів на сторінку)
- Сортування за назвою, датою створення, датою використання

**FR-KEY-003**: Редагування ключів  
- Зміна назви, опису
- Зміна зашифрованого значення
- Переміщення між папками
- Додавання/видалення тегів

**FR-KEY-004**: Видалення ключів  
- Soft delete (переміщення в кошик)
- Можливість відновлення протягом 30 днів
- Остаточне видалення після 30 днів

**FR-KEY-005**: Розшифрування ключів  
- Розшифрування на клієнті з використанням master password
- Копіювання в буфер обміну
- Автоматичне очищення буфера через 30 секунд

**FR-KEY-006**: Генерація паролів  
- Генерація безпечних паролів
- Налаштування довжини (8-128 символів)
- Налаштування набору символів (A-Z, a-z, 0-9, спецсимволи)

**FR-KEY-007**: Обране  
- Додавання ключів в обране
- Швидкий доступ до обраних ключів

### 2.3. Модуль Організації (Папки)

**FR-FOLDER-001**: Створення папок  
- Назва папки (обов'язкова, унікальна в межах користувача)
- Вкладені папки (необмежена глибина)
- Автоматичне встановлення parent_id

**FR-FOLDER-002**: Перегляд структури папок  
- Дерево папок у sidebar
- Кількість ключів у кожній папці (з урахуванням вкладених)
- Згортання/розгортання гілок

**FR-FOLDER-003**: Редагування папок  
- Перейменування
- Переміщення (зміна батьківської папки)

**FR-FOLDER-004**: Видалення папок  
- Видалення з переміщенням ключів у батьківську папку
- Рекурсивне видалення всіх вкладених папок та ключів

**FR-FOLDER-005**: Drag & Drop  
- Переміщення ключів між папками через drag & drop

### 2.4. Модуль Тегування

**FR-TAG-001**: Створення тегів  
- Назва тегу (обов'язкова)
- Колір (HEX код, опціонально)
- Унікальність в межах користувача

**FR-TAG-002**: Призначення тегів  
- Додавання кількох тегів до одного ключа
- Видалення тегів з ключа
- Many-to-many зв'язок

**FR-TAG-003**: Фільтрація за тегами  
- Вибір одного або кількох тегів
- Відображення ключів з обраними тегами
- Підрахунок кількості ключів для кожного тегу

**FR-TAG-004**: Управління тегами  
- Перейменування
- Зміна кольору
- Видалення (з видаленням зв'язків)

**FR-TAG-005**: Tag Cloud  
- Візуалізація популярних тегів
- Розмір тегу залежить від кількості ключів

### 2.5. Модуль Безпечного Обміну (Share Links)

**FR-SHARE-001**: Створення share link  
- Вибір ключа для обміну
- Налаштування терміну дії (1 година, 24 години, 7 днів, 30 днів, custom)
- Налаштування максимальної кількості переглядів (1, 5, 10, unlimited)
- Опціональний пароль для доступу
- Генерація унікального токену (UUID)

**FR-SHARE-002**: Доступ до share link  
- Публічний доступ за URL без автентифікації
- Перевірка терміну дії
- Перевірка кількості переглядів
- Перевірка пароля (якщо встановлено)
- Інкрементування лічильника переглядів

**FR-SHARE-003**: Відображення ключа з share link  
- Read-only доступ
- Показ зашифрованого значення
- Можливість копіювання
- Інформація про термін дії

**FR-SHARE-004**: Автоматичне видалення  
- Деактивація після досягнення max_access_count
- Деактивація після закінчення терміну дії
- Видалення з Redis cache

**FR-SHARE-005**: Управління share links  
- Список активних share links користувача
- Статистика переглядів
- Видалення до закінчення терміну

**FR-SHARE-006**: Сповіщення  
- Email сповіщення при доступі до share link
- Інформація про IP адресу та час доступу

### 2.6. Модуль Аудиту

**FR-AUDIT-001**: Логування подій  
- Всі дії користувача (створення, перегляд, редагування, видалення)
- Дії з share links
- Спроби входу (успішні та невдалі)
- Збереження IP адреси та User Agent

**FR-AUDIT-002**: Перегляд логів  
- Список всіх подій користувача
- Фільтрація за типом події, датою
- Пагінація

**FR-AUDIT-003**: Експорт логів  
- Експорт у CSV
- Експорт у JSON
- Фільтри при експорті

**FR-AUDIT-004**: Типи подій  
- `USER_REGISTERED`, `LOGIN`, `LOGIN_FAILED`, `LOGOUT`
- `KEY_CREATED`, `KEY_VIEWED`, `KEY_UPDATED`, `KEY_DELETED`
- `FOLDER_CREATED`, `FOLDER_UPDATED`, `FOLDER_DELETED`
- `TAG_CREATED`, `TAG_UPDATED`, `TAG_DELETED`
- `SHARELINK_CREATED`, `SHARELINK_ACCESSED`, `SHARELINK_DELETED`

### 2.7. Модуль Профілю Користувача

**FR-PROFILE-001**: Перегляд профілю  
- Відображення інформації користувача
- Статистика: кількість ключів, папок, тегів, share links

**FR-PROFILE-002**: Редагування профілю  
- Зміна повного імені
- Зміна email (з підтвердженням)

**FR-PROFILE-003**: Зміна паролю  
- Введення поточного паролю
- Введення нового паролю
- Підтвердження нового паролю

**FR-PROFILE-004**: Налаштування  
- Вибір теми (світла/темна)
- Вибір мови (UA/EN)
- Налаштування сповіщень

### 2.8. Модуль Пошуку

**FR-SEARCH-001**: Глобальний пошук  
- Пошук за назвою ключа
- Пошук за описом
- Пошук за тегами
- Full-text search

**FR-SEARCH-002**: Швидкий пошук  
- Пошук у реальному часі (debounce 300ms)
- Автодоповнення (autocomplete)
- Підсвічування результатів

---

## 3. Нефункціональні Вимоги

### 3.1. Безпека

**NFR-SEC-001**: Zero-Knowledge шифрування  
- Всі конфіденційні дані шифруються на клієнті
- Використання AES-256-GCM
- PBKDF2 для деривації ключа з master password
- 100,000+ ітерацій

**NFR-SEC-002**: Безпека комунікації  
- HTTPS для всіх з'єднань
- TLS 1.3
- Відсутність змішаного контенту

**NFR-SEC-003**: Автентифікація  
- JWT токени з підписом HS512
- Access token: 24 години
- Refresh token: 7 днів
- Зберігання токенів у httpOnly cookies або localStorage

**NFR-SEC-004**: Хешування паролів  
- BCrypt з cost factor 12
- Унікальна сіль для кожного користувача

**NFR-SEC-005**: Захист від атак  
- CSRF protection
- XSS protection (Content Security Policy)
- SQL Injection protection (Prepared Statements)
- Rate Limiting (100 запитів/хвилину на користувача)
- Brute force protection (блокування після 5 невдалих спроб)

**NFR-SEC-006**: CORS  
- Whitelist дозволених origin
- Обмеження методів та headers

### 3.2. Продуктивність

**NFR-PERF-001**: Час відгуку API  
- 95% запитів < 200ms
- 99% запитів < 500ms
- Складні запити (пошук, експорт) < 2s

**NFR-PERF-002**: Час завантаження сторінки  
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Total page load < 5s

**NFR-PERF-003**: Пагінація  
- Максимум 100 елементів на сторінку
- За замовчуванням 20 елементів

**NFR-PERF-004**: Кешування  
- Redis для сесій користувачів
- Redis для share links
- Browser caching для статичних ресурсів
- ETags для API responses

**NFR-PERF-005**: Оптимізація запитів  
- Lazy loading для великих списків
- Eager fetching для зв'язків JPA
- Query optimization (індекси БД)

### 3.3. Масштабованість

**NFR-SCALE-001**: Підтримка користувачів  
- До 10,000 одночасних користувачів
- До 1,000,000 зареєстрованих користувачів

**NFR-SCALE-002**: Підтримка даних  
- До 100,000 ключів на користувача
- До 10,000 папок на користувача
- До 1,000 тегів на користувача

**NFR-SCALE-003**: Горизонтальне масштабування  
- Stateless backend (можливість запуску кількох інстансів)
- Shared Redis для сесій
- Database connection pooling (HikariCP)

### 3.4. Доступність (Availability)

**NFR-AVAIL-001**: Uptime  
- 99.9% доступності (8.76 годин downtime на рік)
- Planned maintenance windows

**NFR-AVAIL-002**: Health checks  
- `/actuator/health` endpoint
- Docker health checks
- Моніторинг БД та Redis

**NFR-AVAIL-003**: Відновлення після збоїв  
- Автоматичний restart контейнерів
- Database connection retry
- Graceful degradation

### 3.5. Підтримуваність (Maintainability)

**NFR-MAINT-001**: Архітектура коду  
- Чіткий поділ на шари (MVC)
- SOLID principles
- Design Patterns
- Чистий код (Clean Code)

**NFR-MAINT-002**: Документація  
- JavaDoc для всіх публічних методів
- JSDoc для TypeScript
- README файли
- API документація (Swagger)

**NFR-MAINT-003**: Логування  
- Структуроване логування (Logback)
- Log levels: TRACE, DEBUG, INFO, WARN, ERROR
- Централізоване логування (опціонально ELK)

**NFR-MAINT-004**: Версіонування  
- Semantic Versioning (SemVer)
- Git branches: main, develop, feature/*

### 3.6. Сумісність

**NFR-COMPAT-001**: Браузери  
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Мобільні браузери (iOS Safari, Chrome Android)

**NFR-COMPAT-002**: Пристрої  
- Desktop (1920x1080 та вище)
- Tablet (768x1024)
- Mobile (375x667 та вище)
- Responsive design для всіх розмірів

**NFR-COMPAT-003**: Backend сумісність  
- Java 17 LTS
- PostgreSQL 15+
- Redis 7+

### 3.7. Usability (Зручність Використання)

**NFR-USAB-001**: Інтерфейс  
- Інтуїтивний UI
- Дотримання Material Design / Tailwind principles
- Доступність (WCAG 2.1 Level AA)

**NFR-USAB-002**: Навігація  
- Максимум 3 кліки до будь-якої функції
- Breadcrumbs для навігації
- Швидкі клавіші (keyboard shortcuts)

**NFR-USAB-003**: Зворотний зв'язок  
- Toast notifications для дій користувача
- Spinner/Loader для async операцій
- Валідація форм у реальному часі

**NFR-USAB-004**: Багатомовність  
- Підтримка UA та EN
- i18n для всіх текстів

### 3.8. Надійність (Reliability)

**NFR-REL-001**: Валідація даних  
- Валідація на клієнті (React Hook Form + Zod)
- Валідація на сервері (Spring Validation)
- Санітизація input даних

**NFR-REL-002**: Обробка помилок  
- Global Exception Handler на backend
- Error Boundary на frontend
- User-friendly повідомлення про помилки

**NFR-REL-003**: Транзакції  
- ACID властивості для критичних операцій
- @Transactional для бізнес-логіки
- Rollback при помилках

**NFR-REL-004**: Backup  
- Автоматичні backup PostgreSQL (щоденно)
- Retention policy: 30 днів
- Можливість відновлення

---

## 4. Технології та Інструменти

### 4.1. Backend

| Компонент | Технологія | Версія | Призначення |
|-----------|-----------|--------|-------------|
| Мова | Java | 17 LTS | Core language |
| Framework | Spring Boot | 3.2.1 | Application framework |
| Security | Spring Security | 6.2 | Authentication & Authorization |
| Data Access | Spring Data JPA | 3.2 | ORM & Database access |
| Cache | Spring Data Redis | 3.2 | Caching layer |
| Database | PostgreSQL | 15 | Relational database |
| Cache Store | Redis | 7 | In-memory cache |
| Build Tool | Maven | 3.9 | Dependency management |
| JWT | jjwt | 0.12.5 | JSON Web Tokens |
| Mapping | MapStruct | 1.5.5 | DTO ↔ Entity mapping |
| Utils | Lombok | 1.18.30 | Boilerplate reduction |
| API Docs | Springdoc OpenAPI | 2.3 | Swagger UI |
| Validation | Hibernate Validator | 8.0 | Bean validation |

### 4.2. Frontend

| Компонент | Технологія | Версія | Призначення |
|-----------|-----------|--------|-------------|
| Library | React | 18.2 | UI library |
| Language | TypeScript | 5.3 | Type safety |
| Build Tool | Vite | 5.0 | Build tool & dev server |
| Routing | React Router | 6.21 | Client-side routing |
| HTTP Client | Axios | 1.6 | API calls |
| Styling | TailwindCSS | 3.4 | Utility-first CSS |
| UI Components | Headless UI | 1.7 | Accessible components |
| Icons | Heroicons | 2.1 | SVG icons |
| Forms | React Hook Form | 7.49 | Form management |
| Validation | Zod | 3.22 | Schema validation |
| Crypto | CryptoJS | 4.2 | Encryption (AES-256-GCM) |
| State | React Context | Built-in | Global state |

### 4.3. DevOps

| Компонент | Технологія | Версія | Призначення |
|-----------|-----------|--------|-------------|
| Containerization | Docker | 24+ | Container platform |
| Orchestration | Docker Compose | 2.23+ | Multi-container apps |
| Web Server | Nginx | Alpine | Frontend web server |
| Package Manager | npm | 10+ | Frontend dependencies |

### 4.4. Development Tools

| Інструмент | Призначення |
|------------|-------------|
| Git | Version control |
| IntelliJ IDEA | Java IDE |
| VS Code | Frontend IDE |
| Postman | API testing |
| DBeaver | Database management |
| PlantUML | UML diagrams |

---

## 5. Архітектура

### 5.1. Загальна Архітектура

Проект використовує **Client-Server архітектуру** з **трирівневою структурою** backend.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                    (React SPA)                              │
│  - UI Components                                            │
│  - Business Logic (Zero-Knowledge Encryption)               │
│  - State Management                                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS (REST/JSON)
┌─────────────────────────────────────────────────────────────┐
│                         SERVER                              │
│                    (Spring Boot)                            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Presentation Layer (Controllers)              │ │
│  └───────────────────────────────────────────────────────┘ │
│                            ↕DTO                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Business Logic Layer (Services)               │ │
│  └───────────────────────────────────────────────────────┘ │
│                          ↕Entity                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Data Access Layer (Repositories)              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ JDBC
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
│                    (PostgreSQL)                             │
└─────────────────────────────────────────────────────────────┘
                            
                            ↕ Redis Protocol
┌─────────────────────────────────────────────────────────────┐
│                         CACHE                               │
│                        (Redis)                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2. Backend Архітектура

**Структура пакетів:**

```
com.authkey.storage/
├── controller/          # REST Controllers (Presentation Layer)
│   ├── AuthController
│   ├── AuthKeyController
│   ├── FolderController
│   ├── ShareLinkController
│   ├── TagController
│   ├── UserController
│   └── AuditLogController
│
├── service/            # Business Logic Layer
│   ├── AuthKeyService
│   ├── FolderService
│   ├── ShareLinkService
│   ├── TagService
│   ├── UserService
│   ├── AuditLogService
│   ├── EmailService
│   └── impl/          # Implementations
│
├── repository/         # Data Access Layer
│   ├── AuthKeyRepository
│   ├── FolderRepository
│   ├── ShareLinkRepository
│   ├── TagRepository
│   ├── UserRepository
│   └── AuditLogRepository
│
├── entity/            # JPA Entities (Domain Model)
│   ├── User
│   ├── AuthKey
│   ├── Folder
│   ├── Tag
│   ├── ShareLink
│   └── AuditLog
│
├── dto/               # Data Transfer Objects
│   ├── request/
│   └── response/
│
├── security/          # Security Configuration
│   ├── JwtAuthenticationFilter
│   ├── JwtTokenProvider
│   ├── UserDetailsServiceImpl
│   └── SecurityConfig
│
├── config/            # Spring Configuration
│   ├── RedisConfig
│   ├── CorsConfig
│   ├── OpenApiConfig
│   └── AsyncConfig
│
├── exception/         # Exception Handling
│   ├── GlobalExceptionHandler
│   ├── ResourceNotFoundException
│   ├── UnauthorizedException
│   └── ValidationException
│
├── util/              # Utilities
│   └── EncryptionUtil
│
└── enums/             # Enumerations
    ├── KeyType
    ├── AuditAction
    └── NotificationType
```

### 5.3. Frontend Архітектура

**Структура каталогів:**

```
src/
├── components/        # Reusable UI Components
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Spinner.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── keys/
│   │   ├── KeyList.jsx
│   │   ├── KeyItem.jsx
│   │   ├── KeyForm.jsx
│   │   └── KeyDetails.jsx
│   ├── folders/
│   │   ├── FolderTree.jsx
│   │   └── FolderForm.jsx
│   └── share/
│       └── ShareLinkModal.jsx
│
├── pages/             # Page Components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   └── AuditLogPage.jsx
│
├── services/          # API Services
│   ├── api.js
│   ├── authService.js
│   ├── keyService.js
│   ├── folderService.js
│   ├── tagService.js
│   └── shareLinkService.js
│
├── context/           # React Context (State Management)
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/             # Custom Hooks
│   ├── useAuth.js
│   ├── useKeys.js
│   └── useEncryption.js
│
├── utils/             # Utilities
│   ├── encryption.js  # Zero-Knowledge Encryption
│   ├── validation.js
│   └── constants.js
│
├── config/            # Configuration
│   └── config.js
│
├── App.jsx            # Main App Component
├── main.jsx           # Entry Point
└── index.css          # Global Styles
```

### 5.4. Database Schema

Див. розділ "Структура Бази Даних" у README.md

---

## 6. API Специфікація

### 6.1. Формат

- **Protocol**: REST
- **Data Format**: JSON
- **Authentication**: JWT Bearer Token
- **API Version**: v1 (prefix: `/api`)

### 6.2. Стандартні Відповіді

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  },
  "timestamp": "2024-02-28T10:30:00Z"
}
```

### 6.3. HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Успішна операція (GET, PUT) |
| 201 | Created | Ресурс створено (POST) |
| 204 | No Content | Успішна операція без тіла відповіді (DELETE) |
| 400 | Bad Request | Невалідні дані |
| 401 | Unauthorized | Відсутня або невалідна автентифікація |
| 403 | Forbidden | Недостатньо прав |
| 404 | Not Found | Ресурс не знайдено |
| 409 | Conflict | Конфлікт даних (напр., дублікат) |
| 422 | Unprocessable Entity | Валідація не пройшла |
| 429 | Too Many Requests | Rate limit перевищено |
| 500 | Internal Server Error | Помилка сервера |

### 6.4. Endpoints

Повний список endpoints див. у README.md розділ "API Endpoints".

---

## 7. Безпека

### 7.1. Zero-Knowledge Architecture

**Принцип**: Сервер не має доступу до незашифрованих даних користувача.

**Workflow:**

1. **Реєстрація:**
   - Користувач вводить Master Password
   - Frontend генерує унікальну сіль (salt)
   - Salt зберігається на сервері (для відновлення)
   - Ключ шифрування НЕ зберігається

2. **Вхід:**
   - Користувач вводить Master Password
   - Frontend отримує salt з сервера
   - Деривація ключа: `PBKDF2(masterPassword, salt, 100000 iterations)`
   - Ключ зберігається в memory/sessionStorage (не localStorage для безпеки)

3. **Шифрування:**
   ```javascript
   const encryptedValue = CryptoJS.AES.encrypt(
     plaintext,
     derivedKey,
     { mode: CryptoJS.mode.GCM, padding: CryptoJS.pad.Pkcs7 }
   ).toString();
   ```

4. **Відправка на сервер:**
   - POST `/api/keys` з `encryptedValue`
   - Сервер зберігає як є, без розшифрування

5. **Розшифрування:**
   ```javascript
   const decrypted = CryptoJS.AES.decrypt(
     encryptedValue,
     derivedKey,
     { mode: CryptoJS.mode.GCM, padding: CryptoJS.pad.Pkcs7 }
   ).toString(CryptoJS.enc.Utf8);
   ```

**Переваги:**
- Навіть при зломі сервера, дані залишаються зашифрованими
- Адміністратори не мають доступу до паролів користувачів
- Відповідність GDPR та іншим стандартам

**Недоліки:**
- Втрата Master Password = втрата всіх даних (no recovery)
- Більше навантаження на клієнта

### 7.2. Автентифікація (JWT)

**Структура токену:**
```json
{
  "sub": "username",
  "userId": 123,
  "roles": ["ROLE_USER"],
  "iat": 1709120400,
  "exp": 1709206800
}
```

**Алгоритм**: HS512 (HMAC with SHA-512)

**Токени:**
- **Access Token**: 24 години (короткий час життя для безпеки)
- **Refresh Token**: 7 днів (для оновлення access token)

**Зберігання:**
- **Backend**: Сесії в Redis (для можливості інвалідації)
- **Frontend**: localStorage або httpOnly cookies

### 7.3. Захист від Атак

**SQL Injection:**
- Використання JPA Prepared Statements
- Валідація всіх input даних

**XSS (Cross-Site Scripting):**
- Content Security Policy headers
- Санітизація HTML
- React автоматично екранує вміст

**CSRF (Cross-Site Request Forgery):**
- CSRF токени для state-changing операцій
- SameSite cookie attribute

**Brute Force:**
- Rate limiting (100 req/min per user)
- Блокування після 5 невдалих спроб входу
- Captcha (опціонально)

**DDoS:**
- Rate limiting на рівні Nginx
- Cloudflare (для production)

---

## 8. Тестування

### 8.1. Backend Тести

**Unit Tests:**
- JUnit 5
- Mockito для mock objects
- Покриття: мінімум 70%

**Integration Tests:**
- Spring Boot Test
- Testcontainers для PostgreSQL та Redis
- REST Assured для API тестів

**Приклад:**
```java
@SpringBootTest
@AutoConfigureMockMvc
class AuthKeyControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser
    void testCreateKey() throws Exception {
        mockMvc.perform(post("/api/keys")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Test Key\"}"))
            .andExpect(status().isCreated());
    }
}
```

### 8.2. Frontend Тести

**Unit Tests:**
- Vitest
- React Testing Library
- Покриття: мінімум 60%

**E2E Tests:**
- Cypress або Playwright (опціонально)

---

## 9. Розгортання

### 9.1. Docker Compose

```yaml
services:
  postgres:
    image: postgres:15-alpine
    ...
  
  redis:
    image: redis:7-alpine
    ...
  
  backend:
    build: ./backend
    ...
  
  frontend:
    build: ./frontend
    ...
```

### 9.2. Production Checklist

- [ ] Змінити всі дефолтні паролі
- [ ] Налаштувати HTTPS (SSL сертифікати)
- [ ] Налаштувати backup PostgreSQL
- [ ] Налаштувати моніторинг (опціонально)
- [ ] Налаштувати логування
- [ ] Оптимізувати build (minification, compression)
- [ ] Налаштувати CDN для статики

---

## 10. Висновки

**Auth Key Storage System** - це сучасна, безпечна та зручна система для зберігання конфіденційних даних, яка:

✅ Використовує Zero-Knowledge шифрування  
✅ Побудована з дотриманням SOLID принципів  
✅ Реалізує 10+ Design Patterns  
✅ Має зручний та інтуїтивний інтерфейс  
✅ Повністю контейнеризована через Docker  
✅ Добре задокументована  

Проект демонструє знання:
- Fullstack розробки (Backend + Frontend)
- Архітектурних патернів
- Принципів безпеки
- DevOps практик
- UML моделювання

---

**Автор:** Ваше Ім'я  
**Дата:** 2024  
**Версія:** 1.0

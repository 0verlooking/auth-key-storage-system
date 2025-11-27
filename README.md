# 🔐 Auth Key Storage System

**Secure Zero-Knowledge Password Manager and API Key Storage System**

Система безпечного зберігання паролів, API ключів та інших облікових даних з підтримкою Zero-Knowledge шифрування, організації в папки, тегування та безпечного обміну через одноразові посилання.

## 📋 Зміст

- [Огляд Проекту](#-огляд-проекту)
- [Функціональні Можливості](#-функціональні-можливості)
- [Технічний Стек](#-технічний-стек)
- [SOLID Принципи](#-solid-принципи)
- [Патерни Проектування](#-патерни-проектування)
- [Архітектура Системи](#-архітектура-системи)
- [Структура Бази Даних](#-структура-бази-даних)
- [API Endpoints](#-api-endpoints)
- [Безпека (Zero-Knowledge)](#-безпека-zero-knowledge)
- [Швидкий Старт](#-швидкий-старт)
- [Docker Інструкції](#-docker-інструкції)
- [Діаграми](#-діаграми)
- [Документація](#-документація)

---

## 🎯 Огляд Проекту

**Auth Key Storage System** - це fullstack веб-застосунок для безпечного зберігання паролів, API ключів, OAuth токенів та інших конфіденційних даних.

### Ключові Особливості

- **Zero-Knowledge Architecture**: Шифрування на клієнті, сервер не має доступу до незашифрованих даних
- **Організація в Папки**: Ієрархічна структура папок для логічної організації ключів
- **Система Тегів**: Гнучке тегування для швидкого пошуку та категоризації
- **Безпечний Обмін**: Одноразові посилання з обмеженням доступу та терміном дії
- **Аудит Логування**: Повна історія дій користувача
- **Responsive UI**: Адаптивний інтерфейс для десктопів та мобільних пристроїв

---

## ✨ Функціональні Можливості

### 🔑 Управління Ключами

- ✅ Створення, редагування, видалення ключів
- ✅ Підтримка різних типів: паролі, API ключі, OAuth токени, SSH ключі
- ✅ Zero-Knowledge шифрування (AES-256-GCM)
- ✅ Генератор безпечних паролів
- ✅ Копіювання в буфер обміну одним кліком
- ✅ Пошук за назвою, описом та тегами
- ✅ Фільтрація за типом, папкою, тегами
- ✅ Масові операції (видалення, переміщення)

### 📁 Організація

- ✅ Створення вкладених папок (необмежена глибина)
- ✅ Drag & Drop переміщення ключів між папками
- ✅ Система тегів з кольоровим кодуванням
- ✅ Обране (Favorites)
- ✅ Нещодавно використані
- ✅ Кошик з можливістю відновлення

### 🔗 Безпечний Обмін

- ✅ Створення одноразових посилань
- ✅ Обмеження кількості переглядів
- ✅ Термін дії посилань
- ✅ Захист паролем (опціонально)
- ✅ Сповіщення про доступ
- ✅ Автоматичне видалення після використання

### 👤 Користувачі та Безпека

- ✅ Реєстрація та автентифікація (JWT)
- ✅ Master Password для шифрування
- ✅ Двофакторна автентифікація (2FA)
- ✅ Зміна паролю
- ✅ Управління сесіями
- ✅ IP whitelist (опціонально)

### 📊 Аудит та Моніторинг

- ✅ Повна історія дій користувача
- ✅ Логування доступу до ключів
- ✅ Сповіщення про підозрілу активність
- ✅ Експорт логів (CSV, JSON)
- ✅ Статистика використання

### ⚙️ Додатково

- ✅ Експорт/Імпорт ключів
- ✅ Резервне копіювання
- ✅ Темна/Світла тема
- ✅ Багатомовність (UA/EN)
- ✅ Налаштування профілю

---

## 🛠️ Технічний Стек

### Backend

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| **Java** | 17 LTS | Мова програмування |
| **Spring Boot** | 3.2.1 | Фреймворк backend |
| **Spring Security** | 6.2 | Автентифікація та авторизація |
| **Spring Data JPA** | 3.2 | ORM та доступ до даних |
| **Spring Data Redis** | 3.2 | Кешування |
| **PostgreSQL** | 15 | Реляційна база даних |
| **Redis** | 7 | In-memory cache |
| **JWT (jjwt)** | 0.12 | JSON Web Tokens |
| **Lombok** | 1.18.30 | Зменшення boilerplate коду |
| **MapStruct** | 1.5.5 | Маппінг DTO ↔ Entity |
| **Springdoc OpenAPI** | 2.3 | API документація (Swagger) |
| **BCrypt** | - | Хешування паролів |

### Frontend

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| **React** | 18.2 | UI бібліотека |
| **Vite** | 5.0 | Build tool та dev server |
| **TypeScript** | 5.3 | Типізація JavaScript |
| **React Router** | 6.21 | Навігація |
| **Axios** | 1.6 | HTTP клієнт |
| **TailwindCSS** | 3.4 | CSS фреймворк |
| **Headless UI** | 1.7 | Доступні UI компоненти |
| **Heroicons** | 2.1 | Іконки |
| **CryptoJS** | 4.2 | Шифрування (AES-256-GCM) |
| **React Hook Form** | 7.49 | Управління формами |
| **Zod** | 3.22 | Валідація схем |

### DevOps

| Технологія | Версія | Призначення |
|-----------|--------|-------------|
| **Docker** | 24+ | Контейнеризація |
| **Docker Compose** | 2.23+ | Оркестрація контейнерів |
| **Nginx** | Alpine | Web сервер для frontend |
| **Maven** | 3.9 | Управління залежностями (Backend) |
| **npm** | 10+ | Управління залежностями (Frontend) |

---

## 🏗️ SOLID Принципи

Проект побудований з дотриманням SOLID принципів об'єктно-орієнтованого програмування.

### S - Single Responsibility Principle (Принцип Єдиної Відповідальності)

**Кожен клас має одну причину для зміни.**

**Приклад:**
```java
// ❌ BAD: Клас робить занадто багато
public class UserService {
    public void createUser() { }
    public void sendEmail() { }
    public void generateReport() { }
}

// ✅ GOOD: Кожен клас має одну відповідальність
public class UserService {
    public void createUser() { }
}

public class EmailService {
    public void sendEmail() { }
}

public class ReportService {
    public void generateReport() { }
}
```

**У проекті:**
- `AuthKeyService` - управління ключами
- `FolderService` - управління папками
- `ShareLinkService` - управління share links
- `AuditLogService` - логування аудиту
- `EmailService` - відправка email

### O - Open/Closed Principle (Принцип Відкритості/Закритості)

**Класи повинні бути відкриті для розширення, але закриті для модифікації.**

**Приклад:**
```java
// ✅ Використання Strategy Pattern
public interface EncryptionStrategy {
    String encrypt(String data);
    String decrypt(String data);
}

public class AESEncryption implements EncryptionStrategy {
    public String encrypt(String data) { /* AES logic */ }
}

public class RSAEncryption implements EncryptionStrategy {
    public String encrypt(String data) { /* RSA logic */ }
}

// Можна додавати нові стратегії без зміни існуючого коду
```

**У проекті:**
- Інтерфейси сервісів дозволяють додавати нові реалізації
- Strategy Pattern для різних типів шифрування
- Repository Pattern через Spring Data JPA

### L - Liskov Substitution Principle (Принцип Підстановки Барбари Лісков)

**Об'єкти підкласів повинні замінювати об'єкти базових класів.**

**Приклад:**
```java
// ✅ Інтерфейс та реалізації
public interface AuthKeyRepository extends JpaRepository<AuthKey, Long> {
    List<AuthKey> findByUserId(Long userId);
}

// Можна замінити на Mock для тестування
public class MockAuthKeyRepository implements AuthKeyRepository {
    // Mock implementation
}
```

**У проекті:**
- Всі Repository можна замінити на Mock для тестування
- Service інтерфейси можна замінити тестовими реалізаціями
- Dependency Injection через Spring

### I - Interface Segregation Principle (Принцип Розділення Інтерфейсу)

**Клієнти не повинні залежати від інтерфейсів, які вони не використовують.**

**Приклад:**
```java
// ❌ BAD: Великий інтерфейс
public interface KeyManagement {
    void createKey();
    void updateKey();
    void deleteKey();
    void shareKey();
    void exportKey();
}

// ✅ GOOD: Розділені інтерфейси
public interface KeyCRUD {
    void createKey();
    void updateKey();
    void deleteKey();
}

public interface KeySharing {
    void shareKey();
}

public interface KeyExport {
    void exportKey();
}
```

**У проекті:**
- Окремі інтерфейси для CRUD операцій
- Окремі інтерфейси для Share Link логіки
- Окремі інтерфейси для аудит логування

### D - Dependency Inversion Principle (Принцип Інверсії Залежностей)

**Модулі верхнього рівня не повинні залежати від модулів нижнього рівня. Обидва повинні залежати від абстракцій.**

**Приклад:**
```java
// ✅ Контролер залежить від інтерфейсу, не від реалізації
@RestController
public class AuthKeyController {
    
    private final AuthKeyService authKeyService; // Інтерфейс
    
    @Autowired
    public AuthKeyController(AuthKeyService authKeyService) {
        this.authKeyService = authKeyService;
    }
}

// Реалізація може бути будь-якою
@Service
public class AuthKeyServiceImpl implements AuthKeyService {
    // Implementation
}
```

**У проекті:**
- Контролери залежать від Service інтерфейсів
- Сервіси залежать від Repository інтерфейсів
- Dependency Injection через конструктор (Spring)

---

## 🎨 Патерни Проектування

Проект використовує 10+ Design Patterns для забезпечення гнучкості та підтримуваності.

### 1. Repository Pattern

**Призначення:** Абстрагує логіку доступу до даних від бізнес-логіки.

```java
public interface AuthKeyRepository extends JpaRepository<AuthKey, Long> {
    List<AuthKey> findByUserId(Long userId);
    List<AuthKey> findByUserIdAndFolderId(Long userId, Long folderId);
    Optional<AuthKey> findByIdAndUserId(Long id, Long userId);
}

@Service
public class AuthKeyServiceImpl {
    private final AuthKeyRepository authKeyRepository;
    
    public List<AuthKey> getAllKeys(Long userId) {
        return authKeyRepository.findByUserId(userId);
    }
}
```

**Переваги:**
- Відокремлення бізнес-логіки від даних
- Легке тестування (Mock repositories)
- Зміна БД без зміни бізнес-логіки

### 2. Service Pattern (Layer Pattern)

**Призначення:** Відокремлює бізнес-логіку від контролерів.

```java
public interface AuthKeyService {
    AuthKeyResponse createAuthKey(AuthKeyRequest request, Long userId);
    AuthKeyResponse updateAuthKey(Long id, AuthKeyRequest request, Long userId);
    void deleteAuthKey(Long id, Long userId);
}

@Service
public class AuthKeyServiceImpl implements AuthKeyService {
    // Business logic implementation
}
```

**Переваги:**
- Single Responsibility
- Повторне використання логіки
- Легке тестування

### 3. DTO Pattern (Data Transfer Object)

**Призначення:** Передача даних між шарами без розкриття Entity структури.

```java
// Request DTO
public class AuthKeyRequest {
    private String name;
    private KeyType keyType;
    private String encryptedValue;
    private Long folderId;
}

// Response DTO
public class AuthKeyResponse {
    private Long id;
    private String name;
    private KeyType keyType;
    private LocalDateTime createdAt;
}

// Mapper (MapStruct)
@Mapper(componentModel = "spring")
public interface AuthKeyMapper {
    AuthKey toEntity(AuthKeyRequest request);
    AuthKeyResponse toResponse(AuthKey entity);
}
```

**Переваги:**
- Безпека (не розкриває внутрішню структуру)
- Гнучкість (різні DTO для різних endpoints)
- Валідація на рівні DTO

### 4. Singleton Pattern

**Призначення:** Забезпечує єдиний екземпляр класу.

```java
@Configuration
public class RedisConfig {
    
    @Bean  // Spring створює Singleton
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        return template;
    }
}
```

**Використання в проекті:**
- Spring Beans (@Bean, @Service, @Repository) - Singletons
- Configuration класи
- Security компоненти

### 5. Factory Pattern

**Призначення:** Створення об'єктів без визначення точного класу.

```java
public class NotificationFactory {
    
    public NotificationStrategy createNotification(NotificationType type) {
        return switch (type) {
            case EMAIL -> new EmailNotification();
            case PUSH -> new PushNotification();
            case SMS -> new SmsNotification();
        };
    }
}
```

**Використання:**
- Створення різних типів нотифікацій
- Створення різних експортерів (CSV, JSON, XML)

### 6. Strategy Pattern

**Призначення:** Дозволяє вибирати алгоритм у runtime.

```java
public interface EncryptionStrategy {
    String encrypt(String data);
    String decrypt(String data);
}

public class AESEncryption implements EncryptionStrategy {
    public String encrypt(String data) { /* AES-256-GCM */ }
    public String decrypt(String data) { /* AES-256-GCM */ }
}

public class CryptoService {
    private EncryptionStrategy strategy;
    
    public void setStrategy(EncryptionStrategy strategy) {
        this.strategy = strategy;
    }
    
    public String encrypt(String data) {
        return strategy.encrypt(data);
    }
}
```

**Використання:**
- Різні алгоритми шифрування
- Різні методи експорту даних

### 7. Observer Pattern (Event-Driven)

**Призначення:** Сповіщення про події без тісного зв'язку.

```java
// Event
public class AuditLogEvent extends ApplicationEvent {
    private final String action;
    private final Long userId;
    
    public AuditLogEvent(Object source, String action, Long userId) {
        super(source);
        this.action = action;
        this.userId = userId;
    }
}

// Publisher
@Service
public class AuthKeyService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void createKey(AuthKeyRequest request) {
        // ... create key logic
        eventPublisher.publishEvent(new AuditLogEvent(this, "KEY_CREATED", userId));
    }
}

// Listener
@Component
public class AuditLogListener {
    @EventListener
    @Async
    public void handleAuditEvent(AuditLogEvent event) {
        // Log to database
    }
}
```

**Переваги:**
- Асинхронна обробка подій
- Відокремлення логіки логування
- Можливість додавати нові слухачі

### 8. Template Method Pattern

**Призначення:** Визначає скелет алгоритму, дозволяючи підкласам перевизначати кроки.

```java
public abstract class BaseService<T, ID> {
    
    public T create(T entity) {
        validate(entity);
        T processed = processBeforeSave(entity);
        T saved = save(processed);
        afterSave(saved);
        return saved;
    }
    
    protected abstract void validate(T entity);
    protected abstract T processBeforeSave(T entity);
    protected abstract T save(T entity);
    protected void afterSave(T entity) { }
}

public class AuthKeyService extends BaseService<AuthKey, Long> {
    @Override
    protected void validate(AuthKey key) { /* validation */ }
    
    @Override
    protected AuthKey processBeforeSave(AuthKey key) { /* encryption */ }
    
    @Override
    protected AuthKey save(AuthKey key) { return repository.save(key); }
}
```

### 9. Composite Pattern

**Призначення:** Організація об'єктів у деревоподібну структуру.

```java
public interface FolderComponent {
    String getName();
    int getSize();
    List<FolderComponent> getChildren();
}

@Entity
public class Folder implements FolderComponent {
    private Long id;
    private String name;
    
    @ManyToOne
    private Folder parent;
    
    @OneToMany(mappedBy = "parent")
    private List<Folder> children = new ArrayList<>();
    
    @OneToMany(mappedBy = "folder")
    private List<AuthKey> keys = new ArrayList<>();
    
    @Override
    public int getSize() {
        return keys.size() + children.stream()
            .mapToInt(FolderComponent::getSize)
            .sum();
    }
}
```

**Використання:**
- Ієрархічна структура папок
- Рекурсивний підрахунок розміру

### 10. Dependency Injection Pattern

**Призначення:** Інверсія контролю для управління залежностями.

```java
@RestController
@RequestMapping("/api/keys")
public class AuthKeyController {
    
    private final AuthKeyService authKeyService;
    private final FolderService folderService;
    private final AuditLogService auditLogService;
    
    // Constructor Injection (рекомендований спосіб)
    @Autowired
    public AuthKeyController(
        AuthKeyService authKeyService,
        FolderService folderService,
        AuditLogService auditLogService
    ) {
        this.authKeyService = authKeyService;
        this.folderService = folderService;
        this.auditLogService = auditLogService;
    }
}
```

**Переваги:**
- Loose coupling
- Легке тестування (можна інжектити моки)
- Автоматичне управління життєвим циклом

---

## 🏛️ Архітектура Системи

Проект використовує **трирівневу архітектуру** (3-tier architecture) з чіткимрозділенням відповідальності.

### Шари Backend

```
┌─────────────────────────────────────────┐
│      Presentation Layer (Controllers)   │
│  - REST API Endpoints                   │
│  - Request/Response handling            │
│  - Validation                           │
└─────────────────────────────────────────┘
              ↓DTO↓
┌─────────────────────────────────────────┐
│      Business Logic Layer (Services)    │
│  - Business rules                       │
│  - Data transformation                  │
│  - Transaction management               │
└─────────────────────────────────────────┘
              ↓Entity↓
┌─────────────────────────────────────────┐
│      Data Access Layer (Repositories)   │
│  - Database operations                  │
│  - Query methods                        │
│  - Cache integration                    │
└─────────────────────────────────────────┘
              ↓JDBC↓
┌─────────────────────────────────────────┐
│           Database (PostgreSQL)         │
└─────────────────────────────────────────┘
```

### Компоненти

**Backend (Spring Boot):**
- **Controllers**: REST API endpoints
- **Services**: Бізнес-логіка
- **Repositories**: Доступ до даних (JPA)
- **Entities**: JPA сутності (модель даних)
- **DTOs**: Об'єкти передачі даних
- **Security**: JWT автентифікація та авторизація
- **Config**: Конфігурація Spring компонентів

**Frontend (React):**
- **Components**: Перевикористовувані UI компоненти
- **Pages**: Сторінки додатку
- **Services**: HTTP клієнти (API calls)
- **Context**: Глобальний стан (Auth, Theme)
- **Hooks**: Кастомні React hooks
- **Utils**: Утиліти (шифрування, валідація)

**Infrastructure:**
- **PostgreSQL**: Основна БД
- **Redis**: Кеш та сесії
- **Nginx**: Reverse proxy для frontend
- **Docker**: Контейнеризація всіх сервісів

### Діаграми

Детальні діаграми архітектури доступні в каталозі [`docs/diagrams/`](./docs/diagrams/):

- **Architecture Diagram** - загальна архітектура
- **Component Diagram** - компоненти та зв'язки
- **Sequence Diagrams** - бізнес-процеси
- **Wireframes** - UI макети

---

## 🗄️ Структура Бази Даних

### ER Діаграма (текстова)

```
users                    folders               auth_keys
┌──────────────┐        ┌──────────────┐      ┌──────────────────┐
│ id (PK)      │────┐   │ id (PK)      │      │ id (PK)          │
│ username     │    │   │ name         │      │ name             │
│ email        │    │   │ user_id (FK) │──┐   │ key_type         │
│ password     │    │   │ parent_id    │  │   │ encrypted_value  │
│ master_salt  │    │   │ created_at   │  │   │ description      │
│ created_at   │    │   └──────────────┘  │   │ user_id (FK)     │───┐
└──────────────┘    │                     │   │ folder_id (FK)   │───┤
                    │                     │   │ is_favorite      │   │
                    └─────────────────────┼───│ created_at       │   │
                                          │   │ updated_at       │   │
                                          │   └──────────────────┘   │
                                          │                          │
                                          └──────────────────────────┘

tags                    auth_key_tags         share_links
┌──────────────┐        ┌──────────────┐      ┌──────────────────┐
│ id (PK)      │        │ auth_key_id  │──┐   │ id (PK)          │
│ name         │────┐   │ tag_id       │──┤   │ token (UNIQUE)   │
│ color        │    │   └──────────────┘  │   │ auth_key_id (FK) │
│ user_id (FK) │    └─────────────────────┘   │ user_id (FK)     │
│ created_at   │                              │ encrypted_value  │
└──────────────┘                              │ expires_at       │
                                              │ max_access_count │
                                              │ access_count     │
audit_logs                                    │ is_active        │
┌──────────────────┐                          │ created_at       │
│ id (PK)          │                          └──────────────────┘
│ user_id (FK)     │
│ action           │
│ resource_type    │
│ resource_id      │
│ ip_address       │
│ user_agent       │
│ created_at       │
└──────────────────┘
```

### Таблиці

#### users
Користувачі системи.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| username | VARCHAR(50) | Унікальне ім'я користувача |
| email | VARCHAR(100) | Email (унікальний) |
| password_hash | VARCHAR(255) | BCrypt хеш паролю |
| master_salt | VARCHAR(255) | Сіль для шифрування (Zero-Knowledge) |
| full_name | VARCHAR(100) | Повне ім'я |
| is_active | BOOLEAN | Статус активності |
| created_at | TIMESTAMP | Дата створення |
| updated_at | TIMESTAMP | Дата оновлення |

#### auth_keys
Зашифровані ключі/паролі.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR(100) | Назва ключа |
| key_type | VARCHAR(50) | Тип (PASSWORD, API_KEY, SSH_KEY, OAUTH_TOKEN) |
| encrypted_value | TEXT | Зашифроване значення |
| description | TEXT | Опис |
| user_id | BIGINT | FK → users.id |
| folder_id | BIGINT | FK → folders.id (nullable) |
| is_favorite | BOOLEAN | Чи в обраному |
| is_deleted | BOOLEAN | Soft delete |
| created_at | TIMESTAMP | Дата створення |
| updated_at | TIMESTAMP | Дата оновлення |

#### folders
Папки для організації ключів.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR(100) | Назва папки |
| user_id | BIGINT | FK → users.id |
| parent_id | BIGINT | FK → folders.id (nullable) |
| created_at | TIMESTAMP | Дата створення |
| updated_at | TIMESTAMP | Дата оновлення |

#### tags
Теги для категоризації.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR(50) | Назва тегу |
| color | VARCHAR(7) | Колір (HEX) |
| user_id | BIGINT | FK → users.id |
| created_at | TIMESTAMP | Дата створення |

#### auth_key_tags
Many-to-Many зв'язок між ключами та тегами.

| Колонка | Тип | Опис |
|---------|-----|------|
| auth_key_id | BIGINT | FK → auth_keys.id |
| tag_id | BIGINT | FK → tags.id |

#### share_links
Одноразові посилання для обміну ключами.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| token | VARCHAR(255) | Унікальний токен (UUID) |
| auth_key_id | BIGINT | FK → auth_keys.id |
| user_id | BIGINT | FK → users.id (creator) |
| encrypted_value | TEXT | Зашифроване значення |
| expires_at | TIMESTAMP | Дата закінчення |
| max_access_count | INTEGER | Макс. кількість переглядів |
| access_count | INTEGER | Поточна кількість переглядів |
| is_active | BOOLEAN | Чи активне |
| created_at | TIMESTAMP | Дата створення |

#### audit_logs
Журнал аудиту дій користувачів.

| Колонка | Тип | Опис |
|---------|-----|------|
| id | BIGSERIAL | Primary key |
| user_id | BIGINT | FK → users.id (nullable для анонімних) |
| action | VARCHAR(50) | Тип дії (LOGIN, KEY_CREATED, KEY_VIEWED, тощо) |
| resource_type | VARCHAR(50) | Тип ресурсу (AUTH_KEY, FOLDER, SHARE_LINK) |
| resource_id | BIGINT | ID ресурсу |
| ip_address | VARCHAR(45) | IP адреса |
| user_agent | VARCHAR(255) | User agent браузера |
| details | JSONB | Додаткові деталі |
| created_at | TIMESTAMP | Дата події |

### Індекси

```sql
-- Для швидкого пошуку
CREATE INDEX idx_auth_keys_user_id ON auth_keys(user_id);
CREATE INDEX idx_auth_keys_folder_id ON auth_keys(folder_id);
CREATE INDEX idx_auth_keys_name ON auth_keys(name);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_expires_at ON share_links(expires_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Опис |
|--------|----------|------|
| POST | `/api/auth/register` | Реєстрація нового користувача |
| POST | `/api/auth/login` | Вхід (отримання JWT токену) |
| POST | `/api/auth/refresh` | Оновлення JWT токену |
| POST | `/api/auth/logout` | Вихід |
| GET | `/api/auth/me` | Отримати інформацію про поточного користувача |

### Auth Keys

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/keys` | Отримати всі ключі користувача |
| GET | `/api/keys/{id}` | Отримати конкретний ключ |
| POST | `/api/keys` | Створити новий ключ |
| PUT | `/api/keys/{id}` | Оновити ключ |
| DELETE | `/api/keys/{id}` | Видалити ключ |
| GET | `/api/keys/folder/{folderId}` | Отримати ключі в папці |
| GET | `/api/keys/favorites` | Отримати обрані ключі |
| GET | `/api/keys/search?q={query}` | Пошук ключів |

### Folders

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/folders` | Отримати всі папки |
| GET | `/api/folders/{id}` | Отримати конкретну папку |
| POST | `/api/folders` | Створити нову папку |
| PUT | `/api/folders/{id}` | Оновити папку |
| DELETE | `/api/folders/{id}` | Видалити папку |
| GET | `/api/folders/{id}/tree` | Отримати дерево підпапок |

### Tags

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/tags` | Отримати всі теги |
| GET | `/api/tags/{id}` | Отримати конкретний тег |
| POST | `/api/tags` | Створити новий тег |
| PUT | `/api/tags/{id}` | Оновити тег |
| DELETE | `/api/tags/{id}` | Видалити тег |
| GET | `/api/tags/{id}/keys` | Отримати ключі з тегом |

### Share Links

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/share-links` | Отримати всі share links користувача |
| GET | `/api/share-links/{token}` | Отримати ключ по share link |
| POST | `/api/share-links` | Створити share link |
| DELETE | `/api/share-links/{id}` | Видалити share link |
| GET | `/api/share-links/{id}/stats` | Статистика використання |

### Audit Logs

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/audit-logs` | Отримати логи користувача |
| GET | `/api/audit-logs/{id}` | Отримати конкретний лог |
| GET | `/api/audit-logs/export` | Експортувати логи (CSV/JSON) |

### User Profile

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/users/profile` | Отримати профіль |
| PUT | `/api/users/profile` | Оновити профіль (firstName, lastName) |
| PUT | `/api/users/profile/password` | Змінити пароль |
| GET | `/api/users/profile/stats` | Статистика користувача (ключі, папки, теги) |

### Admin Panel (ADMIN only)

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/admin/stats` | Системна статистика |
| GET | `/api/admin/users` | Список всіх користувачів |
| GET | `/api/admin/auth-keys` | Список метаданих всіх ключів |
| PATCH | `/api/admin/users/{id}/toggle-status` | Активувати/деактивувати користувача |
| PATCH | `/api/admin/users/{id}/role` | Змінити роль користувача (USER ↔ ADMIN) |
| DELETE | `/api/admin/users/{id}` | Видалити користувача |

### API Documentation

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/swagger-ui.html` | Swagger UI |
| GET | `/v3/api-docs` | OpenAPI JSON |

---

## 🔒 Безпека (Zero-Knowledge)

### Принцип Zero-Knowledge

**Сервер НІКОЛИ не має доступу до незашифрованих даних.**

### Як це працює

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────┤
│ 1. User enters Master Password                             │
│ 2. Derive encryption key: PBKDF2(masterPassword, salt)     │
│ 3. Encrypt data: AES-256-GCM(plaintext, derivedKey)        │
│ 4. Send encrypted data to server                           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Backend)                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Receive encrypted data                                  │
│ 2. Store encrypted data in database                        │
│ 3. Never decrypt (no access to Master Password)            │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│ Store: encrypted_value (cannot be decrypted without key)   │
└─────────────────────────────────────────────────────────────┘
```

### Алгоритми Шифрування

**Frontend (CryptoJS):**
```javascript
// Генерація ключа з Master Password
const derivedKey = CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256/32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256
});

// Шифрування (AES-256-GCM)
const encrypted = CryptoJS.AES.encrypt(plaintext, derivedKey, {
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.Pkcs7
});

// Розшифрування
const decrypted = CryptoJS.AES.decrypt(encrypted, derivedKey, {
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.Pkcs7
});
```

**Backend (Spring Security):**
```java
// Хешування паролю (BCrypt)
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}

// JWT токени
String token = Jwts.builder()
    .setSubject(username)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + expiration))
    .signWith(SignatureAlgorithm.HS512, secret)
    .compact();
```

### Безпека Комунікації

- **HTTPS**: Всі дані передаються через TLS
- **JWT**: Stateless автентифікація
- **CORS**: Обмеження доменів
- **Rate Limiting**: Захист від brute force
- **SQL Injection**: Prepared statements (JPA)
- **XSS**: Content Security Policy
- **CSRF**: CSRF tokens

---

## 🚀 Швидкий Старт

### ⚡ Найпростіший спосіб (рекомендовано)

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

Скрипт автоматично:
1. ✅ Запустить Docker контейнери
2. ✅ Створить базу даних
3. ✅ Завантажить тестові дані
4. ✅ Покаже облікові дані для входу

Після запуску відкрийте: **http://localhost**

**Тестові облікові дані:**
- Email: `test@example.com` або `admin@example.com`
- Password: `Test123!` або `Admin123!`
- Master Password: `Test123!` або `Admin123!`

📖 Детальніше: [QUICK_START.md](QUICK_START.md)

---

### 🔧 Ручна установка

### Вимоги

- **Docker** 24.0+
- **Docker Compose** 2.23+
- **Git**

### Крок 1: Клонування Репозиторію

```bash
git clone https://github.com/yourusername/auth-key-storage-system.git
cd auth-key-storage-system
```

### Крок 2: Запуск через Docker Compose

```bash
# Windows
docker-compose up -d

# Linux/Mac
docker compose up -d
```

### Крок 3: Ініціалізація бази даних

```bash
# Windows
init-database.bat

# Linux/Mac
./init-database.sh
```

### Крок 4: Доступ до Застосунку

- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🐳 Docker Інструкції

### Команди

```bash
# Запустити всі сервіси
docker-compose up -d

# Запустити з PgAdmin (для розробки)
docker-compose --profile dev up -d

# Зупинити всі сервіси
docker-compose down

# Зупинити та видалити volumes (ВИДАЛИТЬ ВСІ ДАНІ!)
docker-compose down -v

# Переглянути логи
docker-compose logs -f

# Переглянути логи конкретного сервісу
docker-compose logs -f backend

# Перезапустити сервіс
docker-compose restart backend

# Перебудувати образи
docker-compose build --no-cache

# Запустити з перебудовою
docker-compose up -d --build
```

### Структура Контейнерів

```
┌─────────────────────────────────────────────────────────────┐
│                   Docker Network                            │
│               auth-key-storage-network                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Frontend   │  │   Backend    │  │  PostgreSQL  │     │
│  │   (Nginx)    │  │ (Spring Boot)│  │     15       │     │
│  │   Port: 80   │  │  Port: 8080  │  │  Port: 5432  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │    Redis     │  │   PgAdmin    │                       │
│  │      7       │  │   (dev only) │                       │
│  │  Port: 6379  │  │  Port: 5050  │                       │
│  └──────────────┘  └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Volumes

- `postgres-data` - Дані PostgreSQL (персистентні)
- `redis-data` - Дані Redis (персистентні)
- `pgadmin-data` - Конфігурація PgAdmin

### Health Checks

Всі сервіси мають health checks:

- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`
- **Backend**: `/actuator/health`
- **Frontend**: `wget http://localhost/health`

---

## 📊 Діаграми

Всі діаграми знаходяться в [`docs/diagrams/`](./docs/diagrams/):

### UML Діаграми (PlantUML)

1. **sequence-share-link.puml** - Sequence діаграма Share Link процесу
2. **wireframes.puml** - Wireframes UI (10 сторінок)
3. **architecture.puml** - C4 Container діаграма
4. **architecture-detailed.puml** - Детальна компонентна діаграма
5. **design-patterns.puml** - Візуалізація Design Patterns

### Як Рендерити

Дивіться [`docs/diagrams/README.md`](./docs/diagrams/README.md) для інструкцій.

**Швидкий спосіб** (онлайн):
1. Відкрити [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
2. Скопіювати вміст файлу `.puml`
3. Вставити в редактор
4. Зберегти як PNG/SVG

---

## 📚 Документація

### Каталог `docs/`

- **[TECHNICAL_SPECIFICATION_UA.md](./docs/TECHNICAL_SPECIFICATION_UA.md)** - Детальне ТЗ українською
- **[PROJECT_DOCUMENTATION_UA.md](./docs/PROJECT_DOCUMENTATION_UA.md)** - Повна документація проекту
- **[DEFENSE_GUIDE_UA.md](./docs/DEFENSE_GUIDE_UA.md)** - Посібник для захисту курсової
- **[README.md](./docs/README.md)** - Навігація по документації
- **[diagrams/](./docs/diagrams/)** - PlantUML діаграми

### API Документація

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🧪 Тестування

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
# TODO: Cypress або Playwright
```

---

## 📦 Build для Production

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
```

JAR файл буде в `backend/target/auth-key-storage-0.0.1-SNAPSHOT.jar`

### Frontend

```bash
cd frontend
npm run build
```

Build буде в `frontend/dist/`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 Ліцензія

MIT License - дивіться [LICENSE](LICENSE) файл.

---

## 👨‍💻 Автор

**Ваше Ім'я**
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Подяки

- Spring Boot Team
- React Team
- PlantUML Community
- Docker Team

---

## 📞 Підтримка

Якщо у вас виникли питання або проблеми:

1. Перегляньте [документацію](./docs/)
2. Відкрийте [Issue](https://github.com/yourusername/auth-key-storage-system/issues)
3. Напишіть на email: support@example.com

---

**Створено з ❤️ для курсової роботи**


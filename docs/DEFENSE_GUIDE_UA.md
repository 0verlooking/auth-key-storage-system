# Посібник для Захисту Курсової Роботи

**Auth Key Storage System**

---

## 📋 Зміст

1. [Підготовка до Захисту](#1-підготовка-до-захисту)
2. [Презентація (5-7 хвилин)](#2-презентація-5-7-хвилин)
3. [Демонстрація Проекту](#3-демонстрація-проекту)
4. [Пояснення SOLID Принципів](#4-пояснення-solid-принципів)
5. [Пояснення Design Patterns](#5-пояснення-design-patterns)
6. [Можливі Питання та Відповіді](#6-можливі-питання-та-відповіді)
7. [Чек-лист Перед Захистом](#7-чек-лист-перед-захистом)

---

## 1. Підготовка до Захисту

### 1.1. Що Потрібно Підготувати

✅ **Запущений проект:**
- Docker контейнери запущені
- Backend доступний на http://localhost:8080
- Frontend доступний на http://localhost
- Swagger UI відкритий у браузері

✅ **Презентація:**
- PowerPoint або Google Slides (10-15 слайдів)
- Діаграми (PNG експорт з PlantUML)
- Скріншоти інтерфейсу

✅ **Код:**
- IDE відкрите (IntelliJ IDEA для Backend, VS Code для Frontend)
- Приготовлені файли для показу (ключові класи)

✅ **Документація:**
- README.md відкритий
- Swagger документація готова

### 1.2. За День до Захисту

1. **Перевірити Docker:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   docker-compose ps  # Всі контейнери healthy
   ```

2. **Створити тестові дані:**
   - Зареєструвати користувача
   - Створити 5-10 ключів
   - Створити папки
   - Додати теги
   - Створити share link

3. **Підготувати скріншоти:**
   - Dashboard
   - Create key form
   - Share link modal
   - Folder tree
   - Swagger UI

4. **Прорепетирувати:**
   - Презентацію (5-7 хвилин)
   - Демо (2-3 хвилини)
   - Відповіді на питання

---

## 2. Презентація (5-7 хвилин)

### 2.1. Структура Презентації

#### Слайд 1: Титульний

```
AUTH KEY STORAGE SYSTEM
Безпечне Зберігання Паролів та API Ключів

Виконав: [Ваше Ім'я]
Група: [Ваша Група]
Викладач: [Ім'я Викладача]
```

#### Слайд 2: Проблема та Рішення

**Проблема:**
- Безпечне зберігання паролів та ключів
- Організація великої кількості облікових даних
- Необхідність обміну ключами

**Рішення:**
- Zero-Knowledge шифрування
- Організація в папки та теги
- Безпечний обмін через share links

#### Слайд 3: Технічний Стек

**Backend:**
- Java 17, Spring Boot 3.2
- PostgreSQL 15, Redis 7
- Spring Security + JWT

**Frontend:**
- React 18, TypeScript
- TailwindCSS
- CryptoJS (AES-256-GCM)

**DevOps:**
- Docker Compose

#### Слайд 4: Архітектура

[Вставити діаграму architecture.png]

- Client-Server архітектура
- 3-tier backend (Controller → Service → Repository)
- Zero-Knowledge encryption на клієнті

#### Слайд 5: SOLID Принципи

**S** - Single Responsibility
- Кожен Service відповідає за одну сутність

**O** - Open/Closed
- Strategy Pattern для розширення

**L** - Liskov Substitution
- Repository можна замінити на Mock

**I** - Interface Segregation
- Розділені інтерфейси для різних операцій

**D** - Dependency Inversion
- Контролери залежать від абстракцій

#### Слайд 6: Design Patterns (1/2)

1. **Repository Pattern** - Абстракція доступу до даних
2. **Service Pattern** - Бізнес-логіка
3. **DTO Pattern** - Передача даних
4. **Singleton Pattern** - Spring Beans
5. **Factory Pattern** - Створення об'єктів

#### Слайд 7: Design Patterns (2/2)

6. **Strategy Pattern** - Вибір алгоритму
7. **Observer Pattern** - Event-driven архітектура
8. **Template Method** - Шаблон CRUD операцій
9. **Composite Pattern** - Дерево папок
10. **Dependency Injection** - Spring IoC

#### Слайд 8: База Даних

**8 таблиць:**
- users, auth_keys, folders
- tags, auth_key_tags
- share_links, audit_logs, user_sessions

**ORM:** Spring Data JPA + Hibernate

[Вставити ER діаграму]

#### Слайд 9: Zero-Knowledge Security

**Принцип:**
- Шифрування на клієнті
- Сервер не має доступу до даних

**Алгоритми:**
- AES-256-GCM для шифрування
- PBKDF2 для деривації ключа
- BCrypt для паролів

#### Слайд 10: Основні Функції

✅ CRUD ключів  
✅ Організація в папки  
✅ Тегування  
✅ Share links (одноразові посилання)  
✅ Аудит логування  
✅ Пошук та фільтрація  

#### Слайд 11: API (Swagger)

[Вставити скріншот Swagger UI]

- 40+ endpoints
- JWT автентифікація
- Валідація запитів
- Документація OpenAPI

#### Слайд 12: Інтерфейс

[Вставити скріншоти]

- Responsive design
- Dark/Light theme
- Drag & Drop
- Toast notifications

#### Слайд 13: Docker

```yaml
services:
  - postgres (БД)
  - redis (Кеш)
  - backend (Spring Boot)
  - frontend (React + Nginx)
```

**Команда запуску:**
```bash
docker-compose up -d
```

#### Слайд 14: Результати

**Виконано:**
- ✅ Всі 5 SOLID принципів
- ✅ 10 Design Patterns
- ✅ ORM (Spring Data JPA)
- ✅ 8 таблиць БД
- ✅ Fullstack (React + Spring Boot)
- ✅ 5 UML діаграм
- ✅ Docker контейнеризація

**Оцінка:** 130/100 балів

#### Слайд 15: Дякую за Увагу

**Демонстрація:**
- http://localhost
- http://localhost:8080/swagger-ui.html

**Код:**
- GitHub: [посилання]

**Питання?**

### 2.2. Що Говорити (Скрипт)

**[Слайд 1-2] (30 сек)**
> "Доброго дня! Представляю курсову роботу "Auth Key Storage System" - систему безпечного зберігання паролів та API ключів. У сучасному світі кожна людина має десятки облікових записів, і моя система вирішує проблему їх безпечного зберігання через Zero-Knowledge шифрування."

**[Слайд 3-4] (1 хв)**
> "Технічний стек включає Java 17 та Spring Boot на backend, React 18 з TypeScript на frontend, PostgreSQL для зберігання даних та Redis для кешування. Архітектура побудована за принципом 3-tier: Controllers обробляють HTTP запити, Services містять бізнес-логіку, Repositories відповідають за доступ до даних."

**[Слайд 5] (1 хв)**
> "У проекті реалізовані всі 5 SOLID принципів. Single Responsibility - кожен клас має одну відповідальність. Open/Closed - система відкрита для розширення через Strategy Pattern. Liskov Substitution - Repository можна замінити на Mock для тестування. Interface Segregation - розділені інтерфейси. Dependency Inversion - залежність від абстракцій."

**[Слайд 6-7] (1.5 хв)**
> "Використано 10 Design Patterns: Repository для абстракції доступу до даних, Service для бізнес-логіки, DTO для передачі даних, Singleton для Spring Beans, Factory для створення об'єктів, Strategy для вибору алгоритмів, Observer для event-driven архітектури, Template Method для CRUD операцій, Composite для структури папок, та Dependency Injection через Spring IoC."

**[Слайд 8] (30 сек)**
> "База даних містить 8 таблиць з відносинами One-to-Many та Many-to-Many. Використовується Spring Data JPA як ORM з Hibernate."

**[Слайд 9] (1 хв)**
> "Ключова особливість - Zero-Knowledge шифрування. Всі дані шифруються на клієнті за допомогою AES-256-GCM перед відправкою на сервер. Сервер зберігає тільки зашифровані дані і не має доступу до незашифрованої інформації. Це забезпечує максимальну безпеку."

**[Слайд 10-12] (1 хв)**
> "Система надає повний CRUD для ключів, організацію в папки, тегування, створення одноразових посилань для обміну, аудит логування. Є Swagger документація для API та сучасний адаптивний інтерфейс."

**[Слайд 13-14] (30 сек)**
> "Проект повністю контейнеризований через Docker Compose. Всі сервіси запускаються однією командою. Виконано всі вимоги курсової роботи з додатковими балами."

**[Слайд 15] (10 сек)**
> "Дякую за увагу! Готовий до демонстрації та відповідей на питання."

---

## 3. Демонстрація Проекту

### 3.1. Сценарій Демо (2-3 хвилини)

#### Крок 1: Login (15 сек)
- Відкрити http://localhost
- Показати форму входу
- Ввести тестові дані та увійти

#### Крок 2: Dashboard (30 сек)
- Показати список ключів
- Показати sidebar з папками
- Показати пошук та фільтри

#### Крок 3: Створення Ключа (30 сек)
- Натиснути "New Key"
- Заповнити форму:
  - Name: "Demo API Key"
  - Type: API Key
  - Value: "test_key_123"
  - Folder: Work
  - Tags: demo, test
- Зберегти

#### Крок 4: Перегляд Ключа (20 сек)
- Клікнути на створений ключ
- Показати, що значення зашифроване
- Натиснути "Show" для розшифрування

#### Крок 5: Share Link (30 сек)
- Натиснути "Share"
- Налаштувати:
  - Expires: 24 hours
  - Max access: 1 time
- Створити посилання
- Скопіювати URL

#### Крок 6: Swagger UI (20 сек)
- Відкрити http://localhost:8080/swagger-ui.html
- Показати список endpoints
- Розгорнути один endpoint (напр., POST /api/keys)

#### Крок 7: Audit Log (15 сек)
- Відкрити Audit Log
- Показати записи про всі дії

### 3.2. Що Показувати в Коді

#### Backend: AuthKeyController.java

```java
@RestController
@RequestMapping("/api/keys")
public class AuthKeyController {
    
    private final AuthKeyService authKeyService;
    
    // Dependency Injection (DIP)
    public AuthKeyController(AuthKeyService authKeyService) {
        this.authKeyService = authKeyService;
    }
    
    @PostMapping
    public ResponseEntity<AuthKeyResponse> createKey(
        @Valid @RequestBody AuthKeyRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Делегування в Service (Service Pattern)
        AuthKeyResponse response = authKeyService.createKey(request, getUserId(userDetails));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

**Пояснення:**
- Controller не містить бізнес-логіки (SRP)
- Залежить від інтерфейсу Service (DIP)
- Валідація через @Valid
- JWT автентифікація через @AuthenticationPrincipal

#### Backend: AuthKeyServiceImpl.java

```java
@Service
@Transactional
public class AuthKeyServiceImpl implements AuthKeyService {
    
    private final AuthKeyRepository repository; // DIP
    private final AuditLogService auditLogService; // DIP
    private final ApplicationEventPublisher eventPublisher; // Observer Pattern
    
    @Override
    public AuthKeyResponse createKey(AuthKeyRequest request, Long userId) {
        // Validation (SRP)
        validateRequest(request, userId);
        
        // Mapping DTO to Entity (DTO Pattern)
        AuthKey key = mapper.toEntity(request);
        key.setUserId(userId);
        
        // Save (Repository Pattern)
        AuthKey saved = repository.save(key);
        
        // Event publishing (Observer Pattern)
        eventPublisher.publishEvent(new AuditLogEvent(...));
        
        // Mapping Entity to DTO (DTO Pattern)
        return mapper.toResponse(saved);
    }
}
```

**Пояснення:**
- Бізнес-логіка в Service (Service Pattern)
- Використання Repository для даних (Repository Pattern)
- Event publishing для аудиту (Observer Pattern)
- Транзакційність (@Transactional)

#### Backend: AuthKeyRepository.java

```java
@Repository
public interface AuthKeyRepository extends JpaRepository<AuthKey, Long> {
    
    // Spring Data генерує імплементацію автоматично
    List<AuthKey> findByUserId(Long userId);
    
    // Custom query (JPQL)
    @Query("SELECT k FROM AuthKey k WHERE k.user.id = :userId AND k.isFavorite = true")
    List<AuthKey> findFavorites(@Param("userId") Long userId);
}
```

**Пояснення:**
- Repository Pattern
- Spring Data JPA автоматично генерує SQL
- Query methods за naming convention

#### Frontend: encryption.js

```javascript
export class Encryption {
  
  static deriveKey(masterPassword, salt) {
    // Zero-Knowledge: ключ НЕ передається на сервер
    return CryptoJS.PBKDF2(masterPassword, salt, {
      keySize: 256 / 32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
  }
  
  static encrypt(plaintext, derivedKey) {
    // AES-256-GCM шифрування
    return CryptoJS.AES.encrypt(plaintext, derivedKey, {
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }
}
```

**Пояснення:**
- Zero-Knowledge encryption
- Ключ генерується на клієнті
- AES-256-GCM для максимальної безпеки

---

## 4. Пояснення SOLID Принципів

### 4.1. Single Responsibility (S)

**Питання:** "Розкажіть про Single Responsibility Principle."

**Відповідь:**
> "Кожен клас має одну причину для зміни. У моєму проекті кожен Service відповідає за одну сутність: `AuthKeyService` - за ключі, `FolderService` - за папки, `EmailService` - за email. Якщо потрібно змінити логіку email, я міняю тільки `EmailService`, не торкаючись інших класів."

**Приклад коду:**
```java
// ✅ Правильно
@Service
public class AuthKeyService {
    public void createKey() { }  // Тільки логіка ключів
}

@Service
public class EmailService {
    public void sendEmail() { }  // Тільки логіка email
}
```

### 4.2. Open/Closed (O)

**Питання:** "Як реалізований Open/Closed Principle?"

**Відповідь:**
> "Класи відкриті для розширення, але закриті для модифікації. Я використав Strategy Pattern для notification. Якщо потрібно додати новий тип сповіщень (напр., SMS), я створю новий клас `SmsNotification`, який реалізує `NotificationStrategy`, БЕЗ зміни існуючого коду."

**Приклад:**
```java
// Інтерфейс (відкритий для розширення)
public interface NotificationStrategy {
    void send(String message);
}

// Можна додавати нові реалізації БЕЗ зміни існуючого коду
@Component
public class EmailNotification implements NotificationStrategy { }

@Component
public class SmsNotification implements NotificationStrategy { }  // Нова реалізація
```

### 4.3. Liskov Substitution (L)

**Питання:** "Поясніть Liskov Substitution Principle."

**Відповідь:**
> "Об'єкти підкласів можуть замінювати базові класи без порушення функціональності. У моєму проекті всі Repository реалізують `JpaRepository`. Я можу замінити `AuthKeyRepository` на `Mock` в тестах, і код працюватиме коректно."

**Приклад:**
```java
// Production code
@Service
public class AuthKeyService {
    private final AuthKeyRepository repository;  // Реальна реалізація
}

// Test code
class AuthKeyServiceTest {
    @Mock
    private AuthKeyRepository repository;  // Mock реалізація
    
    // Працює ідентично!
}
```

### 4.4. Interface Segregation (I)

**Питання:** "Як застосований Interface Segregation?"

**Відповідь:**
> "Інтерфейси розділені на специфічні. Замість одного великого `KeyManagementService`, я створив окремі: `AuthKeyService` для CRUD, `ShareLinkService` для share links, `KeyExportService` для експорту. Контролер використовує тільки те, що йому потрібно."

### 4.5. Dependency Inversion (D)

**Питання:** "Розкажіть про Dependency Inversion."

**Відповідь:**
> "Модулі залежать від абстракцій, не від конкретних реалізацій. `AuthKeyController` залежить від інтерфейсу `AuthKeyService`, а не від `AuthKeyServiceImpl`. Spring інжектить потрібну реалізацію через Dependency Injection."

---

## 5. Пояснення Design Patterns

### 5.1. Repository Pattern

**Питання:** "Що таке Repository Pattern і навіщо він потрібен?"

**Відповідь:**
> "Repository Pattern абстрагує логіку доступу до даних. Замість прямих SQL запитів у Service, я використовую Repository методи. Це дозволяє змінити БД (напр., PostgreSQL → MongoDB) без зміни бізнес-логіки."

### 5.2. Service Pattern

**Питання:** "Навіщо потрібен Service Layer?"

**Відповідь:**
> "Service Layer містить бізнес-логіку і відокремлює її від Controllers. Controller тільки обробляє HTTP запити та валідацію, а Service виконує бізнес-операції. Це дозволяє використовувати ту саму логіку з різних місць."

### 5.3. DTO Pattern

**Питання:** "Чому використовуєте DTO?"

**Відповідь:**
> "DTO (Data Transfer Object) передає дані між шарами без розкриття внутрішньої структури Entity. Наприклад, `AuthKeyResponse` не містить `passwordHash` з Entity `User`. Також DTO дозволяє мати різні представлення даних для різних endpoints."

### 5.4. Observer Pattern

**Питання:** "Де використаний Observer Pattern?"

**Відповідь:**
> "Для аудит логування через Spring Events. Коли створюється ключ, Service публікує `AuditLogEvent`. `AuditLogListener` перехоплює подію і асинхронно записує в БД. Це loosely coupled підхід - Service не знає про деталі логування."

### 5.5. Singleton Pattern

**Питання:** "Де Singleton?"

**Відповідь:**
> "Всі Spring Beans - Singletons за замовчуванням. Наприклад, `PasswordEncoder` створюється один раз в `@Configuration` класі і використовується скрізь."

---

## 6. Можливі Питання та Відповіді

### 6.1. Загальні Питання

**Q: Чому обрали Java та Spring Boot?**

A: Java - це industry standard для enterprise додатків. Spring Boot надає потужний ecosystem: Security для автентифікації, Data JPA для ORM, легка інтеграція з різними БД та сервісами.

**Q: Чому PostgreSQL, а не MySQL?**

A: PostgreSQL підтримує складні типи даних (JSONB), повний ACID compliance, краще для concurrent writes, має потужніший query optimizer.

**Q: Що таке Zero-Knowledge шифрування?**

A: Це підхід, коли дані шифруються на клієнті перед відправкою на сервер. Сервер зберігає тільки зашифровані дані і не має доступу до ключа розшифрування. Навіть при зломі сервера, дані залишаються захищеними.

**Q: Навіщо Redis?**

A: Redis використовується для кешування сесій користувачів та share links. Це зменшує навантаження на PostgreSQL та прискорює відгук системи.

**Q: Чому Docker?**

A: Docker забезпечує ізоляцію середовищ, легке розгортання, портабельність. Один `docker-compose up` запускає всю систему на будь-якій машині.

### 6.2. Технічні Питання

**Q: Як забезпечується безпека API?**

A:
1. JWT токени для автентифікації
2. Spring Security для авторизації
3. HTTPS для шифрування трафіку
4. CORS для обмеження domains
5. Rate Limiting для захисту від brute force
6. BCrypt для хешування паролів

**Q: Що станеться, якщо користувач забуде Master Password?**

A: Дані неможливо відновити. Це недолік Zero-Knowledge підходу, але це ціна за максимальну безпеку. Користувача попереджено при реєстрації.

**Q: Як оптимізована робота з БД?**

A:
1. Індекси на часто використовувані поля
2. Lazy loading для зв'язків
3. Connection pooling (HikariCP)
4. Кешування в Redis
5. Пагінація для великих списків

**Q: Чому не використали NoSQL?**

A: Моя система потребує складних зв'язків (users → keys → folders → tags) та транзакцій (ACID). Реляційна БД краще підходить для цього.

**Q: Як тестується проект?**

A:
- Unit tests (JUnit, Mockito)
- Integration tests (Spring Boot Test)
- Testcontainers для БД
- Frontend: Vitest, React Testing Library

### 6.3. Питання про Код

**Q: Покажіть, де використаний Composite Pattern.**

A: [Відкрити `Folder.java`]
```java
@Entity
public class Folder implements FolderComponent {
    @ManyToOne
    private Folder parent;
    
    @OneToMany(mappedBy = "parent")
    private List<Folder> children;  // Composite
    
    public int getTotalKeysCount() {
        int count = keys.size();
        for (Folder child : children) {
            count += child.getTotalKeysCount();  // Recursive
        }
        return count;
    }
}
```

**Q: Де Template Method Pattern?**

A: [Показати абстрактний `BaseCrudService`] - визначає скелет CRUD операцій, підкласи реалізують специфічні кроки.

**Q: Як працює JWT автентифікація?**

A: [Відкрити `JwtAuthenticationFilter`]
1. Клієнт надсилає токен в header `Authorization: Bearer <token>`
2. Filter витягує токен
3. `JwtTokenProvider` валідує підпис
4. Витягує username з токену
5. Завантажує `UserDetails` з БД
6. Встановлює `Authentication` в `SecurityContext`

---

## 7. Чек-лист Перед Захистом

### За 1 День

- [ ] Docker контейнери запущені та працюють
- [ ] Створено тестові дані (користувач, ключі, папки)
- [ ] Презентація готова (15 слайдів)
- [ ] Діаграми експортовані в PNG
- [ ] Swagger доступний
- [ ] README.md актуальний

### За 1 Годину

- [ ] Ноутбук заряджений
- [ ] Docker запущений
- [ ] Frontend відкритий у браузері
- [ ] Swagger відкритий в іншій вкладці
- [ ] IDE відкрите з ключовими файлами
- [ ] Презентація відкрита

### Перед Виходом

- [ ] Презентація на першому слайді
- [ ] Проектор/екран підключений
- [ ] Звук (якщо є відео)
- [ ] Запасна копія презентації (USB, Google Drive)
- [ ] Впевненість та посмішка 😊

---

## 8. Фінальні Поради

### 8.1. Під Час Презентації

✅ **DO:**
- Говоріть впевнено та чітко
- Дивіться на комісію, не на екран
- Використовуйте технічні терміни правильно
- Покажіть ентузіазм до проекту
- Посміхайтеся

❌ **DON'T:**
- Не читайте текст зі слайдів
- Не говоріть занадто швидко
- Не вибачайтеся за "недороблене"
- Не зациклюйтеся на одному питанні

### 8.2. Під Час Відповідей

✅ **DO:**
- Слухайте питання уважно
- Якщо не зрозуміли - попросіть повторити
- Відповідайте структуровано
- Якщо не знаєте - скажіть чесно
- Пов'яжіть відповідь з вашим проектом

❌ **DON'T:**
- Не перебивайте викладача
- Не вигадуйте, якщо не знаєте
- Не йдіть в занадто глибокі деталі

### 8.3. Якщо Щось Пішло Не Так

**Проблема:** Docker не запускається
- **Рішення:** Мати готові скріншоти всього функціоналу

**Проблема:** Забули якийсь патерн
- **Рішення:** Відкрити `design-patterns.puml` - там все перелічено

**Проблема:** Складне питання
- **Рішення:** "Це цікаве питання. В моєму проекті... [зв'язати з тим, що знаєте]"

---

## 9. Мотиваційний Розділ

### Ви Готові! 🎯

Ви створили:
- ✅ Fullstack додаток
- ✅ Використали всі SOLID принципи
- ✅ Реалізували 10 Design Patterns
- ✅ Створили 5 UML діаграм
- ✅ Написали документацію
- ✅ Контейнеризували через Docker

**Це більше, ніж потрібно для відмінної оцінки!**

### Пам'ятайте:

1. **Ви знаєте свій проект краще за всіх**
2. **Ви витратили багато часу на розробку**
3. **Викладачі хочуть, щоб ви здали**
4. **Невдалих відповідей не існує - є можливість пояснити по-іншому**

### Ваша Мета:

🎯 Показати, що ви розумієте:
- Об'єктно-орієнтоване програмування
- SOLID принципи
- Design Patterns
- Fullstack розробку

**І ви це вже зробили через свій проект!**

---

## Удачі на Захисті! 🍀

**Remember:**
- Breathe
- Smile
- Be confident
- You've got this!

---

**Підготував:** [Ваше Ім'я]  
**Дата:** 2024

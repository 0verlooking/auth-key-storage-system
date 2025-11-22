# PlantUML Діаграми - Auth Key Storage System

Цей каталог містить всі UML діаграми проекту у форматі PlantUML.

## 📋 Список Діаграм

### 1. **sequence-share-link.puml**
Sequence діаграма процесу створення та доступу до Share Link.
- Створення share link користувачем
- Доступ до share link отримувачем
- Видалення share link
- Інтеграція з Redis cache
- Zero-Knowledge шифрування

### 2. **wireframes.puml**
Wireframes всіх основних сторінок інтерфейсу (PlantUML Salt).
- Login page
- Register page
- Dashboard (список ключів)
- Create/Edit key dialog
- Sidebar з папками
- Profile page
- Share link dialog
- Key details modal
- Tags management
- Audit log page

### 3. **architecture.puml**
C4 Container діаграма архітектури системи.
- Frontend (React)
- Backend (Spring Boot)
- Database (PostgreSQL)
- Cache (Redis)
- Зовнішні сервіси

### 4. **architecture-detailed.puml**
Детальна компонентна діаграма з Docker containers.
- Структура всіх Docker контейнерів
- Внутрішні компоненти кожного контейнера
- Мережа та volumes
- Ports mapping
- Технології та конфігурації

### 5. **design-patterns.puml**
Візуалізація всіх Design Patterns, використаних у проекті.
- Repository Pattern
- Service Pattern (Layer Pattern)
- DTO Pattern
- Singleton Pattern
- Factory Pattern
- Strategy Pattern
- Observer Pattern (Event Driven)
- Template Method Pattern
- Composite Pattern
- Dependency Injection Pattern
- Mapping до SOLID принципів

## 🚀 Як Рендерити Діаграми

### Метод 1: Онлайн PlantUML Editor (Найпростіший)

1. Відкрийте [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
2. Скопіюйте вміст файлу `.puml`
3. Вставте в редактор
4. Діаграма автоматично згенерується
5. Збережіть як PNG/SVG через меню

### Метод 2: VS Code Extension (Рекомендований для розробки)

1. Встановіть розширення:
   ```bash
   code --install-extension jebbs.plantuml
   ```

2. Встановіть Java (якщо ще не встановлена):
   ```bash
   # Ubuntu/Debian
   sudo apt install openjdk-17-jre
   
   # macOS
   brew install openjdk@17
   ```

3. Встановіть Graphviz (для складних діаграм):
   ```bash
   # Ubuntu/Debian
   sudo apt install graphviz
   
   # macOS
   brew install graphviz
   
   # Windows
   choco install graphviz
   ```

4. Відкрийте файл `.puml` у VS Code
5. Натисніть `Alt + D` для preview
6. Клікніть правою кнопкою → "Export Current Diagram" для збереження

### Метод 3: Command Line (Для автоматизації)

1. Завантажте PlantUML JAR:
   ```bash
   wget https://github.com/plantuml/plantuml/releases/download/v1.2024.0/plantuml-1.2024.0.jar
   ```

2. Згенерувати PNG діаграму:
   ```bash
   java -jar plantuml.jar sequence-share-link.puml
   ```

3. Згенерувати SVG діаграму:
   ```bash
   java -jar plantuml.jar -tsvg sequence-share-link.puml
   ```

4. Згенерувати всі діаграми в каталозі:
   ```bash
   java -jar plantuml.jar *.puml
   ```

### Метод 4: Docker (Якщо не хочете встановлювати Java)

```bash
# Згенерувати PNG
docker run --rm -v $(pwd):/data plantuml/plantuml:latest -tpng /data/*.puml

# Згенерувати SVG
docker run --rm -v $(pwd):/data plantuml/plantuml:latest -tsvg /data/*.puml
```

### Метод 5: IntelliJ IDEA Plugin

1. Відкрийте Settings → Plugins
2. Шукайте "PlantUML integration"
3. Встановіть plugin
4. Відкрийте файл `.puml`
5. Інструменти рендерингу з'являться справа

## 📦 Експорт Форматів

PlantUML підтримує різні формати експорту:

- **PNG** - Растрова графіка (для документів)
  ```bash
  java -jar plantuml.jar -tpng diagram.puml
  ```

- **SVG** - Векторна графіка (для веб)
  ```bash
  java -jar plantuml.jar -tsvg diagram.puml
  ```

- **PDF** - Для друку
  ```bash
  java -jar plantuml.jar -tpdf diagram.puml
  ```

- **LaTeX** - Для академічних робіт
  ```bash
  java -jar plantuml.jar -tlatex diagram.puml
  ```

## 🎨 Теми та Стилізація

Всі діаграми використовують тему `blueprint`:
```plantuml
!theme blueprint
```

Доступні інші теми:
- `plain` - Стандартна тема
- `blueprint` - Синя схема (використовується)
- `sketchy` - Ескізний стиль
- `mars` - Червона тема
- `vibrant` - Яскрава тема

Змінити тему можна у першому рядку файлу.

## 📚 Корисні Посилання

- [PlantUML Official Site](https://plantuml.com/)
- [PlantUML Language Reference](https://plantuml.com/en/guide)
- [PlantUML Sequence Diagram](https://plantuml.com/en/sequence-diagram)
- [PlantUML Salt (Wireframes)](https://plantuml.com/en/salt)
- [PlantUML Component Diagram](https://plantuml.com/en/component-diagram)
- [PlantUML Class Diagram](https://plantuml.com/en/class-diagram)
- [C4 Model for PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)

## 🔄 Оновлення Діаграм

При зміні коду проекту, не забувайте оновлювати відповідні діаграми:

1. **Додано новий контролер** → оновити `architecture-detailed.puml`
2. **Змінено бізнес-процес** → оновити `sequence-*.puml`
3. **Додано UI компонент** → оновити `wireframes.puml`
4. **Впроваджено новий патерн** → оновити `design-patterns.puml`

## 💡 Поради

1. **Для курсової роботи**: Експортуйте діаграми у PNG з високою роздільністю:
   ```bash
   java -jar plantuml.jar -tpng -DPLANTUML_LIMIT_SIZE=8192 *.puml
   ```

2. **Для презентації**: Використовуйте SVG для збереження якості при масштабуванні.

3. **Для документів Word/PDF**: PNG з роздільністю 300 DPI підходить найкраще.

4. **Включення в Markdown**: 
   ```markdown
   ![Architecture](./diagrams/architecture.png)
   ```

## ⚙️ Makefile для Автоматизації

Створіть `Makefile` в цьому каталозі:

```makefile
PLANTUML_JAR = plantuml.jar

all: png

png:
	java -jar $(PLANTUML_JAR) -tpng *.puml

svg:
	java -jar $(PLANTUML_JAR) -tsvg *.puml

pdf:
	java -jar $(PLANTUML_JAR) -tpdf *.puml

clean:
	rm -f *.png *.svg *.pdf

.PHONY: all png svg pdf clean
```

Використання:
```bash
make png    # Генерувати PNG
make svg    # Генерувати SVG
make clean  # Видалити згенеровані файли
```

## 📊 Статистика Діаграм

- **Sequence діаграми**: 1
- **Wireframes**: 10 сторінок
- **Architecture діаграми**: 2
- **Design Patterns діаграми**: 10 патернів

**Загальна кількість діаграм**: 5 файлів

---

**Створено для**: Курсової роботи "Auth Key Storage System"  
**Формат**: PlantUML (.puml)  
**Версія**: 1.0  
**Дата**: 2024

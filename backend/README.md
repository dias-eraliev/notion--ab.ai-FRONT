# Инструкция по разработке бэкенд-части системы

## Общие требования

1. Язык программирования: Python 3.11+
2. Фреймворк: FastAPI
3. База данных: PostgreSQL 15+
4. Кэширование: Redis
5. Очереди: RabbitMQ
6. WebSocket: FastAPI WebSockets

## Структура API

### 1. Аутентификация и авторизация

- JWT-токены для аутентификации
- Role-based access control (RBAC)
- Поддержка OAuth 2.0
- Интеграция с Active Directory

### 2. Основные модули

#### 2.1 Управление расписанием (`/api/v1/schedule`)

```python
# Модели
class ScheduleEntry(BaseModel):
    id: str
    subject: Subject
    group: Group
    teacher: Teacher
    room: Room
    startTime: str  # HH:mm
    endTime: str    # HH:mm
    dayOfWeek: int  # 1-7
    type: Literal['lecture', 'practice', 'lab']
    startDate: date
    endDate: date
    recurrence: Optional[RecurrenceRule]

# Эндпоинты
GET /api/v1/schedule - получение расписания
POST /api/v1/schedule - создание занятия
PUT /api/v1/schedule/{id} - обновление занятия
DELETE /api/v1/schedule/{id} - удаление занятия
GET /api/v1/schedule/conflicts - проверка конфликтов
GET /api/v1/schedule/available-slots - поиск свободных слотов
```

#### 2.2 Управление нагрузкой (`/api/v1/workload`)

```python
# Модели
class TeacherWorkload(BaseModel):
    id: int
    teacher_id: int
    standardHours: float
    actualHours: float
    monthlyHours: List[MonthlyWorkload]
    quarterlyHours: List[QuarterlyWorkload]
    dailyHours: List[DailyWorkload]
    subjects: List[Subject]
    additionalActivities: List[Activity]

# Эндпоинты
GET /api/v1/workload/teachers - получение нагрузки преподавателей
GET /api/v1/workload/teachers/{id} - детали нагрузки преподавателя
PUT /api/v1/workload/teachers/{id} - обновление нагрузки
POST /api/v1/workload/daily - добавление ежедневной нагрузки
```

#### 2.3 Управление чатом (`/api/v1/chat`)

```python
# Модели
class Message(BaseModel):
    id: str
    conversationId: str
    senderId: str
    content: str
    type: Literal['text', 'file', 'image']
    attachments: Optional[List[Attachment]]
    status: Literal['sent', 'delivered', 'read']
    createdAt: datetime
    updatedAt: datetime

# Эндпоинты
GET /api/v1/chat/conversations - список чатов
GET /api/v1/chat/messages/{conversationId} - сообщения чата
POST /api/v1/chat/messages - отправка сообщения
PUT /api/v1/chat/messages/{id} - редактирование сообщения
DELETE /api/v1/chat/messages/{id} - удаление сообщения
```

### 3. WebSocket события

```python
# Подключение
ws://api/v1/ws/connect

# События
schedule:update - обновление расписания
workload:update - обновление нагрузки
chat:message - новое сообщение в чате
notification:new - новое уведомление
```

## Требования к безопасности

1. Все эндпоинты должны быть защищены JWT-токенами
2. Проверка прав доступа на уровне ролей
3. Валидация всех входных данных
4. Rate limiting для API запросов
5. Логирование всех действий
6. Шифрование чувствительных данных

## Кэширование

1. Кэширование расписания: 5 минут
2. Кэширование нагрузки: 10 минут
3. Кэширование списков: 1 час
4. Кэширование статических данных: 24 часа

## Очереди сообщений

1. Отправка уведомлений
2. Обработка файлов
3. Генерация отчетов
4. Синхронизация данных

## Мониторинг

1. Prometheus для метрик
2. Grafana для визуализации
3. Sentry для отслеживания ошибок
4. ELK Stack для логов

## Тестирование

1. Unit тесты: pytest
2. Интеграционные тесты: pytest-asyncio
3. Нагрузочное тестирование: locust
4. Покрытие кода: >80%

## CI/CD

1. GitHub Actions для CI
2. Docker для контейнеризации
3. Kubernetes для оркестрации
4. ArgoCD для CD

## Документация

1. OpenAPI (Swagger) для API
2. Sphinx для кодовой базы
3. PlantUML для диаграмм
4. Confluence для проектной документации 
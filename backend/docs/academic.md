# Модуль учебного процесса

## API Endpoints

### 1. Учебные планы

#### 1.1 Получение списка учебных планов
```typescript
GET /api/v1/study-plans
Query Parameters:
{
  year?: number;
  speciality?: string;
  status?: "draft" | "active" | "archived";
  page?: number;
  limit?: number;
}

Response:
{
  items: Array<{
    id: number;
    name: string;
    speciality: string;
    year: number;
    status: "draft" | "active" | "archived";
    subjects_count: number;
    total_credits: number;
    created_at: string;
    updated_at: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### 1.2 Создание учебного плана
```typescript
POST /api/v1/study-plans
Request:
{
  name: string;
  speciality: string;
  year: number;
  description?: string;
  subjects: Array<{
    subject_id: number;
    semester: number;
    credits: number;
    hours: number;
    is_required: boolean;
  }>;
}

Response:
{
  id: number;
  name: string;
  speciality: string;
  year: number;
  status: "draft";
  created_at: string;
}
```

### 2. Академический журнал

#### 2.1 Получение оценок группы
```typescript
GET /api/v1/academic-journal/groups/{group_id}
Query Parameters:
{
  subject_id?: number;
  start_date?: string;
  end_date?: string;
}

Response:
{
  group: {
    id: number;
    name: string;
    students_count: number;
  };
  subjects: Array<{
    id: number;
    name: string;
    teacher: {
      id: number;
      name: string;
    };
    grades: Array<{
      student_id: number;
      grades: Array<{
        id: number;
        value: number;
        type: "homework" | "test" | "exam";
        date: string;
        comment?: string;
      }>;
      average: number;
    }>;
  }>;
}
```

#### 2.2 Выставление оценки
```typescript
POST /api/v1/academic-journal/grades
Request:
{
  student_id: number;
  subject_id: number;
  value: number;
  type: "homework" | "test" | "exam";
  date: string;
  comment?: string;
}

Response:
{
  id: number;
  student_id: number;
  subject_id: number;
  value: number;
  type: string;
  date: string;
  created_at: string;
}
```

### 3. Домашние задания

#### 3.1 Создание домашнего задания
```typescript
POST /api/v1/homework
Request:
{
  subject_id: number;
  group_id: number;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

Response:
{
  id: number;
  title: string;
  due_date: string;
  created_at: string;
}
```

#### 3.2 Сдача домашнего задания
```typescript
POST /api/v1/homework/{homework_id}/submissions
Request:
{
  content: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

Response:
{
  id: number;
  status: "submitted";
  submitted_at: string;
}
```

## Модели данных

```typescript
interface StudyPlan {
  id: number;
  name: string;
  speciality: string;
  year: number;
  description?: string;
  status: "draft" | "active" | "archived";
  subjects: StudyPlanSubject[];
  created_at: Date;
  updated_at: Date;
}

interface StudyPlanSubject {
  id: number;
  plan_id: number;
  subject_id: number;
  semester: number;
  credits: number;
  hours: number;
  is_required: boolean;
}

interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  value: number;
  type: "homework" | "test" | "exam";
  date: Date;
  comment?: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

interface Homework {
  id: number;
  subject_id: number;
  group_id: number;
  title: string;
  description: string;
  due_date: Date;
  max_score: number;
  attachments: Attachment[];
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

interface HomeworkSubmission {
  id: number;
  homework_id: number;
  student_id: number;
  content: string;
  attachments: Attachment[];
  status: "draft" | "submitted" | "graded";
  score?: number;
  feedback?: string;
  submitted_at: Date;
  graded_at?: Date;
}
```

## Интеграции

1. Система хранения файлов
```typescript
interface StorageConfig {
  provider: "local" | "s3" | "gcs";
  bucket: string;
  prefix: string;
  public_url: string;
}
```

2. Система уведомлений
- Email уведомления
- Push-уведомления
- Telegram бот

3. Экспорт данных
- Excel
- PDF
- CSV

## Требования к безопасности

1. Права доступа:
- Учителя: только свои предметы и группы
- Студенты: только свои оценки и задания
- Администраторы: полный доступ

2. Валидация данных:
- Проверка дат
- Проверка оценок (0-100)
- Проверка размера файлов
- Проверка типов файлов

3. Аудит:
- Логирование всех изменений оценок
- История изменений учебных планов
- Отслеживание сдачи заданий

## Стратегия кэширования

1. Учебные планы:
- Активные планы: 1 час
- Архивные планы: 24 часа

2. Оценки:
- Текущие оценки: 5 минут
- Итоговые оценки: 1 час

3. Домашние задания:
- Активные задания: 5 минут
- Завершенные задания: 1 час

4. Статистика:
- Средние баллы: 15 минут
- Рейтинги: 30 минут

## Дополнительные требования

1. Производительность:
- Пакетная загрузка оценок
- Асинхронная обработка файлов
- Оптимизация запросов

2. Отчетность:
- Успеваемость по группам
- Статистика по предметам
- Рейтинг студентов
- Активность преподавателей

3. Автоматизация:
- Расчет средних баллов
- Определение статуса студента
- Уведомления о дедлайнах
- Напоминания о проверке работ

4. Интеграция с расписанием:
- Синхронизация занятий
- Автоматическое создание заданий
- Контроль посещаемости

5. Аналитика:
- Тренды успеваемости
- Сложность предметов
- Прогнозирование результатов
- Выявление проблемных областей 
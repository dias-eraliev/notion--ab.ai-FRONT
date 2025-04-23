# HR Модуль

## API Endpoints

### 1. Сотрудники

#### 1.1 Получение списка сотрудников
```typescript
GET /api/v1/hr/employees
Query Parameters:
{
  department?: string;
  position?: string;
  status?: "active" | "vacation" | "sick_leave" | "fired";
  search?: string;
  page?: number;
  limit?: number;
}

Response:
{
  items: Array<{
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    department: string;
    position: string;
    status: string;
    hire_date: string;
    email: string;
    phone?: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### 1.2 Создание сотрудника
```typescript
POST /api/v1/hr/employees
Request:
{
  first_name: string;
  last_name: string;
  middle_name?: string;
  department: string;
  position: string;
  hire_date: string;
  email: string;
  phone?: string;
  salary: {
    amount: number;
    currency: string;
    type: "fixed" | "hourly";
  };
  documents: Array<{
    type: string;
    number: string;
    issue_date: string;
    expiry_date?: string;
  }>;
}

Response:
{
  id: number;
  email: string;
  created_at: string;
}
```

### 2. Нагрузка

#### 2.1 Получение нагрузки преподавателя
```typescript
GET /api/v1/hr/workload/teachers/{teacher_id}
Query Parameters:
{
  year?: number;
  month?: number;
  type?: "actual" | "planned";
}

Response:
{
  teacher: {
    id: number;
    name: string;
    department: string;
  };
  workload: {
    standard_hours: number;
    actual_hours: number;
    monthly: Array<{
      month: number;
      standard_hours: number;
      actual_hours: number;
    }>;
    subjects: Array<{
      id: number;
      name: string;
      hours: number;
      groups: string[];
    }>;
  };
}
```

#### 2.2 Обновление нагрузки
```typescript
PUT /api/v1/hr/workload/teachers/{teacher_id}
Request:
{
  year: number;
  standard_hours: number;
  monthly: Array<{
    month: number;
    standard_hours: number;
  }>;
}

Response:
{
  id: number;
  updated_at: string;
}
```

### 3. Отпуска и больничные

#### 3.1 Создание заявки на отпуск
```typescript
POST /api/v1/hr/vacations
Request:
{
  employee_id: number;
  start_date: string;
  end_date: string;
  type: "regular" | "sick_leave" | "unpaid";
  reason?: string;
  documents?: Array<{
    type: string;
    url: string;
  }>;
}

Response:
{
  id: number;
  status: "pending";
  created_at: string;
}
```

#### 3.2 Одобрение/отклонение заявки
```typescript
PUT /api/v1/hr/vacations/{id}/status
Request:
{
  status: "approved" | "rejected";
  comment?: string;
}

Response:
{
  id: number;
  status: string;
  updated_at: string;
}
```

## Модели данных

```typescript
interface Employee {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  hire_date: Date;
  fire_date?: Date;
  email: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

enum EmployeeStatus {
  ACTIVE = "active",
  VACATION = "vacation",
  SICK_LEAVE = "sick_leave",
  FIRED = "fired"
}

interface TeacherWorkload {
  id: number;
  teacher_id: number;
  academic_year: number;
  standard_hours: number;
  actual_hours: number;
  monthly_workload: MonthlyWorkload[];
  subjects: WorkloadSubject[];
  created_at: Date;
  updated_at: Date;
}

interface MonthlyWorkload {
  id: number;
  workload_id: number;
  month: number;
  standard_hours: number;
  actual_hours: number;
}

interface WorkloadSubject {
  id: number;
  workload_id: number;
  subject_id: number;
  hours: number;
  groups: string[];
}

interface Vacation {
  id: number;
  employee_id: number;
  start_date: Date;
  end_date: Date;
  type: VacationType;
  status: VacationStatus;
  reason?: string;
  documents: Document[];
  approved_by?: number;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

enum VacationType {
  REGULAR = "regular",
  SICK_LEAVE = "sick_leave",
  UNPAID = "unpaid"
}

enum VacationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled"
}
```

## Интеграции

1. Система учета рабочего времени
```typescript
interface TimeTrackingConfig {
  provider: "internal" | "external";
  api_url?: string;
  api_key?: string;
}
```

2. Бухгалтерская система
- 1C
- SAP
- Custom API

3. Система документооборота
- SharePoint
- Custom DMS

## Требования к безопасности

1. Права доступа:
- HR специалисты: полный доступ
- Руководители: доступ к своему отделу
- Сотрудники: только свои данные

2. Защита данных:
- Шифрование персональных данных
- Маскирование чувствительной информации
- Контроль доступа к документам

3. Аудит:
- Логирование всех изменений
- История доступа к данным
- Отслеживание подозрительной активности

## Стратегия кэширования

1. Справочники:
- Должности: 24 часа
- Отделы: 24 часа
- Типы документов: 24 часа

2. Данные сотрудников:
- Основная информация: 15 минут
- Статусы: 5 минут
- Документы: 1 час

3. Нагрузка:
- Текущая нагрузка: 5 минут
- Историческая нагрузка: 1 час
- Статистика: 30 минут

## Дополнительные требования

1. Отчетность:
- Штатное расписание
- Статистика по отпускам
- Анализ нагрузки
- KPI сотрудников

2. Автоматизация:
- Расчет отпускных дней
- Уведомления о событиях
- Генерация документов
- Синхронизация с календарем

3. Интеграция с расписанием:
- Учет отсутствующих сотрудников
- Автоматическая замена преподавателей
- Корректировка нагрузки

4. Аналитика:
- Текучесть кадров
- Эффективность сотрудников
- Прогнозирование потребности в персонале
- Анализ использования отпусков

5. Документооборот:
- Шаблоны документов
- Электронное подписание
- Архивирование
- Поиск по документам 
# Финансовый модуль

## API Endpoints

### 1. Платежи

#### 1.1 Получение списка платежей
```typescript
GET /api/v1/finance/payments
Query Parameters:
{
  type?: "income" | "expense";
  status?: "pending" | "completed" | "failed" | "cancelled";
  start_date?: string;
  end_date?: string;
  category?: string;
  page?: number;
  limit?: number;
}

Response:
{
  items: Array<{
    id: number;
    type: "income" | "expense";
    amount: number;
    currency: string;
    category: string;
    description: string;
    status: string;
    payment_date: string;
    created_at: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### 1.2 Создание платежа
```typescript
POST /api/v1/finance/payments
Request:
{
  type: "income" | "expense";
  amount: number;
  currency: string;
  category: string;
  description: string;
  payment_date: string;
  recipient?: {
    name: string;
    bank_account: string;
    bank_name: string;
  };
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

Response:
{
  id: number;
  status: "pending";
  created_at: string;
}
```

### 2. Зарплата

#### 2.1 Расчет зарплаты
```typescript
POST /api/v1/finance/payroll/calculate
Request:
{
  period: {
    year: number;
    month: number;
  };
  department?: string;
  employee_id?: number;
}

Response:
{
  items: Array<{
    employee_id: number;
    name: string;
    base_salary: number;
    bonuses: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    deductions: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
    total: number;
  }>;
  total_amount: number;
}
```

#### 2.2 Подтверждение выплаты
```typescript
POST /api/v1/finance/payroll/approve
Request:
{
  period: {
    year: number;
    month: number;
  };
  items: Array<{
    employee_id: number;
    amount: number;
  }>;
  payment_date: string;
}

Response:
{
  id: number;
  status: "approved";
  payment_date: string;
}
```

### 3. Бюджет

#### 3.1 Получение бюджета
```typescript
GET /api/v1/finance/budget
Query Parameters:
{
  year: number;
  month?: number;
  category?: string;
}

Response:
{
  income: {
    planned: number;
    actual: number;
    categories: Array<{
      name: string;
      planned: number;
      actual: number;
    }>;
  };
  expenses: {
    planned: number;
    actual: number;
    categories: Array<{
      name: string;
      planned: number;
      actual: number;
    }>;
  };
  balance: {
    planned: number;
    actual: number;
  };
}
```

#### 3.2 Планирование бюджета
```typescript
POST /api/v1/finance/budget/plan
Request:
{
  year: number;
  month?: number;
  items: Array<{
    category: string;
    type: "income" | "expense";
    amount: number;
    description?: string;
  }>;
}

Response:
{
  id: number;
  status: "draft";
  created_at: string;
}
```

## Модели данных

```typescript
interface Payment {
  id: number;
  type: PaymentType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  status: PaymentStatus;
  payment_date: Date;
  recipient?: PaymentRecipient;
  attachments: Attachment[];
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

enum PaymentType {
  INCOME = "income",
  EXPENSE = "expense"
}

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}

interface PaymentRecipient {
  name: string;
  bank_account: string;
  bank_name: string;
  swift?: string;
  tax_number?: string;
}

interface Payroll {
  id: number;
  period: {
    year: number;
    month: number;
  };
  employee_id: number;
  base_salary: number;
  bonuses: PayrollItem[];
  deductions: PayrollItem[];
  total: number;
  status: PayrollStatus;
  payment_date?: Date;
  created_at: Date;
  updated_at: Date;
}

interface PayrollItem {
  type: string;
  amount: number;
  description: string;
}

enum PayrollStatus {
  DRAFT = "draft",
  CALCULATED = "calculated",
  APPROVED = "approved",
  PAID = "paid"
}

interface Budget {
  id: number;
  year: number;
  month?: number;
  category: string;
  type: "income" | "expense";
  planned_amount: number;
  actual_amount: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Интеграции

1. Банковские системы
```typescript
interface BankIntegration {
  provider: "sberbank" | "tinkoff" | "custom";
  api_url: string;
  api_key: string;
  webhook_url?: string;
}
```

2. Бухгалтерские системы
- 1C
- SAP
- QuickBooks

3. Платежные системы
- Stripe
- PayPal
- Custom Payment Gateway

## Требования к безопасности

1. Права доступа:
- Финансовый директор: полный доступ
- Бухгалтеры: доступ к операциям
- Менеджеры: просмотр бюджета
- Сотрудники: только свои зарплаты

2. Защита данных:
- Шифрование банковских данных
- Маскирование номеров счетов
- Двухфакторная аутентификация для операций

3. Аудит:
- Логирование всех финансовых операций
- История изменений бюджета
- Отслеживание подозрительных транзакций

## Стратегия кэширования

1. Справочники:
- Категории: 24 часа
- Валюты: 24 часа
- Банки: 24 часа

2. Транзакции:
- Последние операции: 5 минут
- История операций: 1 час
- Статистика: 15 минут

3. Бюджет:
- Текущий период: 5 минут
- Прошлые периоды: 1 час
- Аналитика: 30 минут

## Дополнительные требования

1. Отчетность:
- Финансовые отчеты
- Налоговая отчетность
- Аналитические отчеты
- Сверка расчетов

2. Автоматизация:
- Регулярные платежи
- Расчет зарплаты
- Начисление бонусов
- Генерация документов

3. Интеграция с HR:
- Синхронизация данных сотрудников
- Учет отпусков и больничных
- Расчет компенсаций
- Учет рабочего времени

4. Аналитика:
- Финансовые показатели
- Прогнозирование бюджета
- Анализ расходов
- Оценка эффективности

5. Антифрод:
- Проверка контрагентов
- Мониторинг операций
- Оценка рисков
- Блокировка подозрительных транзакций 
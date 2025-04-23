# Страница списка сотрудников

## Компоненты

### 1. Фильтры
```typescript
interface EmployeeFilters {
  department?: string;
  position?: string;
  status?: EmployeeStatus;
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface FilterProps {
  filters: EmployeeFilters;
  onFilterChange: (filters: EmployeeFilters) => void;
  departments: string[];
  positions: string[];
  statuses: EmployeeStatus[];
}
```

### 2. Таблица сотрудников
```typescript
interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onSort: (field: keyof Employee) => void;
  sortField?: keyof Employee;
  sortOrder: 'asc' | 'desc';
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onStatusChange: (employee: Employee, status: EmployeeStatus) => void;
}

interface EmployeeTableState {
  selectedRows: number[];
  expandedRows: number[];
  page: number;
  pageSize: number;
}
```

### 3. Форма создания/редактирования
```typescript
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  department: string;
  position: string;
  email: string;
  phone?: string;
  hireDate: Date;
  salary: {
    amount: number;
    currency: string;
    type: 'fixed' | 'hourly';
  };
  documents: {
    type: string;
    number: string;
    issueDate: Date;
    expiryDate?: Date;
  }[];
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  departments: string[];
  positions: string[];
}
```

## API Интеграция

### 1. Получение данных
```typescript
// Загрузка списка сотрудников
const fetchEmployees = async (
  filters: EmployeeFilters,
  sort: { field: string; order: 'asc' | 'desc' },
  pagination: { page: number; pageSize: number }
): Promise<{
  items: Employee[];
  total: number;
}> => {
  const response = await api.get('/api/v1/hr/employees', {
    params: {
      ...filters,
      sortBy: sort.field,
      sortOrder: sort.order,
      page: pagination.page,
      limit: pagination.pageSize,
    },
  });
  return response.data;
};

// Загрузка справочников
const fetchDictionaries = async (): Promise<{
  departments: string[];
  positions: string[];
  statuses: EmployeeStatus[];
}> => {
  const response = await api.get('/api/v1/hr/dictionaries');
  return response.data;
};
```

### 2. Управление данными
```typescript
// Создание сотрудника
const createEmployee = async (data: EmployeeFormData): Promise<Employee> => {
  const response = await api.post('/api/v1/hr/employees', data);
  return response.data;
};

// Обновление сотрудника
const updateEmployee = async (
  id: number,
  data: EmployeeFormData
): Promise<Employee> => {
  const response = await api.put(`/api/v1/hr/employees/${id}`, data);
  return response.data;
};

// Удаление сотрудника
const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/hr/employees/${id}`);
};
```

## Состояние страницы

```typescript
interface EmployeesPageState {
  employees: Employee[];
  loading: boolean;
  error?: string;
  filters: EmployeeFilters;
  sort: {
    field: keyof Employee;
    order: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  modal: {
    type: 'create' | 'edit' | 'delete' | null;
    data?: Employee;
  };
  dictionaries: {
    departments: string[];
    positions: string[];
    statuses: EmployeeStatus[];
  };
}
```

## Обработка ошибок

```typescript
interface ErrorHandling {
  // Ошибки валидации формы
  validation: {
    [K in keyof EmployeeFormData]?: string;
  };
  
  // Ошибки API
  api: {
    create: string[];
    update: string[];
    delete: string[];
    fetch: string[];
  };
}
```

## События и действия

```typescript
interface EmployeesPageActions {
  // Фильтрация
  handleFilterChange: (filters: EmployeeFilters) => void;
  
  // Сортировка
  handleSort: (field: keyof Employee) => void;
  
  // Пагинация
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  
  // Модальные окна
  handleModalOpen: (type: 'create' | 'edit' | 'delete', data?: Employee) => void;
  handleModalClose: () => void;
  
  // CRUD операции
  handleCreate: (data: EmployeeFormData) => Promise<void>;
  handleUpdate: (id: number, data: EmployeeFormData) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  
  // Экспорт
  handleExport: (format: 'excel' | 'pdf' | 'csv') => Promise<void>;
}
```

## Права доступа

```typescript
interface EmployeesPagePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  changeStatus: boolean;
}

const checkPermissions = (
  user: User,
  action: keyof EmployeesPagePermissions
): boolean => {
  const permissions: Record<string, string[]> = {
    view: ['HR_VIEW', 'HR_ADMIN'],
    create: ['HR_EDIT', 'HR_ADMIN'],
    edit: ['HR_EDIT', 'HR_ADMIN'],
    delete: ['HR_ADMIN'],
    export: ['HR_VIEW', 'HR_ADMIN'],
    changeStatus: ['HR_EDIT', 'HR_ADMIN'],
  };
  
  return user.permissions.some(p => permissions[action].includes(p));
};
```

## Метрики и аналитика

```typescript
interface EmployeesPageMetrics {
  // Статистика по отделам
  departmentStats: {
    department: string;
    count: number;
    avgSalary: number;
  }[];
  
  // Статистика по статусам
  statusStats: {
    status: EmployeeStatus;
    count: number;
  }[];
  
  // Динамика изменений
  changes: {
    hired: number;
    fired: number;
    period: 'day' | 'week' | 'month';
  };
}
```

## Оптимизация производительности

1. Виртуализация таблицы для больших списков
2. Кэширование справочников
3. Debounce для поисковых запросов
4. Пагинация на стороне сервера
5. Ленивая загрузка модальных окон

## Тестовые сценарии

1. Фильтрация и поиск
2. Создание/редактирование/удаление
3. Валидация форм
4. Обработка ошибок
5. Проверка прав доступа
6. Экспорт данных
7. Пагинация и сортировка 
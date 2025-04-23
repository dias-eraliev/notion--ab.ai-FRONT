# Страница карточки сотрудника

## Компоненты

### 1. Основная информация
```typescript
interface EmployeeProfileInfo {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  photo?: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  email: string;
  phone?: string;
  hireDate: Date;
  fireDate?: Date;
}

interface ProfileInfoProps {
  data: EmployeeProfileInfo;
  onEdit: () => void;
  onStatusChange: (status: EmployeeStatus) => void;
  permissions: EmployeeProfilePermissions;
}
```

### 2. Документы
```typescript
interface EmployeeDocument {
  id: number;
  type: string;
  number: string;
  issueDate: Date;
  expiryDate?: Date;
  scan?: string;
  status: 'active' | 'expired';
}

interface DocumentsProps {
  documents: EmployeeDocument[];
  onAdd: (doc: Omit<EmployeeDocument, 'id'>) => void;
  onDelete: (id: number) => void;
  onUpload: (id: number, file: File) => void;
  permissions: EmployeeProfilePermissions;
}
```

### 3. Зарплата и компенсации
```typescript
interface SalaryInfo {
  base: {
    amount: number;
    currency: string;
    type: 'fixed' | 'hourly';
  };
  bonuses: {
    id: number;
    type: string;
    amount: number;
    startDate: Date;
    endDate?: Date;
  }[];
  history: {
    date: Date;
    amount: number;
    reason: string;
  }[];
}

interface SalaryProps {
  data: SalaryInfo;
  onEdit: (data: Partial<SalaryInfo>) => void;
  permissions: EmployeeProfilePermissions;
}
```

### 4. Отпуска и больничные
```typescript
interface LeaveInfo {
  id: number;
  type: 'vacation' | 'sick_leave' | 'unpaid';
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  documents?: {
    id: number;
    type: string;
    url: string;
  }[];
}

interface LeaveHistoryProps {
  leaves: LeaveInfo[];
  onAdd: (leave: Omit<LeaveInfo, 'id' | 'status'>) => void;
  onCancel: (id: number) => void;
  permissions: EmployeeProfilePermissions;
}
```

## API Интеграция

### 1. Получение данных профиля
```typescript
// Загрузка профиля
const fetchProfile = async (id: number): Promise<EmployeeProfileInfo> => {
  const response = await api.get(`/api/v1/hr/employees/${id}`);
  return response.data;
};

// Загрузка документов
const fetchDocuments = async (id: number): Promise<EmployeeDocument[]> => {
  const response = await api.get(`/api/v1/hr/employees/${id}/documents`);
  return response.data;
};

// Загрузка информации о зарплате
const fetchSalary = async (id: number): Promise<SalaryInfo> => {
  const response = await api.get(`/api/v1/hr/employees/${id}/salary`);
  return response.data;
};

// Загрузка истории отпусков
const fetchLeaves = async (id: number): Promise<LeaveInfo[]> => {
  const response = await api.get(`/api/v1/hr/employees/${id}/leaves`);
  return response.data;
};
```

### 2. Управление данными
```typescript
// Обновление профиля
const updateProfile = async (
  id: number,
  data: Partial<EmployeeProfileInfo>
): Promise<EmployeeProfileInfo> => {
  const response = await api.put(`/api/v1/hr/employees/${id}`, data);
  return response.data;
};

// Загрузка документов
const uploadDocument = async (
  employeeId: number,
  docId: number,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await api.post(
    `/api/v1/hr/employees/${employeeId}/documents/${docId}/upload`,
    formData
  );
};

// Обновление зарплаты
const updateSalary = async (
  id: number,
  data: Partial<SalaryInfo>
): Promise<SalaryInfo> => {
  const response = await api.put(`/api/v1/hr/employees/${id}/salary`, data);
  return response.data;
};
```

## Состояние страницы

```typescript
interface EmployeeProfileState {
  profile: EmployeeProfileInfo | null;
  documents: EmployeeDocument[];
  salary: SalaryInfo | null;
  leaves: LeaveInfo[];
  loading: {
    profile: boolean;
    documents: boolean;
    salary: boolean;
    leaves: boolean;
  };
  error?: string;
  activeTab: 'info' | 'documents' | 'salary' | 'leaves';
  modal: {
    type: 'edit-profile' | 'add-document' | 'edit-salary' | 'add-leave' | null;
    data?: any;
  };
}
```

## Права доступа

```typescript
interface EmployeeProfilePermissions {
  viewProfile: boolean;
  editProfile: boolean;
  viewDocuments: boolean;
  editDocuments: boolean;
  viewSalary: boolean;
  editSalary: boolean;
  viewLeaves: boolean;
  manageLeaves: boolean;
}

const checkProfilePermissions = (
  user: User,
  employeeId: number
): EmployeeProfilePermissions => {
  const isHR = user.permissions.includes('HR_ADMIN');
  const isSelf = user.id === employeeId;
  
  return {
    viewProfile: true,
    editProfile: isHR,
    viewDocuments: isHR || isSelf,
    editDocuments: isHR,
    viewSalary: isHR || isSelf,
    editSalary: isHR,
    viewLeaves: isHR || isSelf,
    manageLeaves: isHR,
  };
};
```

## Обработка ошибок

```typescript
interface ProfileErrorHandling {
  // Ошибки валидации
  validation: {
    profile?: {
      [K in keyof EmployeeProfileInfo]?: string;
    };
    document?: {
      [K in keyof EmployeeDocument]?: string;
    };
    salary?: {
      [K in keyof SalaryInfo]?: string;
    };
    leave?: {
      [K in keyof LeaveInfo]?: string;
    };
  };
  
  // Ошибки API
  api: {
    fetch: string[];
    update: string[];
    upload: string[];
  };
}
```

## События и действия

```typescript
interface ProfilePageActions {
  // Навигация
  handleTabChange: (tab: EmployeeProfileState['activeTab']) => void;
  
  // Модальные окна
  handleModalOpen: (type: EmployeeProfileState['modal']['type'], data?: any) => void;
  handleModalClose: () => void;
  
  // Профиль
  handleProfileUpdate: (data: Partial<EmployeeProfileInfo>) => Promise<void>;
  handleStatusChange: (status: EmployeeStatus) => Promise<void>;
  
  // Документы
  handleDocumentAdd: (doc: Omit<EmployeeDocument, 'id'>) => Promise<void>;
  handleDocumentDelete: (id: number) => Promise<void>;
  handleDocumentUpload: (id: number, file: File) => Promise<void>;
  
  // Зарплата
  handleSalaryUpdate: (data: Partial<SalaryInfo>) => Promise<void>;
  handleBonusAdd: (bonus: SalaryInfo['bonuses'][0]) => Promise<void>;
  handleBonusDelete: (id: number) => Promise<void>;
  
  // Отпуска
  handleLeaveAdd: (leave: Omit<LeaveInfo, 'id' | 'status'>) => Promise<void>;
  handleLeaveCancel: (id: number) => Promise<void>;
}
```

## Метрики и аналитика

```typescript
interface ProfileMetrics {
  // Статистика по отпускам
  leaveStats: {
    used: number;
    remaining: number;
    sickLeaves: number;
    byYear: {
      year: number;
      total: number;
      used: number;
    }[];
  };
  
  // Статистика по зарплате
  salaryStats: {
    yearlyGrowth: number;
    averageBonus: number;
    history: {
      date: Date;
      amount: number;
    }[];
  };
  
  // Статистика по документам
  documentStats: {
    total: number;
    expired: number;
    expiringSoon: number;
  };
}
```

## Оптимизация производительности

1. Параллельная загрузка данных
2. Кэширование данных профиля
3. Ленивая загрузка документов
4. Оптимизация изображений
5. Предварительная загрузка часто используемых данных

## Тестовые сценарии

1. Просмотр и редактирование профиля
2. Управление документами
3. Изменение зарплаты и бонусов
4. Управление отпусками
5. Проверка прав доступа
6. Загрузка и отображение файлов
7. Валидация форм 
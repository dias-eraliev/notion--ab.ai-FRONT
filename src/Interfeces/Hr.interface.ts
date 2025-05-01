export enum EmployeeStatusEnum {
    ACTIVE = 'ACTIVE',
    VACATION = 'VACATION',
    SICK_LEAVE = 'SICK_LEAVE',
    BUSINESS_TRIP = 'BUSINESS_TRIP',
}

export enum EmploymentTypeEnum {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
}

export enum HrDocumentStatusEnum {
    VALID = 'VALID',
    EXPIRED = 'EXPIRED',
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

interface EmployeeAchievement {
    id: string; // UUID
    description: string;
    date?: string | null; // Дата в виде строки (ISO) или null
}

interface EmployeeDocument {
    id: string; // UUID
    name: string;
    type: string;
    url: string;
    status: HrDocumentStatusEnum; // Используем Enum
    expiryDate?: string | null; // Дата в виде строки (ISO) или null
}

export interface Employee {
    id: string; // UUID сотрудника из таблицы Employee
    userId: number; // ID связанного пользователя из таблицы User
    fullName: string; // Используем fullName вместо name
    iin: string;
    position: string;
    category: string;
    status: EmployeeStatusEnum; // Используем Enum
    employmentType: EmploymentTypeEnum; // Используем Enum
    email?: string | null; // Может быть не указан или null
    phone: string; // Обязательный телефон
    address?: string | null; // Может быть не указан или null
    education?: string | null; // Может быть не указан или null
    specialization?: string | null; // Может быть не указан или null
    hireDate: string; // Дата в виде строки (ISO), обязательное поле
    workExperience?: string | null; // Может быть не вычислен или null
    generalSubjects: string[]; // Массив строк
    specialSubjects: string[]; // Массив строк
    achievements: EmployeeAchievement[]; // Массив объектов достижений
    documents: EmployeeDocument[]; // Массив объектов документов
    createdAt: string; // Дата в виде строки (ISO)
    updatedAt: string; // Дата в виде строки (ISO)
}
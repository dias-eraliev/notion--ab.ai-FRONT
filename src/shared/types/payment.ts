export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
}

export enum PaymentDirection {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum PaymentType {
  TUITION = "TUITION",
  SALARY = "SALARY",
  OPERATIONAL = "OPERATIONAL",
  OTHER = "OTHER",
}

export interface Student {
  id: number;
  fullName: string;
  group?: string;
}

export interface PaymentDocument {
  id: string;
  name: string;
  file: string; 
  uploaded_at: string;
}

export interface Payment {
  id: string;
  amount: string;
  discount: string;
  paidAt: Date | null;
  dueDate: Date;
  status: PaymentStatus;
  direction: PaymentDirection;
  type: PaymentType;
  createdAt: Date;
  updatedAt: Date;
  documents?: PaymentDocument[];
  studentId: number | null;
  student?: Student | null;
}

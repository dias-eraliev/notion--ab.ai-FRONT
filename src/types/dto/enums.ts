

export const role = ['STUDENT', 'TEACHER', 'ADMIN', 'PARENT'] as const;
export type Role = (typeof role)[number];


export const relation = ['FATHER', 'MOTHER', 'OTHER'] as const;
export type Relation = (typeof relation)[number];


export const status = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;
export type Status = (typeof status)[number];


export const documentType = ['RECEIPT', 'STATEMENT', 'OTHER'] as const;
export type DocumentType = (typeof documentType)[number];


export const paymentStatus = ['PENDING', 'PAID', 'OVERDUE', 'CANCELED'] as const;
export type PaymentStatus = (typeof paymentStatus)[number];


export const paymentDirection = ['INCOME', 'EXPENSE'] as const;
export type PaymentDirection = (typeof paymentDirection)[number];


export const paymentType = ['SALARY', 'OPERATING_COST', 'EDUCATION'] as const;
export type PaymentType = (typeof paymentType)[number];


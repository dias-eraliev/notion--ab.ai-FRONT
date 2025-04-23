

export const role = ['STUDENT', 'TEACHER', 'ADMIN', 'PARENT'] as const;
export type Role = (typeof role)[number];


export const relation = ['FATHER', 'MOTHER', 'OTHER'] as const;
export type Relation = (typeof relation)[number];


export const status = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;
export type Status = (typeof status)[number];


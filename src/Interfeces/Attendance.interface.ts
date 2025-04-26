export interface IAttendance {
    date: string;
    type: 'presence' | 'absence' | 'late' | 'medical' | 'excused';
    subject?: string;
    time?: string;
    reason?: string;
    status?: string;
    approvedBy?: string;
    duration?: string;
    comment?: string;
}
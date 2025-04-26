export interface IGradeData {
    subject: string;
    currentGrade: number;
    previousGrade: number;
    averageGrade: number;
    trend: 'up' | 'down' | 'stable';
    teacherName: string;
    lastUpdate: string;
    assignments: {
        type: string;
        grade: number;
        date: string;
        topic: string;
    }[];
}
export interface IExamResult {
    subject: string;
    maxScore: number;
    minScore: number;
    score: number;
    result: 'Сдано' | 'Не сдано';
    examType: string;
    date: string;
    code?: string;
    classAverageScore?: number;
    details?: {
        topics: Array<{
            name: string;
            score: number;
            maxScore: number;
            mistakes?: string[];
        }>;
        examiner: string;
        duration: string;
        location: string;
        notes?: string;
    };
}
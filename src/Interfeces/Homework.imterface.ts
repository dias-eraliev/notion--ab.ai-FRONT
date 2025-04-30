// Updated Homework interface to match backend data structure
export interface Homework {
    id: number;
    name: string;
    description: string | null;
    deadline: string | null;
    date: string | null;
    createdAt: string;
    updatedAt: string;
    lessonId: number;
    materialId: number | null;
    // Derived fields
    status: 'pending' | 'submitted' | 'graded' | 'overdue';
    attachments: {
        id: string;
        name: string;
        type: string;
    }[];
    // Lesson info
    Lesson?: {
        id: number;
        name: string;
        description: string;
        syllabusId: number;
        date: string;
        Syllabus?: {
            id: number;
            name: string;
            description: string;
            teacherId: number;
            group?: Array<{
                id: number;
                name: string;
            }>;
            teacher?: {
                id: number;
                name: string;
                surname: string;
            };
        };
    };
    // Material info
    material?: {
        id: number;
        name: string;
        videoUrl: string | null;
        lecture: string | null;
        presentationUrl: string | null;
        quizId: number | null;
        Quiz?: {
            id: number;
            name: string;
            description: string;
            questions?: Array<{
                id: number;
                question: string;
                answers?: Array<{
                    id: number;
                    answer: string;
                    isCorrect: boolean;
                }>;
            }>;
        };
    };
    // Submission and feedback
    grade?: number;
    feedback?: string;
    submission?: {
        files: {
            id: string;
            name: string;
            type: string;
        }[];
        comment?: string;
        submittedAt?: string;
    };
}


export interface HomeworkModalData {
    title: string;
    description: string;
    deadline: string;
    date: string;
    lessonId: string;
    groupId: string;
    studyPlanId: string;
    materialType: string;
    materialContent: string;
    materialUrl: string;
    hasQuiz: boolean;
    quizTitle: string;
    quizDescription: string;
    questions: Array<{
        question: string;
        options: string[];
        correctOption: number;
        answers?: Array<{
            text: string;
            isCorrect: boolean;
        }>;
    }>;
}
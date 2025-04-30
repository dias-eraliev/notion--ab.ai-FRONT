export type Homework = {
    id: number;
    name: string;
    materialId: number;
    lessonId: number;
    date: any;
    description: any;
    deadline: any;
    createdAt: string;
    updatedAt: string;
    Lesson: {
        id: number;
        name: string;
        description: string;
        syllabusId: number;
        materialId: any;
        attendanceId: number;
        date: any;
        createdAt: string;
        updatedAt: string;
        Syllabus: {
            id: number;
            name: string;
            description: string;
            teacherId: number;
            courseNumber: any;
            createdAt: string;
            updatedAt: string;
            group: Array<{
                id: number;
                name: string;
                courseNumber: number;
                createdAt: string;
                updatedAt: string;
            }>;
            teacher: {
                id: number;
                name: string;
                surname: string;
            };
        };
    };
    material: {
        id: number;
        name: string;
        videoUrl: any;
        lecture: any;
        presentationUrl: any;
        lessonId: any;
        createdAt: string;
        updatedAt: string;
        quizId: number;
        Quiz: {
            id: number;
            name: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            questions: Array<{
                id: number;
                question: string;
                quizId: number;
                createdAt: string;
                updatedAt: string;
                answers: Array<{
                    id: number;
                    answer: string;
                    questionId: number;
                    createdAt: string;
                    updatedAt: string;
                }>;
            }>;
        };
    };
};  
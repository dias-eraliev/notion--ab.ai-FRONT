import api, { fetcher } from './index';

// DTOs
export interface CreateHomeworkDto {
    Lesson: {
        connect: {
            id: number;
        }
    };
    name: string;
    description: string;
    deadline: Date | string;
    date: Date | string;
    group?: {
        connect: {
            id: number;
        }
    };
    studyPlan?: {
        connect: {
            id: number;
        }
    };
    material?: {
        create?: {
            type: string;
            content?: string;
            url?: string;
            Quiz?: {
                create?: {
                    title: string;
                    description: string;
                    questions?: {
                        create: {
                            question: string;
                            options?: string[];
                            correctOption?: number;
                        }[];
                    };
                };
            };
        };
    };
}

export interface UpdateHomeworkDto {
    name?: string;
    description?: string;
    deadline?: Date | string;
    date?: Date | string;
    material?: {
        create?: {
            type: string;
            content?: string;
            url?: string;
        };
    };
}

export interface HomeworkResponse {
    id: number;
    name: string;
    description: string;
    deadline: string;
    date: string;
    Lesson: {
        id: number;
        name: string;
        Teacher: {
            id: number;
            firstname: string;
            lastname: string;
        };
    };
    Material?: {
        id: number;
        type: string;
        content?: string;
        url?: string;
        Quiz?: {
            id: number;
            title: string;
            description: string;
            questions: {
                id: number;
                question: string;
                options?: string[];
                correctOption?: number;
            }[];
        };
    };
}

// API endpoints
const homeworkApi = {
    getAll: (groupId: number | null, studyPlanId: number | null) => groupId && studyPlanId
        ? fetcher(`/homework?groupId=${groupId}&studyPlanId=${studyPlanId}`)
        : null,

    getOne: (id: number) =>
        fetcher(`/homework/${id}`),

    create: (homework: CreateHomeworkDto) =>
        api.post<HomeworkResponse>('/homework', homework),

    update: (id: number, homework: UpdateHomeworkDto) =>
        api.patch<HomeworkResponse>(`/homework/${id}`, homework),

    delete: (id: number) =>
        api.delete(`/homework/${id}`),

    uploadFile: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default homeworkApi; 
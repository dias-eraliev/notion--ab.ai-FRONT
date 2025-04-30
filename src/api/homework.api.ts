import api, {fetcher} from './index';

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
    getAll: (groupId: string | number | null, studyPlanId: string | number | null) => {
        const params = new URLSearchParams();

        if (groupId !== null && groupId !== undefined && groupId !== '') {
            params.append('groupId', String(groupId));
        }
        if (studyPlanId !== null && studyPlanId !== undefined && studyPlanId !== '') {
            params.append('studyPlanId', String(studyPlanId));
        }
        const queryString = params.toString();
        const url = `/homework${queryString ? `?${queryString}` : ''}`;

        console.log(`[homeworkApi.getAll] Calling fetcher with URL: ${url}`);
        return fetcher(url);
    },

    getOne: (id: number) =>
        fetcher(`/homework/${id}`), // Добавил /api/ префикс для консистентности

    create: (homework: CreateHomeworkDto) =>
        api.post<HomeworkResponse>('/homework', homework), // Добавил /api/

    update: (id: number, homework: UpdateHomeworkDto) =>
        api.patch<HomeworkResponse>(`/homework/${id}`, homework), // Добавил /api/

    delete: (id: number) =>
        api.delete(`/homework/${id}`), // Добавил /api/

    uploadFile: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // Убедись, что /api/upload - правильный путь
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default homeworkApi; 
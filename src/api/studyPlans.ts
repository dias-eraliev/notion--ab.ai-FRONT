import api from './index';

interface StudyPlan {
    id: number;
    subject: string;
    description?: string;
    teacher: {
        id: number;
        name: string;
        surname: string;
    };
    lessons: Lesson[];
}

interface Lesson {
    id: number;
    title: string;
    description: string;
    scheduledDate?: string;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
    homework?: {
        id: number;
        name: string;
    }[];
}

interface CreateLessonDto {
    title: string;
    description: string;
    scheduledDate?: string;
    hasVideo: boolean;
    hasPresentation: boolean;
    hasTest: boolean;
    videoFile?: File;
    videoLink?: string;
    presentationFile?: File;
    testQuestions?: any[];
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// SWR fetcher function
export const fetcher = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};

// SWR key builder functions
export const studyPlansKey = (page = 1, limit = 10) =>
    `/study-plans?page=${page}&limit=${limit}`;

export const studyPlanKey = (id: string) =>
    `/study-plans/${id}`;

/**
 * Fetches study plans based on the user's role
 * - Students: Only plans associated with their groups
 * - Teachers: Only plans they created or are assigned to
 * - Admins: All plans
 */
export const getStudyPlans = async (page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<StudyPlan>>(studyPlansKey(page, limit));
    return response.data;
};

/**
 * Fetches a specific study plan by ID
 * Access is controlled on the backend based on the user's role
 */
export const getStudyPlanById = async (id: string) => {
    const response = await api.get<StudyPlan>(studyPlanKey(id));
    return response.data;
};

/**
 * Creates a new lesson for a study plan
 * Only teachers and admins can create lessons
 */
export const createLesson = async (studyPlanId: string, lessonData: CreateLessonDto) => {
    // Create FormData if files are included
    if (lessonData.videoFile || lessonData.presentationFile) {
        const formData = new FormData();

        // Add JSON data
        formData.append('title', lessonData.title);
        formData.append('description', lessonData.description);
        if (lessonData.scheduledDate) {
            formData.append('scheduledDate', lessonData.scheduledDate);
        }
        formData.append('hasVideo', String(lessonData.hasVideo));
        formData.append('hasPresentation', String(lessonData.hasPresentation));
        formData.append('hasTest', String(lessonData.hasTest));

        if (lessonData.videoLink) {
            formData.append('videoLink', lessonData.videoLink);
        }

        if (lessonData.videoFile) {
            formData.append('videoFile', lessonData.videoFile);
        }

        if (lessonData.presentationFile) {
            formData.append('presentationFile', lessonData.presentationFile);
        }

        if (lessonData.testQuestions && lessonData.testQuestions.length > 0) {
            formData.append('testQuestions', JSON.stringify(lessonData.testQuestions));
        }

        const response = await api.post<Lesson>(`/study-plans/${studyPlanId}/lessons`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } else {
        // Regular JSON request
        const response = await api.post<Lesson>(`/study-plans/${studyPlanId}/lessons`, lessonData);
        return response.data;
    }
};

/**
 * Creates a new study plan
 * Only teachers and admins can create study plans
 */
export const createStudyPlan = async (studyPlanData: any, groupIds: number[]) => {
    const response = await api.post<StudyPlan>('/study-plans', {
        CreateStudyPlanDto: studyPlanData,
        groupIds
    });
    return response.data;
};

export type { StudyPlan, Lesson, CreateLessonDto, PaginatedResponse }; 
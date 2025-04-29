import api, { fetcher } from './index';
import useSWR from 'swr';

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

// Simple study plan structure returned by the group endpoint
interface GroupStudyPlan {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    name: string;
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

// SWR key builder functions
export const studyPlansKey = (page = 1, limit = 10) =>
    `/study-plans?page=${page}&limit=${limit}`;

export const studyPlanByGroupKey = (groupId: number) =>
    `/study-plans/${groupId}/group`;

export const studyPlanKey = (id: string) =>
    `/study-plans/${id}`;

export const studyPlanLessonsKey = (id: number) =>
    `/study-plans/${id}/lessons`;

/**
 * SWR hook to fetch study plans based on the user's role
 * - Students: Only plans associated with their groups
 * - Teachers: Only plans they created or are assigned to
 * - Admins: All plans
 */
export const useStudyPlans = (page = 1, limit = 10) => {
    const { data, error, mutate } = useSWR<PaginatedResponse<StudyPlan>>(
        studyPlansKey(page, limit),
        fetcher
    );
    
    return {
        studyPlans: data?.data,
        isLoading: !error && !data,
        isError: error,
        total: data?.total,
        mutate
    };
};

/**
 * SWR hook to fetch study plans for a specific group
 */
export const useStudyPlansByGroup = (groupId?: number) => {
    const { data, error, mutate } = useSWR<GroupStudyPlan[]>(
        groupId ? studyPlanByGroupKey(groupId) : null,
        fetcher
    );
    
    return {
        studyPlans: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

/**
 * SWR hook to fetch a specific study plan by ID
 */
export const useStudyPlan = (id?: number) => {
    const { data, error, mutate } = useSWR<StudyPlan>(
        id ? studyPlanKey(id.toString()) : null,
        fetcher
    );
    
    return {
        studyPlan: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

/**
 * SWR hook to fetch lessons for a specific study plan
 */
export const useStudyPlanLessons = (id?: number) => {
    const { data, error, mutate } = useSWR<Lesson[]>(
        id ? studyPlanLessonsKey(id) : null,
        fetcher
    );
    
    return {
        lessons: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

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
 * Fetches study plans for a specific group
 */
export const getStudyPlansByGroup = async (groupId: number) => {
    const response = await api.get<GroupStudyPlan[]>(studyPlanByGroupKey(groupId));
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
 * Fetches lessons for a specific study plan
 */
export const getLessonsByStudyPlanId = async (id: number) => {
    const response = await api.get<Lesson[]>(studyPlanLessonsKey(id));
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
export const createStudyPlan = async (studyPlanData: any, groupIds: number[], teacherId: number) => {
    const response = await api.post<StudyPlan>('/study-plans', {
        ...studyPlanData,
        groupIds,
        teacherId
    });
    return response.data;
};

export type { StudyPlan, GroupStudyPlan, Lesson, CreateLessonDto, PaginatedResponse }; 
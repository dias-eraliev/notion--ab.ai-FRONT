import { api, fetcher } from './index';
import useSWR from 'swr';

// Study Plan (Syllabus) DTO
export interface SyllabusDto {
    id: number;
    name: string;
    description?: string;
    teacherId?: string;
    groupIds?: number[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Lesson DTO
export interface LessonDto {
    id: number;
    name: string;
    description?: string;
    syllabusId: number;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Pagination interface
export interface PaginatedDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// Get all study plans with pagination
export const useStudyPlans = (page = 1, limit = 10) => {
    const { data, error, mutate } = useSWR<PaginatedDto<SyllabusDto>>(
        `/study-plans?page=${page}&limit=${limit}`,
        fetcher
    );

    return {
        studyPlans: data?.data || [],
        pagination: {
            total: data?.total || 0,
            page: data?.page || 0,
            limit: data?.limit || 0,
        },
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

// Get study plans by group ID
export const useStudyPlansByGroup = (groupId?: number, page = 1, limit = 10) => {
    const { data, error, mutate } = useSWR<PaginatedDto<SyllabusDto>>(
        groupId ? `/study-plans/?page=${page}&limit=${limit}` : null,
        fetcher
    );

    return {
        studyPlans: data?.data || [],
        pagination: {
            total: data?.total || 0,
            page: data?.page || 0,
            limit: data?.limit || 0,
        },
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

// Get a specific study plan by ID
export const useStudyPlan = (planId?: number) => {
    const { data, error, mutate } = useSWR<SyllabusDto>(
        planId ? `/study-plans/${planId}` : null,
        fetcher
    );

    return {
        studyPlan: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

// Get lessons for a study plan
export const useLessonsByPlan = (planId?: number) => {
    const { data, error, mutate } = useSWR<LessonDto[]>(
        planId ? `/study-plans/${planId}/lessons` : null,
        fetcher
    );

    return {
        lessons: data || [],
        isLoading: !error && !data,
        isError: error,
        mutate
    };
};

// Create a new study plan
export const createStudyPlan = async (createStudyPlanDto: any, groupIds: number[]) => {
    const response = await api.post('/study-plans', {
        CreateStudyPlanDto: createStudyPlanDto,
        groupIds: groupIds
    });
    return response.data;
};

// Add a lesson to a study plan
export const addLessonToStudyPlan = async (planId: number, createLessonDto: any) => {
    const response = await api.post(`/study-plans/${planId}/lessons`, createLessonDto);
    return response.data;
}; 
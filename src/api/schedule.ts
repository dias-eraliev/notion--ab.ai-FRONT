import useSWR, {mutate} from 'swr';
import {api, fetcher} from './index';

// DTO interfaces
export interface ScheduleDto {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId?: string;
    type: string;
    repeat: string;
    comment?: string;
    classroomId: number;
    groupId: number;
    classroom?: {
        name: string;
    };
    lesson?: {
        name: string;
        Syllabus?: {
            teacher?: {
                name: string;
                surname: string;
            };
        };
    };
}

export interface CreateScheduleDto {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId?: string;
    type: string;
    repeat: string;
    comment?: string;
    classroomId: number;
    groupId: number;
    studyPlanId?: number;
    lessonId?: number;
}

export interface UpdateScheduleDto {
    day?: string;
    startTime?: string;
    endTime?: string;
    subject?: string;
    teacherId?: string;
    type?: string;
    repeat?: string;
    comment?: string;
    classroomId?: number;
    groupId?: number;
    studyPlanId?: number;
    lessonId?: number;
}

// Schedules API hooks
export const useSchedules = (groupId?: number) => {
    const url = groupId ? `/schedule?groupId=${groupId}` : '/schedule';
    return useSWR<ScheduleDto[]>(url, fetcher);
};

// CRUD operations
export const createSchedule = async (data: CreateScheduleDto) => {
    const response = await api.post('/schedule', data);
    mutate(`/schedule?groupId=${data.groupId}`);
    return response.data;
};

export const updateSchedule = async (id: number, data: UpdateScheduleDto) => {
    const response = await api.patch(`/schedule/${id}`, data);
    mutate(`/schedule?groupId=${data.groupId}`);
    return response.data;
};

export const deleteSchedule = async (id: number, groupId: number) => {
    const response = await api.delete(`/schedule/${id}`);
    mutate(`/schedule?groupId=${groupId}`);
    return response.data;
}; 
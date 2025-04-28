import { api, fetcher } from './index';
import useSWR from 'swr';

// Schedule interface based on backend schema
export interface ScheduleDto {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  type: string;
  repeat: string;
  comment?: string;
  classroomId: number;
  groupId: number;
  lessonId?: number;
  // Additional fields for more complete schedule data
  classroom?: {
    id: number;
    name: string;
    isFree: boolean;
  };
  group?: {
    id: number;
    name: string;
  };
}

export interface CreateScheduleDto {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  type: string;
  repeat: string;
  comment?: string;
  classroomId: number;
  groupId: number;
  lessonId?: number;
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> { }

// Get all schedules (admin view)
export const useAllSchedules = () => {
  const { data, error, mutate } = useSWR<ScheduleDto[]>('/schedule', fetcher);

  return {
    schedules: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Get schedules by group ID
export const useSchedulesByGroup = (groupId?: number) => {
  const { data, error, mutate } = useSWR<ScheduleDto[]>(
    groupId ? `/schedule?groupId=${groupId}` : null,
    fetcher
  );

  return {
    schedules: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Get schedules by teacher ID
export const useSchedulesByTeacher = (teacherId?: string) => {
  const { data, error, mutate } = useSWR<ScheduleDto[]>(
    teacherId ? `/schedule?teacherId=${teacherId}` : null,
    fetcher
  );

  return {
    schedules: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Create a new schedule
export const createSchedule = async (schedule: CreateScheduleDto) => {
  const response = await api.post('/schedule', schedule);
  return response.data;
};

// Update an existing schedule
export const updateSchedule = async (id: number, schedule: UpdateScheduleDto) => {
  const response = await api.patch(`/schedule/${id}`, schedule);
  return response.data;
};

// Delete a schedule
export const deleteSchedule = async (id: number) => {
  const response = await api.delete(`/schedule/${id}`);
  return response.data;
}; 
import { api, fetcher } from './index';
import useSWR from 'swr';

// Classroom interface based on backend schema
export interface ClassroomDto {
  id: number;
  name: string;
  isFree: boolean;
}

export interface CreateClassroomDto {
  name: string;
  isFree?: boolean;
}

export interface UpdateClassroomDto extends Partial<CreateClassroomDto> {}

// Get all classrooms
export const useClassrooms = () => {
  const { data, error, mutate } = useSWR<ClassroomDto[]>('/classrooms', fetcher);
  
  return {
    classrooms: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Get classroom by ID
export const useClassroom = (id?: number) => {
  const { data, error, mutate } = useSWR<ClassroomDto>(
    id ? `/classrooms/${id}` : null, 
    fetcher
  );
  
  return {
    classroom: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Create a new classroom
export const createClassroom = async (classroom: CreateClassroomDto) => {
  const response = await api.post('/classrooms', classroom);
  return response.data;
};

// Update an existing classroom
export const updateClassroom = async (id: number, classroom: UpdateClassroomDto) => {
  const response = await api.patch(`/classrooms/${id}`, classroom);
  return response.data;
};

// Delete a classroom
export const deleteClassroom = async (id: number) => {
  const response = await api.delete(`/classrooms/${id}`);
  return response.data;
}; 
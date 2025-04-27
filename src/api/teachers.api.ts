import { api, fetcher } from './index';
import useSWR from 'swr';

// Teacher interface based on backend schema
export interface TeacherDto {
  id: number;
  userId: number;
  name: string;
  surname: string;
}

// Get all teachers
export const useTeachers = () => {
  const { data, error, mutate } = useSWR<TeacherDto[]>('/teachers', fetcher);
  
  return {
    teachers: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Get teacher by ID
export const useTeacher = (id?: number) => {
  const { data, error, mutate } = useSWR<TeacherDto>(
    id ? `/teachers/${id}` : null, 
    fetcher
  );
  
  return {
    teacher: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}; 
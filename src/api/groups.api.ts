import { api, fetcher } from './index';
import useSWR from 'swr';

// Group interface based on backend schema
export interface GroupDto {
  id: number;
  name: string;
  courseNumber?: number;
  teacherId?: number;
  syllabusId?: number;
}

export interface CreateGroupDto {
  name: string;
  courseNumber?: number;
  teacherId?: number;
  syllabusId?: number;
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {}

// Get all groups
export const useGroups = () => {
  const { data, error, mutate } = useSWR<GroupDto[]>('/groups', fetcher);
  
  return {
    groups: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Get group by ID
export const useGroup = (id?: number) => {
  const { data, error, mutate } = useSWR<GroupDto>(
    id ? `/groups/${id}` : null, 
    fetcher
  );
  
  return {
    group: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};

// Create a new group
export const createGroup = async (group: CreateGroupDto) => {
  const response = await api.post('/groups', group);
  return response.data;
};

// Update an existing group
export const updateGroup = async (id: number, group: UpdateGroupDto) => {
  const response = await api.patch(`/groups/${id}`, group);
  return response.data;
};

// Delete a group
export const deleteGroup = async (id: number) => {
  const response = await api.delete(`/groups/${id}`);
  return response.data;
}; 
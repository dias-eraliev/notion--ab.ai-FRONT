import api from './index';

export interface Subject {
    id: number;
    name: string;
}

export interface Group {
    id: number;
    name: string;
}

// Get all groups
export const getGroups = async () => {
    const response = await api.get<Group[]>('/groups');
    return response.data;
};

// Get a specific group by ID
export const getGroupById = async (id: number) => {
    const response = await api.get<Group>(`/groups/${id}`);
    return response.data;
};
// Get groups for a teacher
export const getGroupsForTeacher = async (teacherId: number) => {
    const response = await api.get<Group[]>(`/teachers/${teacherId}/groups`);
    return response.data;
}; 
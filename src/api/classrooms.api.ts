import useSWR from 'swr';
import api, { fetcher } from '.';

// Interfaces for nested objects
export interface ScheduleDto {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  type: string;
  repeat: string;
  comment?: string;
  lessonId?: number;
  classroomId?: number;
  groupId: number;
  createdAt?: string;
  updatedAt?: string;
  lesson?: {
    id: number;
    name: string;
    description: string;
    syllabusId?: number;
    attendanceId?: number;
    date?: string;
  };
  Group?: {
    id: number;
    name: string;
    courseNumber?: number;
  };
}

export interface InventoryObjectDto {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isAvailable: boolean;
  inventoryId?: number;
  classroomId?: number;
}

export interface DocumentDto {
  id: number;
  name: string;
  url: string;
  type: string;
}

export interface TeacherDto {
  id: number;
  name: string;
  surname: string;
}

// Classroom interface based on backend schema
export interface ClassroomDto {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  type: 'laboratory' | 'lecture' | 'seminar';
  hasProjector: boolean;
  hasComputers: boolean;
  isFree: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Relations - will be populated via separate API calls
  responsibleStaffId?: number;
  responsibleStaff?: TeacherDto;
  schedule?: ScheduleDto[];
  equipment?: InventoryObjectDto[];
  documents?: DocumentDto[];
}

export interface CreateClassroomDto {
  name: string;
  capacity: number;
  type: 'laboratory' | 'lecture' | 'seminar';
  isFree: boolean;
  responsibleStaffId?: number;
  equipmentIds?: number[];
  documentIds?: number[];
}

export interface UpdateClassroomDto extends Partial<CreateClassroomDto> { }

export interface ClassroomUIModel {
  id: string;
  number: string;
  name: string;
  type: string;
  capacity: number;
  status: 'free' | 'occupied' | 'maintenance';
  equipment: Array<{
    id: number;
    name: string;
    quantity?: number;
    status: boolean;
  }>;
  responsiblePersons: Array<{
    id?: number;
    name: string;
    role: string;
    lastCheck?: string;
  }>;
  documents: Array<{
    id: number;
    type: string;
    name: string;
    url: string;
  }>;
  lastUpdate: string;
  building: string;
  floor: number;
  hasProjector: boolean;
  hasComputers: boolean;
  schedule?: ScheduleDto[];
}

const API_URL = '/classrooms';

// Map API data to UI model
export const mapApiClassroomToUI = (classroom: ClassroomDto): ClassroomUIModel => {
  return {
    id: classroom.id.toString(),
    number: classroom.id.toString(), // Using ID as number temporarily
    name: classroom.name,
    type: classroom.type,
    building: classroom.building,
    floor: classroom.floor,
    hasProjector: classroom.hasProjector,
    hasComputers: classroom.hasComputers,
    capacity: classroom.capacity || 0,
    status: classroom.isFree ? 'free' : 'occupied',
    equipment: classroom.equipment?.map(eq => ({
      id: eq.id,
      name: eq.name,
      quantity: eq.quantity,
      status: eq.isAvailable
    })) || [],
    responsiblePersons: classroom.responsibleStaff
      ? [{
        id: classroom.responsibleStaffId,
        name: `${classroom.responsibleStaff.name} ${classroom.responsibleStaff.surname}`,
        role: 'Основной'
      }]
      : [],
    lastUpdate: formatDate(classroom.updatedAt),
    documents: classroom.documents?.map(doc => ({
      id: doc.id,
      type: doc.type,
      name: doc.name,
      url: doc.url
    })) || [],
    schedule: classroom.schedule || []
  };
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Hook to fetch all classrooms
export const useClassrooms = () => {
  const { data, error, mutate } = useSWR<ClassroomDto[]>(
    API_URL,
    fetcher
  );

  return {
    classrooms: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// Hook to fetch a specific classroom by ID with all relations
export const useClassroom = (id: number | string) => {
  const classroomId = typeof id === 'string' ? parseInt(id) : id;

  const { data, error, mutate } = useSWR<ClassroomDto>(
    `${API_URL}/${classroomId}`,
    fetcher
  );

  // Get equipment for the classroom
  const { data: equipmentData } = useSWR<InventoryObjectDto[]>(
    data ? `/inventory/classroom/${classroomId}` : null,
    fetcher
  );

  // Get documents for the classroom
  const { data: documentsData } = useSWR<DocumentDto[]>(
    data ? `${API_URL}/${classroomId}/documents` : null,
    fetcher
  );

  // Combine all data
  const fullClassroom = data ? {
    ...data,
    equipment: equipmentData || [],
    documents: documentsData || []
  } : undefined;

  return {
    classroom: fullClassroom,
    classroomUI: fullClassroom ? mapApiClassroomToUI(fullClassroom) : undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// Inventory related hooks
export const useInventoryObjects = () => {
  const { data, error, mutate } = useSWR<InventoryObjectDto[]>(
    '/inventory',
    fetcher
  );

  return {
    inventoryObjects: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// API Functions
export const createClassroom = async (classroomData: CreateClassroomDto) => {
  const response = await api.post(API_URL, classroomData);
  return response.data;
};

export const updateClassroom = async (id: number, classroomData: UpdateClassroomDto) => {
  const response = await api.patch(`${API_URL}/${id}`, classroomData);
  return response.data;
};

export const deleteClassroom = async (id: number) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const assignInventoryToClassroom = async (inventoryId: number, classroomId: number) => {
  const response = await api.patch(`/inventory/${inventoryId}/assign-to-classroom/${classroomId}`);
  return response.data;
};

export const removeInventoryFromClassroom = async (inventoryId: number) => {
  const response = await api.patch(`/inventory/${inventoryId}/remove-from-classroom`);
  return response.data;
};

export const addDocumentToClassroom = async (classroomId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`${API_URL}/${classroomId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocumentFromClassroom = async (documentId: number) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
}; 
import api from './index';

// Types for API requests and responses
export interface AttendanceData {
  lessonId: number;
  studentId: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  comment?: string;
}

// Attendance API functions
export const createAttendance = async (data: AttendanceData) => {
  const response = await api.post('/attendance', data);
  return response.data;
};

export const getAttendanceByLessonAndStudent = async (lessonId: number, studentId: number) => {
  const response = await api.get(`/attendance/lesson/${lessonId}/student/${studentId}`);
  return response.data;
};

export const getAttendanceByLesson = async (lessonId: number) => {
  const response = await api.get(`/attendance/lesson/${lessonId}`);
  return response.data;
};

export const getAttendanceByStudent = async (studentId: number) => {
  const response = await api.get(`/attendance/student/${studentId}`);
  return response.data;
};

export const updateAttendance = async (id: number, data: {
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  comment?: string;
}) => {
  const response = await api.patch<AttendanceData>(`/attendance/${id}`, data);
  return response.data;
}; 
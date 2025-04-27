import api from './index';

// Types for API requests and responses
export interface LessonGrade {
    id?: number;
    lessonId: number;
    studentId: number;
    grade: number;
    comment?: string;
}

export interface HomeworkGrade {
    id?: number;
    homeworkId: number;
    studentId: number;
    grade: number;
    comment?: string;
}

export interface AttendanceData {
    lessonId: number;
    studentId: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    comment?: string;
}

export interface GradeUpdateDto {
    studentId: number;
    lessonId: number;
    homeworkId?: number;
    lessonGrade?: number;
    homeworkGrade?: number;
    lessonGradeComment?: string;
    homeworkGradeComment?: string;
    isAbsent?: boolean;
    absenceReason?: string;
}

// Grades API functions
export const getGrades = async (syllabusId?: number) => {
    const params = syllabusId ? { syllabusId } : {};
    const response = await api.get('/grades', { params });
    return response.data;
};

export const getGradesForGroup = async (groupId: number, syllabusId?: number) => {
    const params = { groupId, ...(syllabusId ? { syllabusId } : {}) };
    const response = await api.get('/grades', { params });
    return response.data;
};

export const createLessonGrade = async (data: LessonGrade) => {
    const response = await api.post('/grades/lesson', data);
    return response.data;
};

export const createHomeworkGrade = async (data: HomeworkGrade) => {
    const response = await api.post('/grades/homework', data);
    return response.data;
};

export const updateLessonGrade = async (id: number, data: Partial<LessonGrade>) => {
    const response = await api.patch(`/grades/lesson/${id}`, data);
    return response.data;
};

export const updateHomeworkGrade = async (id: number, data: Partial<HomeworkGrade>) => {
    const response = await api.patch(`/grades/homework/${id}`, data);
    return response.data;
};

// Function to calculate average grade from lesson and homework grades
export const calculateAverageGrade = (lessonGrade?: number, homeworkGrade?: number): number | undefined => {
    if (lessonGrade === undefined && homeworkGrade === undefined) {
        return undefined;
    }

    let sum = 0;
    let count = 0;

    if (lessonGrade !== undefined) {
        sum += lessonGrade;
        count++;
    }

    if (homeworkGrade !== undefined) {
        sum += homeworkGrade;
        count++;
    }

    return count > 0 ? Math.round(sum / count) : undefined;
};

// Function to create or update a grade for a lesson and/or homework
export const saveGrade = async (data: GradeUpdateDto) => {
    console.log('Sending grade data to server:', data);
    const response = await api.post('/grades', data);
    return response.data;
}; 
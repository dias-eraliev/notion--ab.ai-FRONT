export interface IUser {
    id: number;
    username: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
    role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";
}

export interface IGroup {
    id: number;
    name: string;
    syllabusId: number;
    courseNumber: number;
    createdAt: string;
    updatedAt: string;
    teacherId: number | null;
}

export interface IParent {
    id: number;
    userId: number;
    relation: string;
    createdAt: string;
    updatedAt: string;
    user: IUser;
}

export interface ISyllabus {
    id: number;
    name: string;
    description: string;
    teacherId: number;
    courseNumber: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface ILesson {
    id: number;
    name: string;
    description: string;
    syllabusId: number;
    date: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IAttendance {
    id: number;
    studentId: number;
    lessonId: number;
    status: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    lesson: ILesson;
}

export interface ILessonGrade {
    id: number;
    studentId: number;
    lessonId: number;
    grade: number;
    createdAt: string;
    updatedAt: string;
    lesson: ILesson;
}

export interface IHomework {
    id: number;
    name: string;
    materialId: number;
    lessonId: number;
    date: string | null;
    description: string | null;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
    Lesson: ILesson;
}

export interface IHomeworkGrade {
    id: number;
    studentId: number;
    homeworkId: number;
    grade: number;
    createdAt: string;
    updatedAt: string;
    homework: IHomework;
}

export interface IStudent {
    id: number;
    userId: number;
    name: string;
    surname: string;
    relation: string
    lastname: string | null;
    status: string | null;
    groupId: number;
    parentId: number;
    createdAt: string;
    updatedAt: string;
    syllabusId: number;
    courseNumber: number;
    user: IUser;
    group: IGroup;
    Parent: IParent;
    Syllabus: ISyllabus;
    payments: any[]; // Пока нет данных о структуре платежей
    Attendance: IAttendance[];
    lessonGrades: ILessonGrade[];
    homeworkGrades: IHomeworkGrade[];
}

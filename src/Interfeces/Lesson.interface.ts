export interface ILesson {
    id: string;
    subject: string;
    teacher: string;
    time: string;
    duration: string;
    room: string;
    type: 'lecture' | 'practice' | 'lab' | 'exam';
    homework?: string;
    materials?: string[];
}
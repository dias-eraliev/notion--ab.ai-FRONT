import {ILesson} from "@/Interfeces/Lesson.interface.ts";

export const getTypeText = (type: ILesson['type']) => {
    switch (type) {
        case 'lecture':
            return 'Лекция';
        case 'practice':
            return 'Практика';
        case 'lab':
            return 'Лаборатория';
        case 'exam':
            return 'Экзамен';
        default:
            return type;
    }
};
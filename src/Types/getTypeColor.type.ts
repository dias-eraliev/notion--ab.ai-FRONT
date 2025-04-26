import {ILesson} from "@/Interfeces/Lesson.interface.ts";

export const getTypeColor = (type: ILesson['type']) => {
    switch (type) {
        case 'lecture':
            return 'bg-blue-50 text-blue-700';
        case 'practice':
            return 'bg-green-50 text-green-700';
        case 'lab':
            return 'bg-purple-50 text-purple-700';
        case 'exam':
            return 'bg-red-50 text-red-700';
        default:
            return 'bg-gray-50 text-gray-700';
    }
};
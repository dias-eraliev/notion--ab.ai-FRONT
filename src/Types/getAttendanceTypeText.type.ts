import {IAttendance} from "@/Interfeces/Attendance.interface.ts";

export const getAttendanceTypeText = (type: IAttendance['type']) => {
    switch (type) {
        case 'presence':
            return 'Присутствие';
        case 'absence':
            return 'Отсутствие';
        case 'late':
            return 'Опоздание';
        case 'medical':
            return 'Мед. пункт';
        case 'excused':
            return 'Уважительная';
        default:
            return type;
    }
};
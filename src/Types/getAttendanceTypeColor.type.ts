import {IAttendance} from "@/Interfeces/Attendance.interface.ts";

export const getAttendanceTypeColor = (type: IAttendance['type']) => {
    switch (type) {
        case 'presence':
            return 'bg-green-100 text-green-800';
        case 'absence':
            return 'bg-red-100 text-red-800';
        case 'late':
            return 'bg-yellow-100 text-yellow-800';
        case 'medical':
            return 'bg-blue-100 text-blue-800';
        case 'excused':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
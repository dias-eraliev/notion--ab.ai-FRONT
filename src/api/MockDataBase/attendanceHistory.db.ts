import {IAttendance} from "@/Interfeces/Attendance.interface.ts";

export const attendanceHistory: IAttendance[] = [
    {
        date: '2024-03-15',
        type: 'medical',
        time: '10:30',
        reason: 'Головная боль',
        status: 'Подтверждено',
        approvedBy: 'Асанова А.К.',
        duration: '2 часа',
        comment: 'Отправлен домой после приема лекарств'
    },
    {
        date: '2024-03-14',
        type: 'late',
        time: '09:15',
        subject: 'Математика',
        duration: '15 минут',
        comment: 'Опоздание по причине транспортных проблем'
    },
    {
        date: '2024-03-10',
        type: 'excused',
        reason: 'Семейные обстоятельства',
        status: 'Одобрено',
        approvedBy: 'Классный руководитель',
        duration: 'Полный день',
        comment: 'Заявление от родителей предоставлено'
    },
    {
        date: '2024-02-20',
        type: 'medical',
        time: '11:45',
        reason: 'Плановый осмотр',
        status: 'Подтверждено',
        approvedBy: 'Асанова А.К.',
        duration: '1 час',
        comment: 'Профилактический осмотр пройден успешно'
    },
    {
        date: '2024-02-15',
        type: 'absence',
        reason: 'ОРВИ',
        status: 'Подтверждено',
        approvedBy: 'Мед. справка',
        duration: '5 дней',
        comment: 'Справка от врача предоставлена'
    }
];
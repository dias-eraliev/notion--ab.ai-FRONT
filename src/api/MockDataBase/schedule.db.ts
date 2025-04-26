// Расписание

import {IDaySchedule} from "@/Interfeces/DaySchedule.interface.ts";

export const schedule: IDaySchedule[] = [
    {
        date: '2024-03-25',
        dayOfWeek: 'Понедельник',
        lessons: [
            {
                id: '1',
                subject: 'Математика',
                teacher: 'Жасмин Алимова',
                time: '09:00 - 09:45',
                duration: '45 мин',
                room: '204',
                type: 'lecture'
            },
            {
                id: '2',
                subject: 'Английский',
                teacher: 'Аяжан Бекмуратова',
                time: '09:45 - 10:30',
                duration: '45 мин',
                room: '305',
                type: 'practice'
            },
            {
                id: '3',
                subject: 'Компьютер',
                teacher: 'Даниял Кенжебаев',
                time: '10:45 - 11:30',
                duration: '45 мин',
                room: '401',
                type: 'lab'
            },
            {
                id: '4',
                subject: 'Испанский',
                teacher: 'Эрик Латипов',
                time: '11:30 - 12:15',
                duration: '45 мин',
                room: '302',
                type: 'practice'
            },
            {
                id: '5',
                subject: 'Наука',
                teacher: 'Мақпал Сагинтаева',
                time: '13:30 - 14:15',
                duration: '45 мин',
                room: '205',
                type: 'lecture'
            }
        ]
    },
    // ... остальные дни недели ...
];
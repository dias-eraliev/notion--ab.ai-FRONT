import {IGradeData} from "@/Interfeces/GradeData.interface.ts";

export const gradesData: IGradeData[] = [
    {
        subject: 'Математика',
        currentGrade: 4.8,
        previousGrade: 4.5,
        averageGrade: 4.6,
        trend: 'up',
        teacherName: 'Жумабаева А.К.',
        lastUpdate: '2024-03-20',
        assignments: [
            {type: 'Контрольная работа', grade: 5, date: '2024-03-15', topic: 'Тригонометрия'},
            {type: 'Домашняя работа', grade: 4, date: '2024-03-10', topic: 'Логарифмы'},
            {type: 'Тест', grade: 5, date: '2024-03-05', topic: 'Производные'}
        ]
    },
    {
        subject: 'Физика',
        currentGrade: 4.5,
        previousGrade: 4.2,
        averageGrade: 4.3,
        trend: 'up',
        teacherName: 'Сериков Б.М.',
        lastUpdate: '2024-03-18',
        assignments: [
            {type: 'Лабораторная работа', grade: 5, date: '2024-03-14', topic: 'Электричество'},
            {type: 'Проект', grade: 4, date: '2024-03-08', topic: 'Механика'},
            {type: 'Контрольная работа', grade: 4, date: '2024-03-01', topic: 'Оптика'}
        ]
    },
    {
        subject: 'Химия',
        currentGrade: 4.2,
        previousGrade: 4.4,
        averageGrade: 4.3,
        trend: 'down',
        teacherName: 'Алтынбекова Г.С.',
        lastUpdate: '2024-03-19',
        assignments: [
            {type: 'Практическая работа', grade: 4, date: '2024-03-16', topic: 'Кислоты и основания'},
            {type: 'Тест', grade: 4, date: '2024-03-09', topic: 'Металлы'},
            {type: 'Домашняя работа', grade: 5, date: '2024-03-02', topic: 'Органическая химия'}
        ]
    }
];
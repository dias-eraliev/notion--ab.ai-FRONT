// Данные для дополнительного образования
import {IExtracurricularActivity} from "@/Interfeces/ExtracurricularActivity.interface.ts";

export const extracurricularActivities: IExtracurricularActivity[] = [
    {
        id: '1',
        type: 'club',
        name: 'Робототехника',
        description: 'Изучение основ робототехники и программирования',
        schedule: 'Понедельник и Среда 16:00-18:00',
        teacher: 'Иванов А.П.',
        location: 'Кабинет 205',
        startDate: '2024-01-15',
        status: 'active',
        skills: ['Arduino', 'Программирование', 'Электроника', '3D-моделирование'],
        members: 15,
        image: 'robotics.jpg',
        achievements: [
            {
                id: 'r1',
                title: 'Победитель городского конкурса по робототехнике',
                date: '2024-03-15',
                typeAchievement: 'competition',
                description: 'Первое место в категории "Автономные роботы"',
                issuer: 'Городской центр технического творчества',
                place: '1 место'
            }
        ]
    },
    {
        id: '2',
        type: 'organization',
        name: 'Химический клуб',
        description: 'Углубленное изучение химии и проведение экспериментов',
        schedule: 'Суббота 10:00-12:00',
        teacher: 'Петрова М.С.',
        location: 'Лаборатория 302',
        startDate: '2024-02-10',
        status: 'active',
        skills: ['Химия', 'Лабораторные работы', 'Анализ данных'],
        members: 12,
        image: 'chemistry.jpg',
        achievements: [
            {
                id: 'c1',
                title: 'Диплом за научный проект',
                date: '2024-03-10',
                typeAchievement: 'certificate',
                description: 'Исследование качества воды в городских водоемах',
                issuer: 'Научное общество учащихся',
                place: 'Региональный уровень'
            }
        ]
    },
    {
        id: '3',
        type: 'course',
        name: 'Web-разработка',
        description: 'Создание современных веб-приложений',
        schedule: 'Вторник и Четверг 18:00-20:00',
        teacher: 'Смирнов Д.И.',
        location: 'Online',
        startDate: '2024-03-05',
        status: 'active',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        members: 20,
        image: 'web-dev.jpg',
        achievements: [
            {
                id: 'w1',
                title: 'Лучший проект курса',
                date: '2024-04-15',
                typeAchievement: 'award',
                description: 'Разработка социальной сети для школьников',
                issuer: 'IT-Academy',
                place: 'Топ-3'
            }
        ]
    },
    {
        id: '4',
        type: 'olympiad',
        name: 'Олимпиада по математике',
        description: 'Подготовка и участие в городской олимпиаде',
        schedule: 'Пятница 15:00-17:00',
        teacher: 'Николаева Е.В.',
        location: 'Кабинет 401',
        startDate: '2024-01-20',
        status: 'completed',
        skills: ['Алгебра', 'Геометрия', 'Логика', 'Теория чисел'],
        members: 25,
        image: 'math.jpg',
        achievements: [
            {
                id: 'm1',
                title: 'Призер городской олимпиады',
                date: '2024-02-28',
                typeAchievement: 'competition',
                description: 'Второе место в личном зачете',
                issuer: 'Городской департамент образования',
                place: '2 место'
            }
        ]
    },
    {
        id: '5',
        type: 'club',
        name: 'Дебатный клуб',
        description: 'Развитие навыков публичных выступлений и аргументации',
        schedule: 'Среда 16:30-18:30',
        teacher: 'Кузнецова А.А.',
        location: 'Актовый зал',
        startDate: '2024-02-01',
        status: 'active',
        skills: ['Ораторское искусство', 'Критическое мышление', 'Аргументация'],
        members: 18,
        image: 'debate.jpg',
        achievements: [
            {
                id: 'd1',
                title: 'Победа в городском турнире',
                date: '2024-03-20',
                typeAchievement: 'competition',
                description: 'Лучший спикер турнира',
                issuer: 'Ассоциация дебатных клубов',
                place: '1 место'
            }
        ]
    }
];
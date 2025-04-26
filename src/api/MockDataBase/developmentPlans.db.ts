import {IDevelopmentPlan} from "@/Interfeces/DevelopmentPlan.interface.ts";

export const developmentPlans: IDevelopmentPlan[] = [
    {
        goal: 'Улучшение навыков решения олимпиадных задач',
        subject: 'Математика',
        currentLevel: 75,
        targetLevel: 90,
        deadline: '2024-05-01',
        status: 'in_progress',
        tasks: [
            {
                title: 'Решение задач повышенной сложности',
                deadline: '2024-04-01',
                status: 'in_progress',
                description: 'Ежедневное решение 2-3 олимпиадных задач'
            },
            {
                title: 'Участие в математическом кружке',
                deadline: '2024-04-15',
                status: 'completed',
                description: 'Регулярное посещение занятий математического кружка'
            }
        ],
        mentor: 'Жумабаева А.К.'
    },
    {
        goal: 'Подготовка к республиканской олимпиаде',
        subject: 'Физика',
        currentLevel: 65,
        targetLevel: 85,
        deadline: '2024-06-01',
        status: 'in_progress',
        tasks: [
            {
                title: 'Изучение теоретического материала',
                deadline: '2024-04-20',
                status: 'in_progress',
                description: 'Изучение базовых тем и формул'
            },
            {
                title: 'Практические занятия',
                deadline: '2024-05-01',
                status: 'in_progress',
                description: 'Решение задач и подготовка к олимпиаде'
            }
        ],
        mentor: 'Сериков Б.М.'
    },
    {
        goal: 'Повышение уровня знаний по химии',
        subject: 'Химия',
        currentLevel: 70,
        targetLevel: 85,
        deadline: '2024-07-01',
        status: 'in_progress',
        tasks: [
            {
                title: 'Изучение новых тем и формул',
                deadline: '2024-05-15',
                status: 'in_progress',
                description: 'Изучение новых тем и формул'
            },
            {
                title: 'Решение задач и подготовка к экзаменам',
                deadline: '2024-06-15',
                status: 'in_progress',
                description: 'Решение задач и подготовка к экзаменам'
            }
        ],
        mentor: 'Алтынбекова Г.С.'
    }
];
// данные экзаменов

import {IExamResult} from "@/Interfeces/ExamResult.interface.ts";

export const examResults: IExamResult[] = [
    {
        subject: 'Английский',
        code: '150',
        maxScore: 100,
        minScore: 35,
        score: 65,
        result: 'Сдано',
        examType: 'Ежемесячный тест (Май)',
        date: '2024/2025',
        classAverageScore: 62,
        details: {
            topics: [
                {
                    name: 'Грамматика',
                    score: 25,
                    maxScore: 30,
                    mistakes: ['Present Perfect vs Past Simple', 'Articles']
                },
                {name: 'Чтение', score: 15, maxScore: 20},
                {name: 'Аудирование', score: 15, maxScore: 25, mistakes: ['Understanding context']},
                {name: 'Письмо', score: 10, maxScore: 25, mistakes: ['Essay structure', 'Vocabulary usage']}
            ],
            examiner: 'Бекмуратова А.К.',
            duration: '120 минут',
            location: 'Кабинет 305',
            notes: 'Хорошее понимание грамматики, требуется улучшение письменных навыков'
        }
    },
    {
        subject: 'Математика',
        code: '214',
        maxScore: 100,
        minScore: 35,
        score: 73,
        result: 'Сдано',
        examType: 'Ежемесячный тест (Май)',
        date: '2024/2025',
        classAverageScore: 68,
        details: {
            topics: [
                {name: 'Алгебра', score: 35, maxScore: 40},
                {name: 'Геометрия', score: 28, maxScore: 40, mistakes: ['Теорема Пифагора']},
                {name: 'Логика', score: 10, maxScore: 20, mistakes: ['Сложные уравнения']}
            ],
            examiner: 'Жумабаева А.К.',
            duration: '180 минут',
            location: 'Кабинет 204',
            notes: 'Сильные результаты в алгебре, требуется дополнительная работа по геометрии'
        }
    },
    {
        subject: 'Физика',
        code: '120',
        maxScore: 100,
        minScore: 35,
        score: 55,
        result: 'Сдано',
        examType: 'Ежемесячный тест (Май)',
        date: '2024/2025'
    },
    {
        subject: 'Химия',
        code: '110',
        maxScore: 100,
        minScore: 35,
        score: 90,
        result: 'Сдано',
        examType: 'Ежемесячный тест (Май)',
        date: '2024/2025'
    },
    {
        subject: 'Испанский',
        code: '140',
        maxScore: 100,
        minScore: 35,
        score: 88,
        result: 'Сдано',
        examType: 'Ежемесячный тест (Май)',
        date: '2024/2025'
    }
];

export const examSummary = {
    totalExams: 5,
    passed: 5,
    failed: 0,
    averageScore: 74.2,
    totalScore: 395,
    maxPossibleScore: 500,
    ranking: 30,
    percentage: 79.50
};


export const examTypes = [
    {id: 'monthly', label: 'Ежемесячный тест'},
    {id: 'quarter', label: 'Четвертная контрольная'},
    {id: 'final', label: 'Итоговый экзамен'},
    {id: 'olympiad', label: 'Олимпиада'}
];
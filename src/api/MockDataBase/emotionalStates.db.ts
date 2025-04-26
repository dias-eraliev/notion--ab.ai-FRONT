import {IEmotionalState} from "@/Interfeces/EmotionalState.interface.ts";

export const emotionalStates: IEmotionalState[] = [
    {
        category: 'Общее настроение',
        score: 85,
        description: 'Позитивное, стабильное настроение',
        trend: 'up',
        lastUpdate: '2024-03-20'
    },
    {
        category: 'Концентрация',
        score: 75,
        description: 'Хорошая фокусировка на занятиях',
        trend: 'stable',
        lastUpdate: '2024-03-20'
    },
    {
        category: 'Социализация',
        score: 90,
        description: 'Отличное взаимодействие с одноклассниками',
        trend: 'up',
        lastUpdate: '2024-03-20'
    },
    {
        category: 'Учебная мотивация',
        score: 80,
        description: 'Высокий интерес к обучению',
        trend: 'stable',
        lastUpdate: '2024-03-20'
    }
];
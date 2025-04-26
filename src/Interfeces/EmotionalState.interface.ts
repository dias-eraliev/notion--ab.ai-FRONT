export interface IEmotionalState {
    category: string;
    score: number;
    description: string;
    trend: 'up' | 'down' | 'stable';
    lastUpdate: string;
}
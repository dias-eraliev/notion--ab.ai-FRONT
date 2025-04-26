export interface IDateFilter {
    type: 'day' | 'week' | 'month' | 'quarter';
    value: string;
}
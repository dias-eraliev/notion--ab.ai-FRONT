import {IAbsence} from "@/Interfeces/Absence.interface.ts";

export const absences: IAbsence[] = [
    {
        date: '2024-03-10',
        type: 'Отгул',
        reason: 'Семейные обстоятельства',
        status: 'Одобрено',
        approvedBy: 'Классный руководитель'
    },
    {
        date: '2024-02-15',
        type: 'Больничный',
        reason: 'ОРВИ',
        status: 'Подтверждено',
        approvedBy: 'Мед. справка'
    }
];
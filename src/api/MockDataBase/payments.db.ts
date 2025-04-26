// данные для финансов


import {IPayment} from "@/Interfeces/Payment.interface.ts";

export const payments: IPayment[] = [
    {
        id: '#435453',
        amount: 2500,
        date: '03 Apr 2024',
        dueDate: '10 Май 2024',
        status: 'оплачено',
        type: 'apr-month-fees',
        description: 'Группа МК24-1М Общие (Плата за Апрель)',
        discount: 10,
        paymentMethod: 'Наличные'
    },
    {
        id: '#435443',
        amount: 2500,
        date: '05 Янв 2024',
        dueDate: '10 Янв 2024',
        status: 'оплачено',
        type: 'dec-month-fees',
        description: 'Группа МК24-1М Общие (Плата за Декабрь)',
        discount: 10,
        paymentMethod: 'Наличные'
    },
    {
        id: '#435449',
        amount: 2500,
        date: '01 Apr 2024',
        dueDate: '10 Apr 2024',
        status: 'оплачено',
        type: 'jul-month-fees',
        description: 'Группа МК24-1М Общие (Плата за Июль)',
        discount: 10,
        penalty: 200,
        paymentMethod: 'Наличные'
    }
];

export const financialSummary = {
    totalPaid: 25000,
    pendingPayments: 2500,
    totalDiscount: 2500,
    totalPenalty: 400
};

export const paymentTrends = [
    {month: 'Янв', sum: 2500, discount: 250},
    {month: 'Фев', sum: 2500, discount: 250},
    {month: 'Мар', sum: 2500, discount: 250},
    {month: 'Апр', sum: 2500, discount: 250}
];
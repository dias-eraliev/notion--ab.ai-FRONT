export interface IPayment {
    id: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'оплачено' | 'не оплачено' | 'просрочено';
    type: string;
    description: string;
    discount?: number;
    penalty?: number;
    paymentMethod?: string;
}
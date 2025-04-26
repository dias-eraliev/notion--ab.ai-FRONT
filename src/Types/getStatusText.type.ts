export const getStatusText = (status: string) => {
    switch (status) {
        case 'completed':
            return 'Выполнено';
        case 'in_progress':
            return 'В процессе';
        case 'not_started':
            return 'Не начато';
        default:
            return status;
    }
};
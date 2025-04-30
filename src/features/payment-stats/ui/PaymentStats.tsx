import { Payment } from "../../../shared/types/payment";

export const PaymentStats = ({ payments }: { payments: Payment[] }) => {
  const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const collected = payments.reduce((sum, p) => {
    if (p.status === "PAID") return sum + parseFloat(p.amount);
    if (p.status === "PARTIALLY_PAID") return sum + parseFloat(p.amount) / 2; // Пример
    return sum;
  }, 0);
  const percent = total ? Math.round((collected / total) * 100) : 0;
  const overdue = payments.filter(p => p.status === "OVERDUE").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-gray-400 p-4 rounded shadow">Общий объем: {total}₸</div>
      <div className="bg-gray-400 p-4 rounded shadow">Фактически получено: {collected}₸</div>
      <div className="bg-gray-400 p-4 rounded shadow">
        Процент выполнения:
        <div className="h-2 bg-gray-200 mt-2 rounded">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span>{percent}%</span>
      </div>
      <div className="bg-gray-400 p-4 rounded shadow">Просрочено: {overdue}</div>
    </div>
  );
};

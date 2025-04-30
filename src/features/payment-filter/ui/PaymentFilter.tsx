import { useState } from "react";

type Props = {
  onChange: (filters: Record<string, any>) => void;
};

export const PaymentFilter = ({ onChange }: Props) => {
  const [dateRange, setDateRange] = useState("");
  const [direction, setDirection] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = () => {
    onChange({
      dateRange,
      direction,
      type,
      status,
      searchTerm,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        className="border p-2 rounded bg-gray-200 text-black    "
      >
        <option value="">Диапазон дат</option>
        <option value="thisMonth">Текущий месяц</option>
        <option value="lastMonth">Прошлый месяц</option>
        <option value="thisQuarter">Текущий квартал</option>
      </select>

      <select
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        className="border p-2 rounded bg-gray-200 text-black"
      >
        <option value="">Все платежи</option>
        <option value="INCOME">Приходы</option>
        <option value="EXPENSE">Расходы</option>
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded bg-gray-200 text-black"
      >
        <option value="">Тип платежа</option>
        <option value="TUITION">Оплата обучения</option>
        <option value="SALARY">Зарплата</option>
        <option value="OPERATIONAL">Операционные расходы</option>
        <option value="OTHER">Другое</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded bg-gray-200 text-black"
      >
        <option value="">Все статусы</option>
        <option value="PAID">Оплачено</option>
        <option value="UNPAID">Не оплачено</option>
        <option value="PARTIALLY_PAID">Частично оплачено</option>
        <option value="OVERDUE">Просрочено</option>
      </select>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
        placeholder="Поиск по студенту"
      />

      <button onClick={handleFilterChange} className="bg-blue-500 text-white p-2 rounded">
        Применить фильтр
      </button>
    </div>
  );
};

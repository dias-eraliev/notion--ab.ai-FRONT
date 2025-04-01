import React, { useState } from 'react';
import { 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaUserCheck, 
  FaFileExport,
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaTimes
} from 'react-icons/fa';

// Типы данных
type VacationType = 'vacation' | 'sick-leave' | 'maternity-leave' | 'unpaid-leave' | 'business-trip';
type VacationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface Vacation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  type: VacationType;
  startDate: string;
  endDate: string;
  days: number;
  status: VacationStatus;
  substituteId?: string;
  substituteName?: string;
  comment?: string;
  documents?: string[];
}

interface VacationSummary {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  sickLeaveDays: number;
}

// Данные для демонстрации
const initialVacations: Vacation[] = [
  {
    id: 'v001',
    employeeId: '001',
    employeeName: 'Иванов Иван Иванович',
    department: 'Кафедра математики',
    position: 'Учитель математики',
    type: 'vacation',
    startDate: '2024-06-15',
    endDate: '2024-07-12',
    days: 28,
    status: 'approved',
    substituteId: '005',
    substituteName: 'Смирнов Дмитрий Игоревич',
    comment: 'Плановый отпуск'
  },
  {
    id: 'v002',
    employeeId: '002',
    employeeName: 'Петрова Мария Сергеевна',
    department: 'Кафедра филологии',
    position: 'Учитель русского языка',
    type: 'vacation',
    startDate: '2024-07-01',
    endDate: '2024-07-28',
    days: 28,
    status: 'pending',
    comment: 'Плановый отпуск'
  },
  {
    id: 'v003',
    employeeId: '003',
    employeeName: 'Сидоров Алексей Петрович',
    department: 'Кафедра естественных наук',
    position: 'Учитель физики',
    type: 'sick-leave',
    startDate: '2024-03-10',
    endDate: '2024-03-17',
    days: 8,
    status: 'completed',
    comment: 'Больничный лист №12345'
  },
  {
    id: 'v004',
    employeeId: '004',
    employeeName: 'Кузнецова Ольга Александровна',
    department: 'Кафедра иностранных языков',
    position: 'Учитель английского языка',
    type: 'business-trip',
    startDate: '2024-04-05',
    endDate: '2024-04-09',
    days: 5,
    status: 'completed',
    comment: 'Повышение квалификации в Москве'
  },
  {
    id: 'v005',
    employeeId: '005',
    employeeName: 'Смирнов Дмитрий Игоревич',
    department: 'Кафедра информатики',
    position: 'Учитель информатики',
    type: 'sick-leave',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    days: 14,
    status: 'completed',
    comment: 'Больничный лист №67890'
  }
];

const vacationSummaries: VacationSummary[] = [
  {
    employeeId: '001',
    employeeName: 'Иванов Иван Иванович',
    totalDays: 28,
    usedDays: 28,
    remainingDays: 0,
    sickLeaveDays: 5
  },
  {
    employeeId: '002',
    employeeName: 'Петрова Мария Сергеевна',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 0
  },
  {
    employeeId: '003',
    employeeName: 'Сидоров Алексей Петрович',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 8
  },
  {
    employeeId: '004',
    employeeName: 'Кузнецова Ольга Александровна',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 0
  },
  {
    employeeId: '005',
    employeeName: 'Смирнов Дмитрий Игоревич',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 14
  }
];

const VacationPage: React.FC = () => {
  const [vacations, setVacations] = useState<Vacation[]>(initialVacations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<VacationType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<VacationStatus | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'summary'>('current');

  // Типы отпусков и замен для интерфейса
  const vacationTypes = [
    { value: 'vacation', label: 'Отпуск' },
    { value: 'sick-leave', label: 'Больничный' },
    { value: 'maternity-leave', label: 'Декретный отпуск' },
    { value: 'unpaid-leave', label: 'Отпуск без сохранения ЗП' },
    { value: 'business-trip', label: 'Командировка' }
  ];

  const statusTypes = [
    { value: 'pending', label: 'На рассмотрении' },
    { value: 'approved', label: 'Утверждено' },
    { value: 'rejected', label: 'Отклонено' },
    { value: 'completed', label: 'Завершено' }
  ];

  // Фильтрация данных
  const filteredVacations = vacations.filter(vacation => {
    const matchesSearch = 
      vacation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vacation.substituteName && vacation.substituteName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || vacation.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || vacation.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Обработчики событий
  const handleVacationClick = (vacation: Vacation) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };

  // Вспомогательные функции для отображения
  const getStatusBadgeClass = (status: VacationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeBadgeClass = (type: VacationType) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-100 text-blue-800';
      case 'sick-leave':
        return 'bg-red-100 text-red-800';
      case 'maternity-leave':
        return 'bg-purple-100 text-purple-800';
      case 'unpaid-leave':
        return 'bg-gray-100 text-gray-800';
      case 'business-trip':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: VacationStatus) => {
    return statusTypes.find(type => type.value === status)?.label || status;
  };

  const getTypeLabel = (type: VacationType) => {
    return vacationTypes.find(t => t.value === type)?.label || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getStatusIcon = (status: VacationStatus) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'approved':
        return <FaCheck className="text-green-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      case 'completed':
        return <FaUserCheck className="text-blue-500" />;
    }
  };

  const getTypeIcon = (type: VacationType) => {
    switch (type) {
      case 'vacation':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'sick-leave':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'maternity-leave':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'unpaid-leave':
        return <FaCalendarAlt className="text-gray-500" />;
      case 'business-trip':
        return <FaCalendarAlt className="text-green-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Отпуска и замены</h1>
          <p className="text-sm text-gray-500">Управление отпусками, больничными и заменами преподавателей</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
            <FaPlus className="mr-2" />
            Новая заявка
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center">
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'current'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Текущие отпуска и замены
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'summary'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Сводка по сотрудникам
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'current' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as VacationType | 'all')}
                >
                  <option value="all">Все типы</option>
                  {vacationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as VacationStatus | 'all')}
                >
                  <option value="all">Все статусы</option>
                  {statusTypes.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="current-year">Текущий год</option>
                <option value="next-year">Следующий год</option>
                <option value="previous-year">Предыдущий год</option>
              </select>
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сотрудник
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата начала
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата окончания
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дней
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Замена
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVacations.map((vacation) => (
                  <tr 
                    key={vacation.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleVacationClick(vacation)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vacation.employeeName}</div>
                      <div className="text-xs text-gray-500">{vacation.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(vacation.type)}`}>
                        {getTypeLabel(vacation.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(vacation.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(vacation.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {vacation.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vacation.substituteName || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vacation.status)}`}>
                        {getStatusLabel(vacation.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сотрудник
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Всего дней отпуска
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Использовано
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Осталось
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дней на больничном
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vacationSummaries.map((summary) => (
                <tr key={summary.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{summary.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.totalDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.usedDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        summary.remainingDays === 0 ? 'text-red-600' : 
                        summary.remainingDays < 14 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {summary.remainingDays}
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            summary.remainingDays === 0 ? 'bg-red-500' : 
                            summary.remainingDays < 14 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${(summary.remainingDays / summary.totalDays) * 100}%` }}>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {summary.sickLeaveDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно с деталями заявки на отпуск */}
      {isModalOpen && selectedVacation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    {getTypeIcon(selectedVacation.type)}
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeClass(selectedVacation.type)}`}>
                      {getTypeLabel(selectedVacation.type)}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedVacation.employeeName}</h2>
                    <p className="text-sm text-gray-600">{selectedVacation.department} • {selectedVacation.position}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Период</div>
                  <div className="flex items-center text-gray-900">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span>
                      {formatDate(selectedVacation.startDate)} — {formatDate(selectedVacation.endDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Статус</div>
                  <div className="flex items-center">
                    {getStatusIcon(selectedVacation.status)}
                    <span className={`ml-2 ${
                      selectedVacation.status === 'approved' ? 'text-green-600' :
                      selectedVacation.status === 'rejected' ? 'text-red-600' :
                      selectedVacation.status === 'pending' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {getStatusLabel(selectedVacation.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Количество дней</div>
                <div className="text-2xl font-bold text-gray-900">{selectedVacation.days}</div>
              </div>

              {selectedVacation.substituteName && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Замещающий сотрудник</div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaUserCheck className="text-green-500 mr-2" />
                      <span className="font-medium">{selectedVacation.substituteName}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedVacation.comment && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Комментарий</div>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {selectedVacation.comment}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                {selectedVacation.status === 'pending' && (
                  <>
                    <button className="px-4 py-2 bg-red-50 text-red-700 rounded-md mr-2">
                      Отклонить
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Утвердить
                    </button>
                  </>
                )}
                {selectedVacation.status === 'approved' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Изменить
                  </button>
                )}
                {selectedVacation.status === 'rejected' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Создать новую заявку
                  </button>
                )}
                {selectedVacation.status === 'completed' && (
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
                    Документы
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacationPage; 
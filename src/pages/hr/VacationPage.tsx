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
  FaTimes,
  FaCalculator,
  FaBook,
  FaChalkboardTeacher,
  FaTrophy,
  FaUserGraduate
} from 'react-icons/fa';

// Типы данных
type VacationType = 'vacation' | 'sick-leave' | 'maternity-leave' | 'unpaid-leave' | 'business-trip' | 'olympiad-trip' | 'math-conference';
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
  affectedGroups?: string[];
  olympiadName?: string;
  olympiadLocation?: string;
  studentsCount?: number;
  requiresMaterials?: boolean;
}

interface VacationSummary {
  employeeId: string;
  employeeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  sickLeaveDays: number;
  olympiadDays?: number;
  conferenceDays?: number;
}

interface Substitute {
  id: string;
  name: string;
  department: string;
  position: string;
  availableHours: number;
  subjects: string[];
  experience: number;
}

// Данные для демонстрации
const initialVacations: Vacation[] = [
  {
    id: 'v001',
    employeeId: '001',
    employeeName: 'Сатпаев Арман Болатович',
    department: 'Кафедра математики',
    position: 'Преподаватель высшей математики',
    type: 'vacation',
    startDate: '2024-06-15',
    endDate: '2024-07-12',
    days: 28,
    status: 'approved',
    substituteId: '005',
    substituteName: 'Жумабаев Данияр Игоревич',
    comment: 'Плановый отпуск',
    affectedGroups: ['10A', '10Б', '11A', '11Б']
  },
  {
    id: 'v002',
    employeeId: '002',
    employeeName: 'Нурланова Айгуль Муратовна',
    department: 'Кафедра математики',
    position: 'Преподаватель алгебры',
    type: 'vacation',
    startDate: '2024-07-01',
    endDate: '2024-07-28',
    days: 28,
    status: 'pending',
    comment: 'Плановый отпуск',
    affectedGroups: ['8А', '8Б', '9A', '9Б']
  },
  {
    id: 'v003',
    employeeId: '003',
    employeeName: 'Ким Дмитрий Алексеевич',
    department: 'Кафедра математики',
    position: 'Преподаватель геометрии',
    type: 'sick-leave',
    startDate: '2024-03-10',
    endDate: '2024-03-17',
    days: 8,
    status: 'completed',
    comment: 'Больничный лист №12345',
    affectedGroups: ['10A', '10Б', '11A', '11Б'],
    substituteId: '006',
    substituteName: 'Ахметова Сауле Нуржановна'
  },
  {
    id: 'v004',
    employeeId: '004',
    employeeName: 'Исмаилова Гульнара Александровна',
    department: 'Кафедра математики',
    position: 'Преподаватель математического анализа',
    type: 'math-conference',
    startDate: '2024-04-05',
    endDate: '2024-04-09',
    days: 5,
    status: 'completed',
    comment: 'Участие в международной конференции по математическому анализу',
    affectedGroups: ['11A', '11Б'],
    substituteId: '005',
    substituteName: 'Жумабаев Данияр Игоревич'
  },
  {
    id: 'v005',
    employeeId: '005',
    employeeName: 'Жумабаев Данияр Игоревич',
    department: 'Кафедра математики',
    position: 'Преподаватель теории чисел',
    type: 'olympiad-trip',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    days: 14,
    status: 'completed',
    comment: 'Сопровождение команды на Международную математическую олимпиаду',
    olympiadName: 'Международная математическая олимпиада',
    olympiadLocation: 'Париж, Франция',
    studentsCount: 6,
    requiresMaterials: true,
    affectedGroups: ['10A', '11A'],
    substituteId: '006',
    substituteName: 'Ахметова Сауле Нуржановна'
  },
  {
    id: 'v006',
    employeeId: '006',
    employeeName: 'Ахметова Сауле Нуржановна',
    department: 'Кафедра математики',
    position: 'Преподаватель алгебры и геометрии',
    type: 'olympiad-trip',
    startDate: '2024-05-10',
    endDate: '2024-05-15',
    days: 6,
    status: 'pending',
    comment: 'Сопровождение команды на Республиканскую олимпиаду по математике',
    olympiadName: 'Республиканская олимпиада по математике',
    olympiadLocation: 'Астана, Казахстан',
    studentsCount: 8,
    requiresMaterials: true,
    affectedGroups: ['9A', '9Б', '10Б']
  }
];

const vacationSummaries: VacationSummary[] = [
  {
    employeeId: '001',
    employeeName: 'Сатпаев Арман Болатович',
    totalDays: 28,
    usedDays: 28,
    remainingDays: 0,
    sickLeaveDays: 5,
    olympiadDays: 0,
    conferenceDays: 3
  },
  {
    employeeId: '002',
    employeeName: 'Нурланова Айгуль Муратовна',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 0,
    olympiadDays: 6,
    conferenceDays: 0
  },
  {
    employeeId: '003',
    employeeName: 'Ким Дмитрий Алексеевич',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 8,
    olympiadDays: 0,
    conferenceDays: 4
  },
  {
    employeeId: '004',
    employeeName: 'Исмаилова Гульнара Александровна',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 0,
    olympiadDays: 0,
    conferenceDays: 5
  },
  {
    employeeId: '005',
    employeeName: 'Жумабаев Данияр Игоревич',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 0,
    olympiadDays: 14,
    conferenceDays: 0
  },
  {
    employeeId: '006',
    employeeName: 'Ахметова Сауле Нуржановна',
    totalDays: 28,
    usedDays: 0,
    remainingDays: 28,
    sickLeaveDays: 3,
    olympiadDays: 6,
    conferenceDays: 2
  }
];

// Список возможных заместителей
const availableSubstitutes: Substitute[] = [
  {
    id: '005',
    name: 'Жумабаев Данияр Игоревич',
    department: 'Кафедра математики',
    position: 'Преподаватель теории чисел',
    availableHours: 10,
    subjects: ['Алгебра', 'Математический анализ', 'Теория чисел'],
    experience: 8
  },
  {
    id: '006',
    name: 'Ахметова Сауле Нуржановна',
    department: 'Кафедра математики',
    position: 'Преподаватель алгебры и геометрии',
    availableHours: 8,
    subjects: ['Алгебра', 'Геометрия', 'Олимпиадная математика'],
    experience: 6
  },
  {
    id: '007',
    name: 'Бектуров Аскар Муратович',
    department: 'Кафедра математики',
    position: 'Преподаватель дискретной математики',
    availableHours: 12,
    subjects: ['Дискретная математика', 'Алгебра', 'Математическая логика'],
    experience: 5
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
  const [activeTab, setActiveTab] = useState<'current' | 'summary' | 'substitutes'>('current');
  const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState(false);
  const [isNewVacationModalOpen, setIsNewVacationModalOpen] = useState(false);
  const [selectedSubstitute, setSelectedSubstitute] = useState<Substitute | null>(null);

  // Типы отпусков и замен для интерфейса
  const vacationTypes = [
    { value: 'vacation', label: 'Отпуск' },
    { value: 'sick-leave', label: 'Больничный' },
    { value: 'maternity-leave', label: 'Декретный отпуск' },
    { value: 'unpaid-leave', label: 'Отпуск без сохранения ЗП' },
    { value: 'business-trip', label: 'Командировка' },
    { value: 'olympiad-trip', label: 'Поездка на олимпиаду' },
    { value: 'math-conference', label: 'Математическая конференция' }
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
      (vacation.substituteName && vacation.substituteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vacation.olympiadName && vacation.olympiadName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || vacation.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || vacation.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Обработчики событий
  const handleVacationClick = (vacation: Vacation) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };

  const handleSubstituteClick = (substitute: Substitute) => {
    setSelectedSubstitute(substitute);
    setIsSubstituteModalOpen(true);
  };

  const handleNewVacation = () => {
    setIsNewVacationModalOpen(true);
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
      case 'olympiad-trip':
        return 'bg-indigo-100 text-indigo-800';
      case 'math-conference':
        return 'bg-teal-100 text-teal-800';
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
      case 'olympiad-trip':
        return <FaTrophy className="text-indigo-500" />;
      case 'math-conference':
        return <FaCalculator className="text-teal-500" />;
    }
  };

  // Компонент модального окна для просмотра и назначения заместителя
  const SubstituteModal = () => {
    if (!selectedSubstitute) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedSubstitute.name}</h2>
                <p className="text-sm text-gray-600">{selectedSubstitute.position} • {selectedSubstitute.department}</p>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsSubstituteModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Доступные часы в неделю</div>
                <div className="text-xl font-bold text-blue-600">{selectedSubstitute.availableHours} ч.</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Опыт работы</div>
                <div className="text-xl font-bold text-gray-900">{selectedSubstitute.experience} лет</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Преподаваемые предметы</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSubstitute.subjects.map((subject, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Текущие замены</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Преподаватель
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Период
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Причина
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Группы
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vacations
                    .filter(v => v.substituteId === selectedSubstitute.id && v.status !== 'rejected')
                    .map((v, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{v.employeeName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatDate(v.startDate)} - {formatDate(v.endDate)}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(v.type)}`}>
                            {getTypeLabel(v.type)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {v.affectedGroups?.map((group, gIdx) => (
                              <span 
                                key={gIdx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                              >
                                {group}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                onClick={() => setIsSubstituteModalOpen(false)}
              >
                Закрыть
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Назначить заместителем
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Компонент модального окна создания новой заявки на отпуск/отсутствие
  const NewVacationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Новая заявка на отсутствие</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsNewVacationModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
                  <select className="w-full border border-gray-300 rounded-md p-2">
                    <option value="">Выберите сотрудника</option>
                    {vacationSummaries.map(summary => (
                      <option key={summary.employeeId} value={summary.employeeId}>
                        {summary.employeeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип отсутствия</label>
                  <select className="w-full border border-gray-300 rounded-md p-2">
                    <option value="">Выберите тип</option>
                    {vacationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  rows={3}
                  placeholder="Укажите детали отсутствия"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Затрагиваемые группы</label>
                <div className="border border-gray-300 rounded-md p-2">
                  <div className="flex flex-wrap gap-2">
                    {['8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б'].map((group, idx) => (
                      <label key={idx} className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                        <span className="ml-2 text-sm text-gray-700">{group}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-semibold mb-3">Заместитель</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Выберите заместителя</label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Не назначать заместителя</option>
                      {availableSubstitutes.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} ({sub.availableHours} ч.)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Дополнительные поля для олимпиад */}
              <div className="border-t border-gray-200 pt-4 hidden">
                <h3 className="text-md font-semibold mb-3">Информация о олимпиаде</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название олимпиады</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Место проведения</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Количество учеников</label>
                      <input type="number" className="w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div className="flex items-center mt-7">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" id="requiresMaterials" />
                      <label htmlFor="requiresMaterials" className="ml-2 text-sm text-gray-700">
                        Требуются учебные материалы
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                  onClick={() => setIsNewVacationModalOpen(false)}
                >
                  Отмена
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Создать заявку
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Отпуска и замены</h1>
          <p className="text-sm text-gray-500">Управление отпусками, поездками на олимпиады и заменами преподавателей</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            onClick={handleNewVacation}
          >
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
            <button
              onClick={() => setActiveTab('substitutes')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'substitutes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Доступные заместители
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
                    Преподаватель
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
                  Преподаватель
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Олимпиады
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Конференции
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                    {summary.olympiadDays || 0} дн.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 font-medium">
                    {summary.conferenceDays || 0} дн.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'substitutes' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Преподаватель
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Специализация
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Предметы
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Доступные часы
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Опыт
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availableSubstitutes.map((substitute) => (
                <tr 
                  key={substitute.id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{substitute.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {substitute.position}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {substitute.subjects.map((subject, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {substitute.availableHours} ч/нед
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {substitute.experience} лет
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleSubstituteClick(substitute)}
                    >
                      Подробнее
                    </button>
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

              {/* Затрагиваемые группы */}
              {selectedVacation.affectedGroups && selectedVacation.affectedGroups.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Затрагиваемые группы</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVacation.affectedGroups.map((group, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Информация об олимпиаде */}
              {selectedVacation.type === 'olympiad-trip' && (
                <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaTrophy className="text-indigo-600 mr-2" />
                    <h3 className="text-lg font-semibold text-indigo-900">Информация об олимпиаде</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-indigo-800 w-32">Название:</span>
                      <span className="text-sm text-indigo-700">{selectedVacation.olympiadName}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-indigo-800 w-32">Место проведения:</span>
                      <span className="text-sm text-indigo-700">{selectedVacation.olympiadLocation}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-indigo-800 w-32">Учеников:</span>
                      <span className="text-sm text-indigo-700">{selectedVacation.studentsCount} чел.</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-indigo-800 w-32">Учебные материалы:</span>
                      <span className="text-sm text-indigo-700">{selectedVacation.requiresMaterials ? 'Требуются' : 'Не требуются'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Информация о конференции */}
              {selectedVacation.type === 'math-conference' && (
                <div className="mb-6 bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCalculator className="text-teal-600 mr-2" />
                    <h3 className="text-lg font-semibold text-teal-900">Информация о конференции</h3>
                  </div>
                  <div className="text-sm text-teal-700">
                    {selectedVacation.comment}
                  </div>
                </div>
              )}

              {selectedVacation.substituteName && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-1">Замещающий преподаватель</div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaUserCheck className="text-green-500 mr-2" />
                      <span className="font-medium">{selectedVacation.substituteName}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedVacation.comment && !selectedVacation.type.includes('conference') && (
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
                    Просмотреть документы
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubstituteModalOpen && <SubstituteModal />}
      {isNewVacationModalOpen && <NewVacationModal />}

    </div>
  );
};

export default VacationPage;
import React, { useState, useMemo } from 'react';
import {
  FaFilter,
  FaFileExport,
  FaUserTie,
  FaChalkboardTeacher,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaGraduationCap,
  FaMedal,
  FaClock,
  FaWrench,
  FaPercent,
  FaLayerGroup,
  FaUserCheck,
  FaCheck,
  FaCog
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Employee {
  name: string;
  position: string;
  department: string;
  base: number;
  bonus: number;
  total: number;
  email?: string;
  phone?: string;
  startDate?: string;
  education?: string;
  achievements?: string[];
  schedule?: string;
  photo?: string;
  experience?: number;
  skills?: string[];
  groups?: Group[];
}

interface Group {
  id: string;
  name: string;
  direction: string;
  studentsCount: number;
  hoursPerWeek: number;
  rate: number;
}

const PayrollPage: React.FC = () => {
  // Состояния для фильтров и модальных окон
  const [filters, setFilters] = useState({
    department: 'all',
    position: 'all',
    period: 'current'
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [automationResults, setAutomationResults] = useState<{
    processingStatus: 'idle' | 'processing' | 'completed' | 'error';
    affectedEmployees: number;
    totalSalaryChange: number;
    groupsProcessed: number;
    calculationDetails: { name: string; oldSalary: number; newSalary: number; change: number }[];
  }>({
    processingStatus: 'idle',
    affectedEmployees: 0,
    totalSalaryChange: 0,
    groupsProcessed: 0,
    calculationDetails: []
  });

  // Демо-данные для статистики
  const summaryStats = {
    totalPayroll: 12500000,
    avgSalary: 350000,
    employeeCount: 45,
    payrollGrowth: 5.2,
    departments: {
      teaching: { count: 28, total: 8400000, avg: 300000 },
      administrative: { count: 12, total: 3000000, avg: 250000 },
      support: { count: 5, total: 1100000, avg: 220000 }
    }
  };

  // Демо-данные для групп
  const groupsData: Group[] = [
    { id: 'g1', name: 'Группа A', direction: 'Программирование', studentsCount: 12, hoursPerWeek: 6, rate: 4000 },
    { id: 'g2', name: 'Группа B', direction: 'Английский язык', studentsCount: 15, hoursPerWeek: 8, rate: 3500 },
    { id: 'g3', name: 'Группа C', direction: 'Математика', studentsCount: 10, hoursPerWeek: 6, rate: 4000 },
    { id: 'g4', name: 'Группа D', direction: 'Физика', studentsCount: 8, hoursPerWeek: 4, rate: 4500 },
    { id: 'g5', name: 'Группа E', direction: 'Программирование', studentsCount: 14, hoursPerWeek: 8, rate: 4000 },
  ];

  // Демо-данные сотрудников
  const employees: Employee[] = [
    {
      name: 'Бекетова А.М.',
      position: 'Учитель математики',
      department: 'Учителя',
      base: 280000,
      bonus: 42000,
      total: 322000,
      email: 'beketova@ab.ai',
      phone: '+7 (777) 123-45-67',
      startDate: '15.09.2020',
      education: 'КазНУ им. аль-Фараби, Математический факультет',
      achievements: ['Лучший учитель 2022', 'Победитель конкурса инноваций'],
      schedule: 'Пн-Пт, 9:00-17:00',
      experience: 8,
      skills: ['Высшая математика', 'Олимпиадная подготовка', 'Методика преподавания'],
      groups: [
        { id: 'g3', name: 'Группа C', direction: 'Математика', studentsCount: 10, hoursPerWeek: 6, rate: 4000 },
      ]
    },
    {
      name: 'Каримова Н.С.',
      position: 'Учитель физики',
      department: 'Учителя',
      base: 275000,
      bonus: 41250,
      total: 316250,
      email: 'karimova@ab.ai',
      phone: '+7 (777) 234-56-78',
      startDate: '01.09.2021',
      education: 'КБТУ, Физико-технический факультет',
      achievements: ['Научная публикация 2023'],
      schedule: 'Пн-Пт, 9:00-17:00',
      experience: 5,
      skills: ['Физика', 'Астрономия', 'Лабораторные работы'],
      groups: [
        { id: 'g4', name: 'Группа D', direction: 'Физика', studentsCount: 8, hoursPerWeek: 4, rate: 4500 },
      ]
    },
    {
      name: 'Мырзахметов К.А.',
      position: 'Учитель программирования',
      department: 'Учителя',
      base: 350000,
      bonus: 52500,
      total: 402500,
      email: 'myrzakhmetov@ab.ai',
      phone: '+7 (777) 345-67-89',
      startDate: '01.03.2019',
      education: 'НУ, Школа образования',
      achievements: ['Медаль "За вклад в образование"'],
      schedule: 'Пн-Пт, 9:00-18:00',
      experience: 12,
      skills: ['Python', 'Java', 'Алгоритмы'],
      groups: [
        { id: 'g1', name: 'Группа A', direction: 'Программирование', studentsCount: 12, hoursPerWeek: 6, rate: 4000 },
        { id: 'g5', name: 'Группа E', direction: 'Программирование', studentsCount: 14, hoursPerWeek: 8, rate: 4000 },
      ]
    }
  ];

  // Форматирование чисел в тенге
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  };

  // Компонент модального окна фильтров
  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Фильтры</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Отдел</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          >
            <option value="all">Все отделы</option>
            <option value="teaching">Учителя</option>
            <option value="administrative">Администрация</option>
            <option value="support">Тех. персонал</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.position}
            onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
          >
            <option value="all">Все должности</option>
            <option value="teacher">Учитель</option>
            <option value="admin">Администратор</option>
            <option value="support">Тех. специалист</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={filters.period}
            onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
          >
            <option value="current">Текущий месяц</option>
            <option value="previous">Предыдущий месяц</option>
            <option value="quarter">Текущий квартал</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onClick={() => {
              setFilters({ department: 'all', position: 'all', period: 'current' });
              setShowFilterModal(false);
            }}
          >
            Сбросить
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            onClick={() => setShowFilterModal(false)}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );

  // Компонент модального окна автоматизации
  const AutomationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Автоматизация расчета зарплаты по группам</h3>
          <button
            onClick={() => setShowAutomationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {automationResults.processingStatus === 'idle' && (
          <div>
            <p className="text-gray-600 mb-6">
              Автоматический расчет зарплат преподавателей на основе нагрузки по группам, количества студентов и часов.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-lg font-medium mb-4">Параметры расчета</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Базовая ставка по часам</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value="4000"
                      disabled
                    />
                    <span className="ml-2 text-gray-600">₸ / час</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Коэффициент за количество студентов</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value="0.05"
                      disabled
                    />
                    <span className="ml-2 text-gray-600">на студента</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Бонус за опыт</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value="0.02"
                      disabled
                    />
                    <span className="ml-2 text-gray-600">за год опыта</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Предупреждение</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Запуск автоматизации приведет к пересчету зарплат всех преподавателей на основе их групп.
                    Убедитесь, что вы хотите продолжить.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                onClick={() => setShowAutomationModal(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center"
                onClick={() => {
                  setAutomationResults({
                    processingStatus: 'processing',
                    affectedEmployees: 0,
                    totalSalaryChange: 0,
                    groupsProcessed: 0,
                    calculationDetails: []
                  });

                  // Имитация обработки
                  setTimeout(() => {
                    const details = employees
                      .filter(emp => emp.groups && emp.groups.length > 0)
                      .map(emp => {
                        const totalHours = emp.groups?.reduce((acc, group) => acc + group.hoursPerWeek, 0) || 0;
                        const totalStudents = emp.groups?.reduce((acc, group) => acc + group.studentsCount, 0) || 0;
                        const experienceMultiplier = 1 + (emp.experience || 0) * 0.02;
                        const studentMultiplier = 1 + totalStudents * 0.05;

                        // Расчет новой зарплаты
                        const newBaseSalary = Math.round(totalHours * 4000 * 4 * experienceMultiplier * studentMultiplier);
                        const newBonus = Math.round(newBaseSalary * 0.15);
                        const newTotal = newBaseSalary + newBonus;

                        return {
                          name: emp.name,
                          oldSalary: emp.total,
                          newSalary: newTotal,
                          change: newTotal - emp.total
                        };
                      });

                    setAutomationResults({
                      processingStatus: 'completed',
                      affectedEmployees: details.length,
                      totalSalaryChange: details.reduce((acc, item) => acc + item.change, 0),
                      groupsProcessed: employees.reduce((acc, emp) => acc + (emp.groups?.length || 0), 0),
                      calculationDetails: details
                    });
                  }, 2000);
                }}
              >
                <FaWrench className="mr-2" />
                Запустить автоматизацию
              </button>
            </div>
          </div>
        )}

        {automationResults.processingStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-800">Обработка данных...</p>
            <p className="text-gray-600">Пожалуйста, подождите пока мы пересчитываем зарплаты</p>
          </div>
        )}

        {automationResults.processingStatus === 'completed' && (
          <div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">Автоматизация завершена успешно</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Расчет зарплат на основе групп выполнен успешно. Вы можете просмотреть детали ниже.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border rounded-lg p-4">
                <div className="text-sm text-gray-600">Обработано сотрудников</div>
                <div className="text-2xl font-bold text-gray-900">{automationResults.affectedEmployees}</div>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <div className="text-sm text-gray-600">Обработано групп</div>
                <div className="text-2xl font-bold text-gray-900">{automationResults.groupsProcessed}</div>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <div className="text-sm text-gray-600">Изменение ФОТ</div>
                <div className={`text-2xl font-bold ${automationResults.totalSalaryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {automationResults.totalSalaryChange >= 0 ? '+' : ''}{formatCurrency(automationResults.totalSalaryChange)}
                </div>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <div className="text-sm text-gray-600">Средняя зарплата</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(automationResults.calculationDetails.reduce((acc, item) => acc + item.newSalary, 0) / automationResults.affectedEmployees)}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Детали изменений</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Сотрудник
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Текущая зарплата
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Новая зарплата
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Изменение
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {automationResults.calculationDetails.map((detail, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{detail.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(detail.oldSalary)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(detail.newSalary)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-medium ${detail.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {detail.change >= 0 ? '+' : ''}{formatCurrency(detail.change)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                onClick={() => setShowAutomationModal(false)}
              >
                Закрыть
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center">
                <FaCheck className="mr-2" />
                Применить изменения
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Фильтрация сотрудников
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      if (filters.department !== 'all' && !employee.department.toLowerCase().includes(filters.department)) {
        return false;
      }
      if (filters.position !== 'all' && !employee.position.toLowerCase().includes(filters.position)) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Компонент модального окна сотрудника
  const EmployeeModal = () => {
    if (!selectedEmployee) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* Шапка */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-t-xl text-white">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <FaUserTie className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                  <p className="text-blue-100">{selectedEmployee.position}</p>
                </div>
              </div>
            </div>

            {/* Основная информация */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-600" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-blue-600" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Образование и опыт</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaGraduationCap className="text-blue-600" />
                        <span>{selectedEmployee.education}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaCalendar className="text-blue-600" />
                        <span>Стаж работы: {selectedEmployee.experience} лет</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Достижения</h3>
                    <div className="space-y-2">
                      {selectedEmployee.achievements?.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <FaMedal className="text-blue-600" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Компетенции</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills?.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Группы преподавателя */}
              {selectedEmployee.groups && selectedEmployee.groups.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Преподаваемые группы</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Группа
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Направление
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Студентов
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Часов в неделю
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ставка
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEmployee.groups.map((group) => (
                          <tr key={group.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{group.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{group.direction}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900">{group.studentsCount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900">{group.hoursPerWeek}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(group.rate)}/час</div>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">Итого:</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {selectedEmployee.groups.reduce((acc, group) => acc + group.studentsCount, 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {selectedEmployee.groups.reduce((acc, group) => acc + group.hoursPerWeek, 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(
                                selectedEmployee.groups.reduce((acc, group) =>
                                  acc + (group.hoursPerWeek * group.rate * 4), 0)
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Зарплата */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Информация о зарплате</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600">Оклад</div>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(selectedEmployee.base)}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600">Премия</div>
                    <div className="text-xl font-bold text-green-600">+{formatCurrency(selectedEmployee.bonus)}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600">Итого</div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(selectedEmployee.total)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Футер */}
            <div className="border-t border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock />
                <span>График работы: {selectedEmployee.schedule}</span>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  История выплат
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Редактировать
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Заголовок и действия */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Управление заработной платой</h1>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter className="mr-2" />
            Фильтры
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
            onClick={() => {
              setAutomationResults({
                processingStatus: 'idle',
                affectedEmployees: 0,
                totalSalaryChange: 0,
                groupsProcessed: 0,
                calculationDetails: []
              });
              setShowAutomationModal(true);
            }}
          >
            <FaCog className="mr-2" />
            Автоматический расчет
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
            <FaPlus className="mr-2" />
            Расчет зарплаты
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Фонд оплаты труда</div>
            <FaChartLine className="text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalPayroll)}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <span>+{summaryStats.payrollGrowth}% к прошлому месяцу</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Средняя зарплата</div>
            <FaUserTie className="text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.avgSalary)}</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <span>+3.8% к прошлому месяцу</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Сотрудников</div>
            <FaUsers className="text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{summaryStats.employeeCount}</div>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <span>{summaryStats.departments.teaching.count} учителей</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Премиальный фонд</div>
            <FaChartLine className="text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalPayroll * 0.1)}</div>
            <div className="text-sm text-blue-600 flex items-center mt-1">
              <span>10% от ФОТ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Анализ по отделам */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Распределение по отделам</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Учителя', value: summaryStats.departments.teaching.total, count: summaryStats.departments.teaching.count },
                { name: 'Администрация', value: summaryStats.departments.administrative.total, count: summaryStats.departments.administrative.count },
                { name: 'Тех. персонал', value: summaryStats.departments.support.total, count: summaryStats.departments.support.count }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#1F2937' }}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Динамика ФОТ</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Янв', value: 11500000 },
                { month: 'Фев', value: 11800000 },
                { month: 'Мар', value: 12000000 },
                { month: 'Апр', value: 12200000 },
                { month: 'Май', value: 12500000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#1F2937' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Статистика по группам */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Статистика по группам</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Направление
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество студентов
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Часов в неделю
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ставка
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Расходы в месяц
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupsData.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{group.direction}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{group.studentsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{group.hoursPerWeek}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{formatCurrency(group.rate)}/час</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(group.hoursPerWeek * group.rate * 4)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Таблица сотрудников */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Список сотрудников</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сотрудник
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Должность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отдел
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оклад
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Премия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Итого
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(employee.base)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">+{formatCurrency(employee.bonus)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(employee.total)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальные окна */}
      {showFilterModal && <FilterModal />}
      {selectedEmployee && <EmployeeModal />}
      {showAutomationModal && <AutomationModal />}
    </div>
  );
};

export default PayrollPage;
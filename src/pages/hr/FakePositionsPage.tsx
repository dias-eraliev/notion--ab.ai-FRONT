import React, { useState } from 'react';
import { 
  FaRobot, 
  FaFilter, 
  FaSearch, 
  FaFileExport,
  FaExclamationTriangle,
  FaCheck,
  FaInfoCircle,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaFingerprint,
  FaUserCheck
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area
} from 'recharts';

// Типы данных
type RiskLevel = 'high' | 'medium' | 'low' | 'none';
type AnomalyType = 
  | 'no_presence' 
  | 'schedule_conflict' 
  | 'workload_excess' 
  | 'qualification_mismatch'
  | 'document_inconsistency';

interface FakePositionAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  riskLevel: RiskLevel;
  anomalyType: AnomalyType;
  description: string;
  detectedDate: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  evidences: {
    type: string;
    description: string;
    confidenceScore: number;
  }[];
  aiConfidence: number;
  resolutionNote?: string;
  assignedTo?: string;
}

// Данные для демонстрации
const anomalyTypes = [
  { 
    value: 'no_presence', 
    label: 'Отсутствие фактического присутствия',
    description: 'Сотрудник не был замечен на рабочем месте в указанные часы'
  },
  { 
    value: 'schedule_conflict', 
    label: 'Конфликт расписания',
    description: 'Сотрудник числится одновременно в нескольких местах'
  },
  { 
    value: 'workload_excess', 
    label: 'Превышение нормы нагрузки',
    description: 'Указанная нагрузка превышает физически возможную'
  },
  { 
    value: 'qualification_mismatch', 
    label: 'Несоответствие квалификации',
    description: 'Квалификация не соответствует занимаемой должности'
  },
  { 
    value: 'document_inconsistency', 
    label: 'Несоответствие в документах',
    description: 'Обнаружены противоречия в документации'
  }
];

const initialAlerts: FakePositionAlert[] = [
  {
    id: 'alert001',
    employeeId: '101',
    employeeName: 'Сатпаев Арман Нурланович',
    position: 'Преподаватель физики',
    department: 'Кафедра естественных наук',
    riskLevel: 'high',
    anomalyType: 'no_presence',
    description: 'Сотрудник числится на полной ставке, но камеры не зафиксировали его присутствие в школе в указанные часы работы за последние 3 недели.',
    detectedDate: '2024-03-10',
    status: 'investigating',
    evidences: [
      {
        type: 'Данные системы контроля доступа',
        description: 'Отсутствуют записи входа/выхода в период с 20.02.2024 по 10.03.2024',
        confidenceScore: 0.95
      },
      {
        type: 'Журнал посещений',
        description: 'Занятия проводились согласно расписанию, но преподаватель не отмечался в журнале',
        confidenceScore: 0.85
      },
      {
        type: 'Данные видеонаблюдения',
        description: 'Анализ видеозаписей не выявил присутствия сотрудника в здании',
        confidenceScore: 0.90
      }
    ],
    aiConfidence: 0.92,
    assignedTo: 'Алиева Д.К.'
  },
  {
    id: 'alert002',
    employeeId: '102',
    employeeName: 'Нурмагамбетова Айгуль Маратовна',
    position: 'Преподаватель математики',
    department: 'Кафедра математики',
    riskLevel: 'medium',
    anomalyType: 'schedule_conflict',
    description: 'Обнаружено совпадение расписания занятий в двух разных учебных заведениях.',
    detectedDate: '2024-03-15',
    status: 'new',
    evidences: [
      {
        type: 'Расписание занятий',
        description: 'Преподаватель числится ведущим занятия в школе №1 и школе №5 в одно и то же время (вторник и четверг, 10:00-11:30)',
        confidenceScore: 0.98
      },
      {
        type: 'Данные системы контроля доступа',
        description: 'Отсутствуют записи входа/выхода в школу №1 в указанные дни',
        confidenceScore: 0.90
      }
    ],
    aiConfidence: 0.88
  },
  {
    id: 'alert003',
    employeeId: '103',
    employeeName: 'Бекенов Даулет Ержанович',
    position: 'Преподаватель информатики',
    department: 'Кафедра информатики',
    riskLevel: 'low',
    anomalyType: 'workload_excess',
    description: 'Суммарная нагрузка сотрудника превышает нормативы на 50%.',
    detectedDate: '2024-03-05',
    status: 'resolved',
    evidences: [
      {
        type: 'Табель учета рабочего времени',
        description: 'Указано 60 часов в неделю при нормативе 40 часов',
        confidenceScore: 0.95
      },
      {
        type: 'Расписание занятий',
        description: 'Расписание содержит 36 часов аудиторной нагрузки',
        confidenceScore: 0.97
      }
    ],
    aiConfidence: 0.85,
    resolutionNote: 'Сотрудник ведет дополнительные занятия в рамках проектной деятельности. Документы оформлены корректно, нагрузка согласована.'
  },
  {
    id: 'alert004',
    employeeId: '104',
    employeeName: 'Жумабаев Азамат Кайратович',
    position: 'Преподаватель химии',
    department: 'Кафедра естественных наук',
    riskLevel: 'high',
    anomalyType: 'qualification_mismatch',
    description: 'Сотрудник ведет занятия по химии, но имеет диплом по экономике.',
    detectedDate: '2024-02-28',
    status: 'new',
    evidences: [
      {
        type: 'Документы об образовании',
        description: 'В личном деле находится диплом о высшем образовании по специальности "Экономика"',
        confidenceScore: 0.99
      },
      {
        type: 'Должностная инструкция',
        description: 'Требуется специализированное образование в области химии или смежных наук',
        confidenceScore: 0.90
      }
    ],
    aiConfidence: 0.95
  },
  {
    id: 'alert005',
    employeeId: '105',
    employeeName: 'Тулегенова Динара Аскаровна',
    position: 'Преподаватель литературы',
    department: 'Кафедра филологии',
    riskLevel: 'medium',
    anomalyType: 'document_inconsistency',
    description: 'Обнаружены несоответствия в документах о стаже работы.',
    detectedDate: '2024-03-12',
    status: 'dismissed',
    evidences: [
      {
        type: 'Трудовая книжка',
        description: 'Указан стаж работы 15 лет',
        confidenceScore: 0.85
      },
      {
        type: 'Данные пенсионного фонда',
        description: 'В базе данных ПФР числится 8 лет стажа',
        confidenceScore: 0.90
      }
    ],
    aiConfidence: 0.75,
    resolutionNote: 'После проверки выяснилось, что часть стажа была получена в частных образовательных учреждениях и не отражена в ПФР. Предоставлены подтверждающие документы.'
  }
];

// Компонент
const FakePositionsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<FakePositionAlert[]>(initialAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<FakePositionAlert['status'] | 'all'>('all');
  const [selectedAlert, setSelectedAlert] = useState<FakePositionAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Фильтрация данных
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = selectedRiskLevel === 'all' || alert.riskLevel === selectedRiskLevel;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });

  // Статистические данные
  const riskLevelStats = [
    { name: 'Высокий', value: alerts.filter(a => a.riskLevel === 'high').length },
    { name: 'Средний', value: alerts.filter(a => a.riskLevel === 'medium').length },
    { name: 'Низкий', value: alerts.filter(a => a.riskLevel === 'low').length },
    { name: 'Нет', value: alerts.filter(a => a.riskLevel === 'none').length }
  ];

  const statusStats = [
    { name: 'Новые', value: alerts.filter(a => a.status === 'new').length },
    { name: 'Расследуются', value: alerts.filter(a => a.status === 'investigating').length },
    { name: 'Решены', value: alerts.filter(a => a.status === 'resolved').length },
    { name: 'Отклонены', value: alerts.filter(a => a.status === 'dismissed').length }
  ];

  const anomalyStats = anomalyTypes.map(type => ({
    name: type.label,
    value: alerts.filter(a => a.anomalyType === type.value).length
  }));

  const trendData = [
    { month: 'Янв', alerts: 2 },
    { month: 'Фев', alerts: 4 },
    { month: 'Мар', alerts: 7 },
    { month: 'Апр', alerts: 3 }
  ];

  // Вспомогательные функции
  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'none': return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: FakePositionAlert['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnomalyLabel = (type: AnomalyType) => {
    return anomalyTypes.find(t => t.value === type)?.label || type;
  };

  const getStatusLabel = (status: FakePositionAlert['status']) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'investigating': return 'Расследуется';
      case 'resolved': return 'Решен';
      case 'dismissed': return 'Отклонен';
    }
  };

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];

  // Обработчики событий
  const handleAlertClick = (alert: FakePositionAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Контроль фиктивных ставок (AI)</h1>
          <p className="text-sm text-gray-500">Система обнаружения потенциальных нарушений с помощью искусственного интеллекта</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
            <FaRobot className="mr-2" />
            Запустить проверку
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center">
            <FaFileExport className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Всего уведомлений</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{alerts.length}</div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-green-600">+3 за последний месяц</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Новые</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{alerts.filter(a => a.status === 'new').length}</div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">Требуют проверки</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">В процессе</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{alerts.filter(a => a.status === 'investigating').length}</div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">Расследуются</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Потенциальная экономия</div>
          <div className="text-2xl font-bold text-green-600 mt-1">₸ 2,450,000</div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">На основе неподтвержденных ставок</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-xs p-6">
          <h2 className="text-lg font-semibold mb-4">Распределение по уровню риска</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={riskLevelStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskLevelStats.map((entry, index) => {
                  const colors = {
                    'Высокий': '#EF4444',
                    'Средний': '#F59E0B',
                    'Низкий': '#3B82F6',
                    'Нет': '#10B981'
                  };
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[entry.name as keyof typeof colors]} 
                      stroke="none"
                    />
                  );
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: '8px 12px'
                }}
                formatter={(value: number, name: string) => [
                  `${value} уведомлений`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {riskLevelStats.map((entry, index) => {
              const colors = {
                'Высокий': 'bg-red-500',
                'Средний': 'bg-yellow-500',
                'Низкий': 'bg-blue-500',
                'Нет': 'bg-green-500'
              };
              const textColors = {
                'Высокий': 'text-red-700',
                'Средний': 'text-yellow-700',
                'Низкий': 'text-blue-700',
                'Нет': 'text-green-700'
              };
              return (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[entry.name as keyof typeof colors]}`} />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${textColors[entry.name as keyof typeof textColors]}`}>
                    {entry.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Типы аномалий</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={anomalyStats}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Динамика обнаружений</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="alerts" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск сотрудника..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value as RiskLevel | 'all')}
            >
              <option value="all">Все уровни риска</option>
              <option value="high">Высокий риск</option>
              <option value="medium">Средний риск</option>
              <option value="low">Низкий риск</option>
              <option value="none">Без риска</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as FakePositionAlert['status'] | 'all')}
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="investigating">Расследуются</option>
              <option value="resolved">Решены</option>
              <option value="dismissed">Отклонены</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
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
                Тип аномалии
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Уровень риска
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата обнаружения
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Достоверность AI
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <tr 
                key={alert.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAlertClick(alert)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{alert.employeeName}</div>
                  <div className="text-xs text-gray-500">{alert.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getAnomalyLabel(alert.anomalyType)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(alert.riskLevel)}`}>
                    {alert.riskLevel === 'high' ? 'Высокий' : 
                     alert.riskLevel === 'medium' ? 'Средний' : 
                     alert.riskLevel === 'low' ? 'Низкий' : 'Нет'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(alert.detectedDate).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      alert.aiConfidence >= 0.9 ? 'text-green-600' : 
                      alert.aiConfidence >= 0.7 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {Math.round(alert.aiConfidence * 100)}%
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          alert.aiConfidence >= 0.9 ? 'bg-green-500' : 
                          alert.aiConfidence >= 0.7 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`} 
                        style={{ width: `${alert.aiConfidence * 100}%` }}>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                    {getStatusLabel(alert.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlertClick(alert);
                    }}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно с детальной информацией об уведомлении */}
      {isModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg mr-4 ${
                    selectedAlert.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                    selectedAlert.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedAlert.riskLevel === 'low' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    <FaExclamationTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full mr-2 ${getRiskLevelColor(selectedAlert.riskLevel)}`}>
                        {selectedAlert.riskLevel === 'high' ? 'Высокий риск' : 
                        selectedAlert.riskLevel === 'medium' ? 'Средний риск' : 
                        selectedAlert.riskLevel === 'low' ? 'Низкий риск' : 'Нет риска'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAlert.status)}`}>
                        {getStatusLabel(selectedAlert.status)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      {getAnomalyLabel(selectedAlert.anomalyType)}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Обнаружено {new Date(selectedAlert.detectedDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Сотрудник</div>
                  <div className="text-base font-medium text-gray-900">{selectedAlert.employeeName}</div>
                  <div className="text-sm text-gray-500 mt-1">{selectedAlert.position}</div>
                  <div className="text-sm text-gray-500">{selectedAlert.department}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">ID сотрудника</div>
                  <div className="flex items-center">
                    <FaFingerprint className="text-blue-500 mr-2" />
                    <span className="text-base font-medium text-gray-900">{selectedAlert.employeeId}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Достоверность AI</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(selectedAlert.aiConfidence * 100)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedAlert.aiConfidence >= 0.9 ? 'bg-green-500' : 
                        selectedAlert.aiConfidence >= 0.7 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} 
                      style={{ width: `${selectedAlert.aiConfidence * 100}%` }}>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Описание</h3>
                <p className="text-gray-700">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Доказательства</h3>
                <div className="space-y-4">
                  {selectedAlert.evidences.map((evidence, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900">{evidence.type}</div>
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500 mr-2">Достоверность:</div>
                          <span className={`text-sm font-medium ${
                            evidence.confidenceScore >= 0.9 ? 'text-green-600' : 
                            evidence.confidenceScore >= 0.7 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {Math.round(evidence.confidenceScore * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{evidence.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAlert.assignedTo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Назначено</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaUserCheck className="text-blue-500 mr-2" />
                      <span className="font-medium">{selectedAlert.assignedTo}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedAlert.resolutionNote && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Примечание по разрешению</h3>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-green-500 mr-2 mt-0.5" />
                      <p className="text-green-800">{selectedAlert.resolutionNote}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                {selectedAlert.status === 'new' && (
                  <>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md mr-2 flex items-center">
                      <FaThumbsDown className="mr-2" />
                      Отклонить
                    </button>
                    <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md mr-2 flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Начать расследование
                    </button>
                  </>
                )}
                {selectedAlert.status === 'investigating' && (
                  <>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md mr-2 flex items-center">
                      <FaThumbsDown className="mr-2" />
                      Отклонить как ложное
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center">
                      <FaThumbsUp className="mr-2" />
                      Подтвердить нарушение
                    </button>
                  </>
                )}
                {(selectedAlert.status === 'resolved' || selectedAlert.status === 'dismissed') && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
                    <FaFileExport className="mr-2" />
                    Экспорт отчета
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

export default FakePositionsPage; 